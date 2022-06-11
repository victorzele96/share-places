import { createContext, useState } from "react";

import { useHttpClient } from "../hooks/http-hook";

const PlaceContext = createContext({
  places: [],
  placeForm: {},
  setPlaceForm: (prevState) => {},
  createPlace: (placeData) => {},
  addPlace: (place) => {},
  editPlace: (placeId, token) => {},
  deletePlace: (placeId) => {},
  uploadImage: (images, preset) => {},
  setImgsToDelete: (imgs_list) => {},
  getPlaceById: (placeId) => {},
  setPlaces: (places) => {},
  isLoading: false,
});

export const PlaceContextProvider = (props) => {
  const [placeForm, setPlaceForm] = useState({});
  const [places, setPlaces] = useState([]);
  const { isLoading, sendRequest } = useHttpClient();
  const [imgsToDelete, setImgsToDelete] = useState([]);

  const createPlaceHandler = async (token) => {
    console.log(placeForm.images);
    console.log(typeof placeForm.images);
    try {
      await sendRequest(
        process.env.REACT_APP_BACK_URL + "/places",
        "POST",
        JSON.stringify({
          title: placeForm.title,
          description: placeForm.description,
          address: placeForm.address,
          images: placeForm.images,
        }),
        {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const addPlaceHandler = (place) => {
    setPlaces((prevPlaces) => {
      return prevPlaces.concat(place);
    });
  };

  const getPlaceById = (placeId) => {
    const temp = places.filter(place => place.id === placeId);
    return temp[0];
  }

  const editPlaceHandler = async (placeId, token) => {

    try {
      await sendRequest(
        process.env.REACT_APP_BACK_URL + "/places/" + placeId,
        "PATCH",
        JSON.stringify({
          title: placeForm.title,
          description: placeForm.description,
          address: placeForm.address,
          images: placeForm.images,
          imgsToDelete,
        }),
        {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const deletePlaceHandler = (placeId) => {
    setPlaces((prevPlaces) => {
      return prevPlaces.filter((place) => place.id !== placeId);
    });
  };

  const uploadImage = async (images, preset) => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    let imagesUrl = [];
    try {
      for (const image of images ? images : placeForm.images) {
        formData.append("file", image);
        formData.append("upload_preset", preset);

        const data = await sendRequest(url, "POST", formData);
        imagesUrl.push(data.secure_url);
      }
      setPlaceForm((prevState) => ({ ...prevState, images: imagesUrl }));
    } catch (err) {
      console.log(err);
    }
  };

  const context = {
    places,
    placeForm,
    setPlaceForm,
    createPlace: createPlaceHandler,
    addPlace: addPlaceHandler,
    editPlace: editPlaceHandler,
    deletePlace: deletePlaceHandler,
    uploadImage,
    isLoading,
    setImgsToDelete,
    getPlaceById,
    setPlaces
  };

  return (
    <PlaceContext.Provider value={context}>
      {props.children}
    </PlaceContext.Provider>
  );
};

export default PlaceContext;
