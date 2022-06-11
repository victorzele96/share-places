import { useState, useEffect, Children } from "react";
import { Link } from "react-router-dom";

import PlaceItem from "./PlaceItem";

import { Button, Card, Container, Stack, Grid } from "@mui/material";

import { makeStyles } from "@mui/styles";


const useStyles = makeStyles((theme) => ({
  listContainer: {
    "overflow-y": "scroll",
    marginTop: "40px",
    maxHeight: "800px",
  },
  listContainerInner: {
    alignItems: "center",
    paddingBottom: "40px",
    marginTop: "40px",
    overflow: "hidden",
  },
  loadingContainer: {
    width: "fit-content",
    blockSize: "fit-content",
    marginTop: "5vh",
    textAlign: "center",
  },
  loadingCard: {
    padding: "1rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.26)",
  },
  container: {
    width: "fit-content",
    blockSize: "fit-content",
    marginTop: "5vh",
    textAlign: "center",
  },
  card: {
    padding: "1rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.26)",
  },
}));

const List = (props) => {
  const [loadedPlaces, setLoadedPlaces] = useState(props.places);

  const classes = useStyles();

  useEffect(() => {
    setLoadedPlaces(props.places);
  }, [props.places]);

  if (props.isLoading) {
    return (
      <Container id={props.tagId} className={classes.container}>
        <Card className={classes.card}>
          <p>Loading...</p>
        </Card>
      </Container>
    );
  }

  let text;
  if (props.load === "by-place-id") {
    text = "Could not find place with specified id";
  }

  if (props.load === "all" || props.load === "by-user-id") {
    text = "There are no places yet. Start adding some?";
  }

  if (props.load === "favorites") {
    text = "There are no favorites yet. Start adding some?";
  }

  const content =
    props.places.length === 0 ? (
      <Container id={props.tagId} className={classes.container}>
        <Card className={classes.card}>
          <p>{text}</p>
          {props.load === "by-user-id" && (
            <Button variant="outlined" component={Link} to="/add-place">
              Add Place
            </Button>
          )}
        </Card>
      </Container>
    ) : (
      <Stack
        id={props.tagId || "list-stack"}
        spacing="30px"
        className={classes.listContainerInner}
      >
        <Grid
          container
          spacing={6}
          justifyContent="space-around"
          style={{ padding: "50px" }}
        >
          {Children.toArray(
            loadedPlaces.slice(0).reverse().map((place, key) => (
              <Grid item xs={12} sm={12} md={4}>
              <PlaceItem
                place={place}
                placeId={place.id}
                imageSrc={place.image}
                placeRate={place.ratings}
                onDelete={props.onDelete}
              />
            </Grid>
            ))
          )}
        </Grid>
      </Stack>
    );

  return <>{content}</>;
};

export default List;
