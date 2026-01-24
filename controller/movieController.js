import asyncHandler from "express-async-handler";
import TrendingMovies from "../model/TrendingMovies.js";
import SavedMovies from "../model/SavedMovies.js";
import User from "../model/User.js";

// function to save movie Info and serach count
export const updateMovieCountOrSaveTrendingMovie = asyncHandler(
  async (req, res) => {
    const { query, movie,isKid } = req.body;
    try {
      const result = await TrendingMovies.findOne({ movie_id: movie?.id });
      if (result?.movie_id) {
        const existing = await TrendingMovies.findOneAndUpdate(
          { movie_id: movie.id },
          {
            count: result.count + 1,
            searchTerm: query.trim(), // optional but useful
            isKids: isKid || false,
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
          isKids: isKid || false,
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
  const { isKid } = req.params;
  try {
    const movies = await TrendingMovies.find({isKids: isKid === 'true' ? true : false}).sort({ count: -1 }).limit(10);
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
  const { movie, isKids } = req.body;
  const userId = req.user.id || req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authorized",
      });
    }

    // 🔑 CHECK IF MOVIE ALREADY SAVED
    const existingMovie = await SavedMovies.findOne({
      movie_id: movie.id,
      userId: user.currentProfile.toString(),
    });

    if (existingMovie) {
      return res.status(200).json({
        success: true,
        message: "Movie already saved",
      });
    }

    // ✅ SAVE NEW MOVIE
    const savedMovie = await SavedMovies.create({
      userId: user.currentProfile.toString(),
      movie_id: movie.id,
      movie_title: movie.title,
      genres: movie.genres.map((g) => g.name),
      poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      isKids: isKids || false,
    });
    return res.status(201).json({
      success: true,
      message: "Movie saved",
      data: savedMovie,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to access server",
    });
  }
});

export const deleteSavedMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const userId = req.user.id || req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {  
      return res.status(401).json({
        success: false,
        message: "User not authorized",
      });
    }
    const deletedMovie = await SavedMovies.findOneAndDelete({
      movie_id: movieId,
      userId: user.currentProfile.toString(),
    });

    if (!deletedMovie) {
      return res.status(404).json({
        success: false,
        message: "Movie does not exist in saved list",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Movie removed from saved list",
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to access server",
    });
  }
});


// fetch saved movies
export const fetchSavedMovies = asyncHandler(async(req,res)=>{
    try {
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId);
    if(!user){
      res.status(401).json({
        message: "User not authorized",
      })
    }
     const movies = await SavedMovies.find({userId: user.currentProfile.toString()});
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

