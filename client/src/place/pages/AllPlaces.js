import { useState, useCallback, useEffect, useContext } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";

import PlaceContext from "../../shared/context/place-context";
import List from "../components/List";

const AllPlaces = (props) => {
  const placeCtx = useContext(PlaceContext);
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const { isLoading, sendRequest } = useHttpClient();

  const loadPlaces = useCallback(async () => {
    let url = process.env.REACT_APP_BACK_URL + "/places";

    try {
      const responseData = await sendRequest(url);
      let data;
      let data_arr = [];
      let flag = false;
      // eslint-disable-next-line
      for (const [key, value] of Object.entries(responseData)) {
        if (Array.isArray(value)) {
          data = value;
          flag = true;
        } else {
          if (value?.length > 1) {
            value.map((item) => data_arr.push(item));
          } else {
            data_arr.push(value);
          }
        }
      }
      setLoadedPlaces((prevState) => prevState.concat(flag ? data : data_arr));
    } catch (err) {
      console.log(err.message);
    }
  }, [sendRequest]);

  const deletePlaceHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevState) =>
      prevState.filter((place) => place.id !== deletedPlaceId)
    );
  };

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  useEffect(() => {
    placeCtx.setPlaces(prevState => loadedPlaces);
  }, [loadedPlaces]);

  // TODO: setValues in placeEditForm !!!

  return (
    <>
      <List
        load="all"
        tagId={props.tagId}
        onDelete={deletePlaceHandler}
        isLoading={isLoading}
        places={loadedPlaces}
      />
    </>
  );
};
export default AllPlaces;
