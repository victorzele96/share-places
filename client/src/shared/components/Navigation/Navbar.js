import { Link } from "react-router-dom";

import LeftDrawer from "./LeftDrawer";

import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
} from "@mui/material";

import share_places_logo from "../../../static/images/share_places_logo2.jpeg";

import classes from "./Navbar.module.css";

const Navbar = (props) => {

  return (
    <Box sx={{ flexGrow: 1, top: 0, display: "block", width: "100%" }}>
      <AppBar position="fixed">
        <Toolbar>
          <Box sx={{ display: { md: "flex" } }}>
            {/* sdiebar */}
            <LeftDrawer />
          </Box>
          <IconButton
            component={Link}
            to="/"
            sx={{
              sm: { width: "42px", height: "21px" },
              md: { width: "63px", height: "31.5px" },
              lg: { width: "84px", height: "42px" }
            }}
          >
            <img src={share_places_logo} alt="share_places_logo" className={classes.logo} />
             {/* Share Places */}
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
