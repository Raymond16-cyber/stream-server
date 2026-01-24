import express from "express";
import {
  deleteSavedMovie,
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
movieRouter.get("/get-trending-movies/:isKid",authMiddleware, getTrendingMovies);
movieRouter.post("/save-movie",authMiddleware, saveMovieInfo);
movieRouter.delete("/remove-saved-movie/:movieId",authMiddleware, deleteSavedMovie);
movieRouter.get("/get-saved-movies",authMiddleware, fetchSavedMovies);

export default movieRouter;
