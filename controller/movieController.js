import asyncHandler from "express-async-handler";
import TrendingMovies from "../model/TrendingMovies.js";
import SavedMovies from "../model/SavedMovies.js";

// function to save movie Info and serach count
export const updateMovieCountOrSaveTrendingMovie = asyncHandler(
  async (req, res) => {
    const { query, movie } = req.body;
    try {
      const result = await TrendingMovies.findOne({ movie_id: movie?.id });
      if (result?.movie_id) {
        const existing = await TrendingMovies.findOneAndUpdate(
          { movie_id: movie.id },
          {
            count: result.count + 1,
            searchTerm: query.trim(), // optional but useful
          },
          { new: true }
        );
        console.log(
          `Updated count for ${existing?.title},count : from ${result?.count} -> ${existing?.count}`
        );
      } else {
        const newMovie = await TrendingMovies.create({
          movie_id: movie.id,
          title: movie.title,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          count: 1,
          searchTerm: query.trim(),
        });
        console.log(`Created metric for ${movie.title}`);
      }
    } catch (error) {
      console.error("updateSearchCount error", error);
    }
  }
);

// function to get trending movies
export const getTrendingMovies = asyncHandler(async (req, res) => {
  try {
    const movies = await TrendingMovies.find();
    if (!movies || movies === null) {
      res.status(200).json({
        movies: [],
      });
    }
    res.status(200).json({
      movies,
    });
  } catch (error) {
    res.status(500).json({
      error: "unable to fetch trending movies",
    });
}
});

// function to save a movie
export const saveMovieInfo = asyncHandler(async (req, res) => {
  const { movie, userId } = req.body;  
  try {
    const result = await SavedMovies.findOne({ movie_id: movie?.id });
    if (result) {
      console.log("Movie has been saved already");
      return res.status(200).json({
        success: true,
        message: "Movie has been saved already",
      });
    } else {
      const savedMovie = await SavedMovies.create({
        userId,
        movie_id: movie.id,
        movie_title: movie.title,
        genres: movie.genres.map((m) => m.name),
        poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
      console.log("Movie saved");
      return res.status(200).json({
        success: true,
        message: "Saved",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Unable to access server",
    });
}
});

// fetch saved movies

export const fetchSavedMovies = asyncHandler(async(req,res)=>{
    try {
    console.log("fetching saved movies");
     const movies = await SavedMovies.find();
    if (!movies || movies === null) {
      res.status(200).json({
        movies: [],
      });
    }
    res.status(200).json({
      movies,
    });
  } catch (error) {
      res.status(500).json({
        error: "unable to fetch saved movies",
      });
    
  }
})