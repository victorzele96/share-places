const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const cloudinary = require("../util/cloudinary");
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");
const getPublicIds = require('../util/public-id');

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid; // params = { uid: 'u1' }

  try {
    await Place.find({}, (err, places) => {
      let userPlaces = places.filter(
        (place) => place.creator.toString() === userId
      );

      if (!userPlaces || userPlaces.length === 0) {
        return next(
          new HttpError("Could not find a place for the provided user id.", 404)
        );
      }

      res.json({ places: userPlaces });
    }).clone();
  } catch (err) {
    return next(
      new HttpError("Fetching places failed, please try again later.", 500)
    );
  }

  // res.json({ places });
};

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid; // params = { pid: 'h1' }

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not find a place.", 500)
    );
  }

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    );
  }

  res.json({ place });
};

const getAllPlaces = async (req, res, next) => {
  try {
    await Place.find({}, (err, places) => {
      res.json({ places: places });
    }).clone();
  } catch (err) {
    return next(
      new HttpError("Fetching places failed, please try again later.", 500)
    );
  }
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, address, images } = req.body;
  let coordsAndAddress;
  try {
    coordsAndAddress = await getCoordsForAddress(address);
    console.log(coordsAndAddress);
  } catch (err) {
    return next(err);
  }

  const createdPlace = new Place({
    title,
    description,
    address: coordsAndAddress.formatted_address,
    images: images,
    creator: req.userData.userId,
    location: coordsAndAddress.coordinates,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    return next(new HttpError("Creating place failed, please try again.", 500));
  }

  if (!user) {
    return next(new HttpError("Could not find user for provided id", 404));
  }

  console.log(createdPlace);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    return next(new HttpError("Creating place failed, please try again.", 500));
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, images, imgsToDelete } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
    
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update place.", 500)
    );
  }

  if (place.creator.toString() !== req.userData.userId) {
    return next(new HttpError("You are not allowed to edit this place.", 401));
  }

  console.log("imgsToDelete", imgsToDelete);

  const public_ids = getPublicIds(imgsToDelete);
  console.log("public_ids", public_ids);

  try {
    public_ids.map(public_id => cloudinary.uploader.destroy(public_id).then(console.log('destroyed')));
  } catch (err) {
    console.log(err);
  }

  place.title = title;
  place.description = description;
  place.images = images.map((image) => image);

  try {
    await place.save();
  } catch (err) {
    console.log(err);
    return next(
      new HttpError("Something went wrong, could not update place.", 500)
    );
  }

  res.status(200).json({ place: place });
  // res.status(200).json({ place: place.toObject({getters: true}) });
};

const ratePlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { userRating } = req.body;
  const placeId = req.params.pid;
  const userId = req.params.uid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Something went wrong, could not rate place.', 500)
    );
  }

  if (place.creator.toString() === userId) {
    return next(
      new HttpError('You can not to rate your own place.', 500)
    );
  }

  const index = place.ratings.findIndex(item => item.userId.toString() === userId);

  let ratings;
  ratings = [...place.ratings];
  if (index !== -1) {
    ratings.splice(index, 1);
  }
  ratings.push({ userRating, userId });
  console.log(ratings);

  place.ratings = ratings;

  try {
    await place.save();
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Something went wrong, could not rate place.', 500)
    );
  }

  res.status(200).json({ place: place });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    return new HttpError("Something went wrong, could not delete place.", 500);
  }

  if (!place) {
    return next(new HttpError("Could not find place for this id.", 404));
  }

  if (place.creator.id.toString() !== req.userData.userId) {
    return next(
      new HttpError("You are not allowed to delete this place.", 401)
    );
  }

  const public_ids = getPublicIds(place.images);

  try {
    public_ids.map(public_id => cloudinary.uploader.destroy(public_id).then(console.log('destroyed')));

    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return new HttpError("Something went wrong, could not delete place.", 500);
  }

  res
    .status(200)
    .json({ message: "The place was successfully deleted.", placeId: placeId });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.getAllPlaces = getAllPlaces;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.ratePlace = ratePlace;
exports.deletePlace = deletePlace;
