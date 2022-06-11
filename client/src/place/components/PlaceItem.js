import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import DeployAvatar from "../../shared/components/UIElements/Avatar";
import ModalMap from "../../shared/components/UIElements/Modal";
import SharePlace from "./SharePlace";
import HoverRating from "./HoverRating";
import ImageGallery from "./carousel/ImageGallery";

import { styled } from "@mui/material/styles";

import {
  Stack,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
  Typography,
  Dialog,
  Backdrop,
  CircularProgress,
  DialogTitle,
  DialogActions,
  Divider,
  Button,
  Box,
} from "@mui/material";

import FavoritesContext from "../../shared/context/favorites-context";
import { AuthContext } from "../../shared/context/auth-context";

import { useHttpClient } from "../../shared/hooks/http-hook";

import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 700,
    marginBottom: "40px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.26)",
  },
  details: {
    svg: {
      marginRight: "20px",
      fontSize: "25px",
    },
  },
  leftIcon: {
    marginRight: "1rem",
  },
  rightIcon: {
    marginLeft: "1rem",
  },
  btn: {
    width: "70px",
    marginLeft: 5,
    marginRight: 5,
  },
  btnBox: {
    width: "100%",
    justifyContent: "right",
    display: "flex",
  },
}));

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const PlaceItem = (props) => {
  const favoritesCtx = useContext(FavoritesContext);
  const authCtx = useContext(AuthContext);

  const { isLoading, sendRequest } = useHttpClient();
  const navigate = useNavigate();

  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [currentValue, setCurrentValue] = useState(0);
  const [openGallery, setOpenGallery] = useState(false);
  const [deleteState, setDeleteState] = useState(false);
  const [share, setShare] = useState(false);

  const round = (value, step = 1.0) => {
    step || (step = 1.0);
    var inv = 1.0 / step;
    return Math.round(value * inv) / inv;
  };

  useEffect(() => {
    let avg = 0;
    if (props.placeRate.length > 0) {
      props.placeRate.map((rate) => {
        avg += rate.userRating;
      });
      avg = avg / props.placeRate.length;
      setCurrentValue(round(avg - 0.01));
    }
  }, [props.placeRate]);

  const toggleMapHandler = () => {
    setShowMap((prev) => !prev);
  };

  const toggleShare = () => {
    setShare((prev) => !prev);
  };

  const toggleDeleteState = () => {
    setDeleteState((prev) => !prev);
  };

  const handleExpandClick = () => setExpanded((prevState) => !prevState);

  // const viewHandler = () => {
  //   navigate(`/place/${props.placeId}`);
  // };

  const editHandler = async () => {
    console.log("Edit");
    navigate(`/edit-place/${props.placeId}`);
  };

  const deleteHandler = async () => {
    console.log("Delete");
    try {
      await sendRequest(
        process.env.REACT_APP_BACK_URL + `/places/${props.placeId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + authCtx.token,
        }
      );
      props.onDelete(props.placeId);
    } catch (err) {
      console.log(err.message);
    }
  };

  const closeModalGalleryHandler = () => {
    setOpenGallery(false);
  };

  let days = "";
  const formatMovementDate = (date) => {
    const calcDaysPassed = (date1, date2) =>
      Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
    const daysPassed = calcDaysPassed(new Date(), date);

    if (daysPassed === 0) return "Today";
    if (daysPassed === 1) return "Yesterday";
    if (daysPassed <= 7) return `${daysPassed} days ago`;
    return new Intl.DateTimeFormat("he-IL").format(date);
  };
  days = formatMovementDate(new Date(props.place.creation_date));

  let actionIcons;
  let delAndEdit;

  if (!props.preview) {
    const itemIsFavorite = favoritesCtx.itemisFavorite(props.place.id);

    const favoritesHandler = () => {
      if (itemIsFavorite) {
        favoritesCtx.removeFavorite(props.place.id);
      } else {
        favoritesCtx.addFavorite(props.place);
      }
    };

    let showFavoritesBtn = false;
    let showDelEdit = false;
    if (authCtx.user) {
      if (props.place.creator.toString() !== authCtx.user.userId) {
        showFavoritesBtn = true;
      } else {
        showDelEdit = true;
      }
    }

    actionIcons = (
      <>
        {showFavoritesBtn && (
          <IconButton aria-label="add to favorites" onClick={favoritesHandler}>
            <FavoriteIcon color={itemIsFavorite ? "error" : "action"} />
          </IconButton>
        )}
        <IconButton aria-label="share" onClick={toggleShare}>
          <ShareIcon />
        </IconButton>
      </>
    );

    delAndEdit = showDelEdit ? (
      <>
        <Button
          className={classes.btn}
          variant="outlined"
          onClick={editHandler}
        >
          Edit
        </Button>
        <Button
          className={classes.btn}
          variant="contained"
          onClick={toggleDeleteState}
        >
          Delete
        </Button>
        <Box>
          <Dialog
            open={deleteState}
            onClose={toggleDeleteState}
            aria-labelledby="delete-alert-dialog-title"
            aria-describedby="delete-alert-dialog-description"
          >
            <DialogTitle id="delete-alert-dialog-title">
              Are you sure you want to delete this place?
            </DialogTitle>
            <DialogActions>
              {isLoading && (
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={isLoading}
                >
                  <CircularProgress
                    style={{ marginTop: "40px" }}
                    size={50}
                    thickness={2.5}
                  />
                </Backdrop>
              )}
              <Button onClick={toggleDeleteState}>Cancel</Button>
              <Button onClick={deleteHandler} autoFocus>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </>
    ) : null;
  }

  return (
    <>
      <ImageGallery
        open={openGallery}
        onClose={closeModalGalleryHandler}
        images={props.place.images}
      />
      <ModalMap
        open={showMap}
        toggleHandler={toggleMapHandler}
        coordinates={props.place.location}
      />
      <Card className={classes.root}>
        <CardHeader
          avatar={<DeployAvatar type="list" fname="arie" lname="fishman" />}
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={props.place.address}
          subheader={days}
        />
        <CardMedia //card image
          onClick={() => setOpenGallery(true)}
          component="img"
          height="250px"
          // src={image2}
          sx={{ objectFit: "cover", cursor: "pointer" }}
          src={props.place.images[0]}
          alt="place image"
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {props.place.description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Box sx={{ width: "100%" }}>
            {authCtx.user && (
              <Box sx={{ ml: 1, mb: "0.5rem" }}>
                <HoverRating
                  placeId={props.placeId}
                  currentValue={currentValue}
                />
              </Box>
            )}
            <Box>
              <Box sx={{ float: "left" }}>{actionIcons}</Box>
              <Box sx={{ float: "right" }}>
                <Box sx={{ float: "left" }}>
                  <Button
                    variant="outlined"
                    // onClick={viewHandler}
                    onClick={toggleMapHandler}
                  >
                    map
                  </Button>
                  {delAndEdit}
                </Box>
                <Box sx={{ float: "right" }}>
                  <Dialog onClose={toggleShare} open={share}>
                    <DialogTitle style={{ paddingBottom: "10px" }}>
                      Share
                    </DialogTitle>
                    <Divider />
                    <SharePlace placeId={props.placeId} />
                  </Dialog>
                  <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent className={classes["advanced-info"]}>
            <Stack spacing={3} className={classes.details}>
              <Typography paragraph letterSpacing={1} fontWeight={"bold"}>
                More Information:
              </Typography>
              <b>Title:</b>
              {props.place.title}
              <br />
              <b>Description:</b>
              {props.place.description}
            </Stack>
          </CardContent>
        </Collapse>
      </Card>
    </>
  );
};

export default PlaceItem;
