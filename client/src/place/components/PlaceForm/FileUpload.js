import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { DropzoneAreaBase } from "material-ui-dropzone";

import PlaceContext from "../../../shared/context/place-context";
import CircularProgressModal from "../../../shared/components/UIElements/CircularProgressModal";

import { Alert, Box } from "@mui/material";

import classes from "./FileUpload.module.css";

const FileUpload = (props) => {
  const placeCtx = useContext(PlaceContext);
  const [images, setImages] = useState([]);
  const [imagesFiles, setImagesFiles] = useState([]);
  const [paths, setPaths] = useState([]);
  const params = useParams();

  const addImageHandler = (newImages) => {
    console.log("onAdd", newImages);
    let imagesPaths = [];
    let files = [];
    // eslint-disable-next-line
    for (const [key, value] of Object.entries(newImages)) {
      imagesPaths.push(value.file.path);
      files.push(value.file);
    }
    setPaths([].concat(paths, imagesPaths));
    setImages([].concat(images, newImages));
    setImagesFiles(files);

    placeCtx.uploadImage(files, process.env.REACT_APP_CLOUDINARY_PRESET);
  };

  const deleteImageHandler = (deleteImage) => {
    console.log("onDelete", deleteImage);

    let indexToDelete = images.indexOf(deleteImage);
    setImages((prevState) =>
      prevState.filter((image) => images.indexOf(image) !== indexToDelete)
    );

    setPaths((prevState) =>
      prevState.filter((path) => paths.indexOf(path) !== indexToDelete)
    );
    // TODO: add serverside formdata
  };

  const createError = (message) => {
    if (!props.errors.includes(message)) {
      props.setErrors((prevState) => prevState.concat(message));
    }
  };

  const clearError = (prop) => {
    console.log(props.errors.some((err) => err.includes(prop)));
    if (props.errors.some((err) => err.includes(prop))) {
      props.setErrors((prevState) =>
        prevState.filter((err) => !err.includes(prop))
      );
    }
  };

  useEffect(() => {
    const images_arr = placeCtx.places.map((place) =>
      place.id === params.pid ? place.images : null
    );
    images_arr.map((images) =>
      images ? placeCtx.setImgsToDelete(images) : null
    );
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      clearError("You must upload at least one image.");
    } else createError("You must upload at least one image.");
  }, [images]);

  useEffect(() => {
    placeCtx.setPlaceForm((prevState) => ({
      ...prevState,
      images: imagesFiles,
    }));
  }, [images, paths, imagesFiles]);

  return (
    <>
      {placeCtx.isLoading && <CircularProgressModal />}
      <div className={classes.container}>
        <div>
          <DropzoneAreaBase
            style={classes}
            fileObjects={images}
            onAdd={addImageHandler}
            onDelete={deleteImageHandler}
            showPreviews={true}
            showPreviewsInDropzone={false}
            acceptedFiles={["image/*"]}
            showFileNames={false}
            showAlerts={false}
            filesLimit={6}
            useChipsForPreview
            previewGridProps={{ container: { spacing: 1, direction: "row" } }}
            previewChipProps={{ classes: { root: classes.previewChip } }}
            previewText="Selected files"
          />
        </div>
      </div>
    </>
  );
};

export default FileUpload;
