import { useRef, useEffect } from "react";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  mapContainer: {
    height: "500px",
    magin: 0,
    padding: 0,
  },
}));

const Map = (props) => {
  const classes = useStyles();
  const { center, zoom } = props;

  const mapRef = useRef();

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom,
    });

    new window.google.maps.Marker({ position: center, map: map });
  }, [center, zoom]);

  return <div className={classes.mapContainer} ref={mapRef}></div>;
};

export default Map;
