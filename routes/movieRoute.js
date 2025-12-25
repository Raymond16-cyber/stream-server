import express from "express";
import {
  fetchSavedMovies,
  getTrendingMovies,
  saveMovieInfo,
  updateMovieCountOrSaveTrendingMovie,
} from "../controller/movieController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const movieRouter = express.Router();

// routes
movieRouter.post(
  "/increment-search-count",
  authMiddleware,
  updateMovieCountOrSaveTrendingMovie
);
movieRouter.get("/get-trending-movies",authMiddleware, getTrendingMovies);
movieRouter.post("/save-movie",authMiddleware, saveMovieInfo);
movieRouter.get("/get-saved-movies",authMiddleware, fetchSavedMovies);

export default movieRouter;
