import mongoose from "mongoose";

const TrendingMoviesSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    searchTerm: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
    },
    poster_url: {
      required: true,
      type: String,
    },
    movie_id: {
      required: true,
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const TrendingMovies = mongoose.model("TrendingMovies", TrendingMoviesSchema);

export default TrendingMovies;
