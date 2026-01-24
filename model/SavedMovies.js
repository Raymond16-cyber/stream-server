import mongoose from "mongoose";

const SavedMoviesSchema = mongoose.Schema(
  {
    userId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    movie_title: {
      type: String,
      required: true,
    },
    movie_id: {
      required: true,
      type: Number,
    },
    genres: [],
    poster_path: {
      required: true,
      type: String,
    },
    isKids: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const SavedMovies = mongoose.model("SavedMovies", SavedMoviesSchema);

export default SavedMovies;
