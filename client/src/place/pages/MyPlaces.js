import { useContext, useEffect, useState, useCallback } from "react";

import { Container } from "@mui/material";

import List from '../components/List';

import { AuthContext } from "../../shared/context/auth-context";

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

const MyPlaces = (props) => {
  const authCtx = useContext(AuthContext);
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const { isLoading, sendRequest } = useHttpClient();

  const loadPlaces = useCallback(async () => {
    let url = process.env.REACT_APP_BACK_URL + `/places/user/${authCtx.user.userId}`;

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
    }
  }, [sendRequest, authCtx.user.userId]);

  const deletePlaceHandler = deletedPlaceId => {
    setLoadedPlaces(prevState => prevState.filter(place => place.id !== deletedPlaceId));
  };

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  const classes = useStyles();

  return (
    <Container id={props.tagId} className={classes.container}>
      <List
        load='by-user-id'
        tagId={props.tagId}
        onDelete={deletePlaceHandler}
        isLoading={isLoading}
        places={loadedPlaces}
      />
    </Container>
  )
}

export default MyPlaces;