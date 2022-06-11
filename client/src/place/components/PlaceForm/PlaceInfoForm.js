import { useContext, useEffect, useState } from "react";

import usePlacesAutocomplete from "use-places-autocomplete";

import { Grid, Typography, TextField, Autocomplete } from "@mui/material";
import PlaceContext from "../../../shared/context/place-context";

const initialPlaceState = {
  title: "",
  description: "",
  address: "",
  images: [],
  creator: "",
};

const PlaceInfoForm = (props) => {
  const placeCtx = useContext(PlaceContext);
  const [placeState, setPlaceState] = useState(initialPlaceState);
  const [selectedValue, setSelectedValue] = useState(""); // address
  const [errors, setError] = useState([]);

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
    if (!errors.includes(message)) {
      setError(prevState => prevState.concat(message));
    }
  };

  const clearError = (prop) => {
    console.log(errors.some(err => err.includes(prop)))
    if (errors.some(err => err.includes(prop))) {
      setError(prevState => prevState.filter(err => !err.includes(prop)));
    }
  };

  const changeHandler = (event) => {
    for (const [key1, value1] of Object.entries(placeState)) {
      if (key1 === event.target.name) {
        if (key1 === 'address') {
          if (event.target.value === '' || !relevantDataSet.options.includes(event.target.value)) {
            createError(`${key1} must be legit address (google format)!`);
          } else {
            clearError(key1);
          }
        }
        setPlaceState((prevState) => ({
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
      setPlaceState(prevState => ({ ...prevState, address: selectedValue }));
      placeCtx.setPlaceForm(prevState => ({ ...prevState, address: selectedValue }));
    }
  };

  useEffect(() => {
    window.sessionStorage.setItem(
      "new-place-state",
      JSON.stringify(placeState)
    );
  }, [placeState]);

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Place Information
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
          />
        </Grid>
        <Grid item xs={12} />
      </Grid>
    </>
  );
};

export default PlaceInfoForm;
