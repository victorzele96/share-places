import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Container,
  Paper,
  Button,
  Typography,
  Alert,
  Backdrop,
  CircularProgress,
} from "@mui/material";

import PlaceInfoForm from "../components/PlaceForm/PlaceInfoForm";
import FileUpload from "../components/PlaceForm/FileUpload";

import { useHttpClient } from "../../shared/hooks/http-hook";

import { AuthContext } from "../../shared/context/auth-context";

import { makeStyles } from "@mui/styles";
import PlaceContext from "../../shared/context/place-context";

const useStyles = makeStyles(() => ({
  container: {
    "overflow-y": "scroll",
    marginTop: "40px",
  },
  innerContainer: {
    alignItems: "center",
    marginBottom: "32px",
  },
}));

const NewPlace = (props) => {
  const classes = useStyles();
  const authCtx = useContext(AuthContext);
  const placeCtx = useContext(PlaceContext);
  const navigate = useNavigate();
  const { isLoading, sendRequest } = useHttpClient();
  const [placeData, setPlaceData] = useState({});
  const [errors, setErrors] = useState([]);

  const submitHandler = () => {
    console.log("upload place");
    placeCtx.createPlace(authCtx.token);
    if (!placeCtx.isLoading) {
      setTimeout(() => {
        navigate("/");
      }, 2500);
    }
  };

  return (
    <>
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress size={85} thickness={2.5} />
        </Backdrop>
      )}
      <Container
        id={props.tagId}
        component="main"
        className={classes.innerContainer}
      >
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            Add Place
          </Typography>
          <PlaceInfoForm />
          <FileUpload setErrors={setErrors} errors={errors}/>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "0rem" }}>
            <Button
              variant="contained"
              sx={{ mt: 3, ml: 1 }}
              onClick={submitHandler}
            >
              Submit
            </Button>
          </Box>
        </Paper>
        {errors.length > 0 && (
          <>
            <Box id="error-container" sx={{ marginTop: "20px" }}>
              {errors.map((error, key) => (
                <Alert severity="error" key={key}>
                  {error}
                </Alert>
              ))}
            </Box>
          </>
        )}
      </Container>
    </>
  );
};

export default NewPlace;
