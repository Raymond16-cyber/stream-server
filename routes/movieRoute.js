import express from "express";
import {
  fetchSavedMovies,
  getTrendingMovies,
  saveMovieInfo,
  updateMovieCountOrSaveTrendingMovie,
} from "../controller/movieController.js";

const movieRouter = express.Router();

// routes
movieRouter.post(
  "/increment-search-count",
  updateMovieCountOrSaveTrendingMovie
);
movieRouter.get("/get-trending-movies", getTrendingMovies);
movieRouter.post("/save-movie", saveMovieInfo);
movieRouter.get("/get-saved-movies",fetchSavedMovies);

export default movieRouter;
