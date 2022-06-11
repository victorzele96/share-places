import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Container } from "@mui/material";

import List from '../../place/components/List';

import { useHttpClient } from "../../shared/hooks/http-hook";

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    width: "fit-content",
    blockSize: "fit-content",
    marginTop: "5vh",
    textAlign: "left",
  }
}));

const ShowPlace = (props) => {
  const { placeId } = useParams();
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const { isLoading, sendRequest } = useHttpClient();

  const loadPlaces = useCallback(async () => {
    let url = process.env.REACT_APP_BACK_URL + `/places/${placeId}`;

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
            value.map(item => data_arr.push(item));
          } else {
            data_arr.push(value);
          }
        }
      }
      setLoadedPlaces(prevState => prevState.concat(flag ? data : data_arr));
    } catch (err) {
      console.log(err.message);
      setLoadedPlaces([]);
    }
  }, [sendRequest, placeId]);

  const deletePlaceHandler = deletedPlaceId => {
    setLoadedPlaces(prevState => prevState.filter(property => property.id !== deletedPlaceId));
  };

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  const classes = useStyles();

  return (
    <Container id={props.tagId} className={classes.container}>
      <List
        load='by-place-id'
        tagId={props.tagId}
        onDelete={deletePlaceHandler}
        isLoading={isLoading}
        places={loadedPlaces}
      />
    </Container>
  )
}

export default ShowPlace;