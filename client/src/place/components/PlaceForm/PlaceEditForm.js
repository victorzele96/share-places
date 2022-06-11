import { useContext, useEffect, useState } from "react";

import usePlacesAutocomplete from "use-places-autocomplete";

import { Grid, Typography, TextField, Autocomplete } from "@mui/material";
import PlaceContext from "../../../shared/context/place-context";

const PlaceEditForm = (props) => {
  const placeCtx = useContext(PlaceContext);
  const [selectedValue, setSelectedValue] = useState(""); // address

  const {
    // eslint-disable-next-line
    value,
    suggestions: { status, data },
    setValue,
  } = usePlacesAutocomplete();

  const autocompleteChangeHandler = (event) => {
    setValue(event.target.value);
  };

  const selectChangeHandler = (event, value) => {
    setSelectedValue(value);
    changeHandler(event);
  };

  const relevantDataSet = {
    options: status === "OK" ? data.map(({ description }) => description) : [],
  };

  const createError = (message) => {
    if (!props.errors.includes(message)) {
      props.setError((prevState) => prevState.concat(message));
    }
  };

  const clearError = (prop) => {
    console.log(props.errors.some((err) => err.includes(prop)));
    if (props.errors.some((err) => err.includes(prop))) {
      props.setError((prevState) => prevState.filter((err) => !err.includes(prop)));
    }
  };

  const changeHandler = (event) => {
    for (const [key1, value1] of Object.entries(placeCtx.placeForm)) {
      if (key1 === event.target.name) {
        if (key1 === "address") {
          if (
            event.target.value === "" ||
            !relevantDataSet.options.includes(event.target.value)
          ) {
            createError(`${key1} must be legit address (google format)!`);
          } else {
            clearError(key1);
          }
        }
        placeCtx.setPlaceForm((prevState) => ({
          ...prevState,
          [key1]: event.target.value,
        }));
        placeCtx.setPlaceForm((prevState) => ({
          ...prevState,
          [key1]: event.target.value,
        }));
      }
    }
    if (relevantDataSet.options.includes(selectedValue)) {
        placeCtx.setPlaceForm((prevState) => ({ ...prevState, address: selectedValue }));
      placeCtx.setPlaceForm((prevState) => ({
        ...prevState,
        address: selectedValue,
      }));
    }
  };

  useEffect(() => {
    placeCtx.setPlaceForm(props.place);
    setSelectedValue(props.place.address);
}, [props.place]);

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Place Edit Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="title"
            name="title"
            label="Title"
            fullWidth
            variant="standard"
            value={placeCtx.placeForm.title || ''}
            onChange={changeHandler}
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            popupIcon={null}
            onChange={selectChangeHandler}
            {...relevantDataSet}
            id="address"
            blurOnSelect
            renderInput={(params) => (
              <>
                <TextField
                  onChange={autocompleteChangeHandler}
                  {...params}
                  variant="standard"
                  label="Address"
                />
              </>
            )}
            value={placeCtx.placeForm.address || ''}
          />
          <p style={{ opacity: "0.5", marginLeft: "1rem" }}>
            Example: Street St Number, City, Country
          </p>
        </Grid>

        <Grid item xs={12}>
          <TextField
            id="description"
            name="description"
            label="description"
            multiline
            rows={3}
            fullWidth
            inputProps={{ maxLength: 500 }}
            onChange={changeHandler}
            value={placeCtx.placeForm.description || ''}
          />
        </Grid>
        <Grid item xs={12} />
      </Grid>
    </>
  );
};

export default PlaceEditForm;
