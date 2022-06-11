const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const placesControllers = require("../controllers/places-controllers");

const checkAuth = require("../middleware/check-auth");

router.get("/user/:uid", placesControllers.getPlacesByUserId);

router.get("/:pid", placesControllers.getPlaceById);

router.get("/", placesControllers.getAllPlaces);

router.use(checkAuth);

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
    check("images").isArray().isLength({ min: 1 }),
  ],
  placesControllers.createPlace
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.updatePlace
);

router.patch(
  "/rate/:pid/:uid",
  [check("userRating").isInt({ min: 1, max: 5 })],
  placesControllers.ratePlace
);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
