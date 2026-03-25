import axios from "axios"
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import { inngest } from "../inngest/index.js";

// API to get now playing movies from TMDB API
export const getNowPlayingMovies = async (req, res)=>{
    try {
        const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            params: { api_key : process.env.TMDB_API_KEY },
            timeout: 5000
        })

        if (!data || !data.results) {
            return res.json({success: false, message: "Failed to fetch movies from TMDB."})
        }

        const movies = data.results;
        res.json({success: true, movies: movies})
    } catch (error) {
        console.error("TMDB API Error:", error.message);
        res.status(500).json({success: false, message: "TMDB API Error: " + error.message});
    }
}

// API to add a movie specifically (can be used as a standalone or internal)
export const addMovie = async (movieId) => {
    try {
        const id = String(movieId);
        console.log("Checking/Adding movie to database:", id);

        let movie = await Movie.findById(id);
        if (movie) return movie;

        // Strictly fetch from TMDB
        const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
            axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
                params: { api_key : process.env.TMDB_API_KEY }, timeout: 5000 
            }),
            axios.get(`https://api.themoviedb.org/3/movie/${id}/credits`, {
                params: { api_key : process.env.TMDB_API_KEY }, timeout: 5000 
            })
        ]);

        if (!movieDetailsResponse.data || !movieCreditsResponse.data) {
            throw new Error("Movie not found in TMDB.");
        }

        const movieApiData = movieDetailsResponse.data;
        const movieCreditsData = movieCreditsResponse.data;

        if (!movieApiData.title || !movieApiData.poster_path) {
            throw new Error("Incomplete movie data from TMDB.");
        }

        const movieDetails = {
            _id: id,
            title: movieApiData.title,
            overview: movieApiData.overview || "",
            poster_path: movieApiData.poster_path,
            backdrop_path: movieApiData.backdrop_path || "",
            genres: movieApiData.genres || [],
            casts: movieCreditsData.cast || [],
            release_date: movieApiData.release_date || "Unknown",
            original_language: movieApiData.original_language || "en",
            tagline: movieApiData.tagline || "",
            vote_average: movieApiData.vote_average || 0,
            runtime: movieApiData.runtime || 0,
        }

        movie = await Movie.create(movieDetails);
        console.log("Successfully added movie:", movie.title);
        return movie;
    } catch (error) {
        console.error("addMovie Internal Error:", error.message);
        throw error;
    }
}

// API to add a new show to the database
export const addShow = async (req, res) =>{
    try {
        const {movieId: rawMovieId, showsInput, showPrice} = req.body
        const movieId = String(rawMovieId);

        if (!movieId || !showsInput || !showPrice) {
            return res.status(400).json({success: false, message: "Missing required fields (movieId, showsInput, or showPrice)."});
        }

        console.log("Processing show addition request for movie:", movieId);

        // 1. Ensure movie exists (Fetch and save if missing)
        let movie;
        try {
            movie = await addMovie(movieId);
        } catch (movieError) {
            return res.status(400).json({success: false, message: `Movie Validation Failed: ${movieError.message}`});
        }

        // 2. Prepare shows and check for duplicates
        const showsToCreate = [];
        for (const show of showsInput) {
            const showDate = show.date;
            for (const time of show.time) {
                const dateTimeString = `${showDate}T${time}`;
                const showDateTime = new Date(dateTimeString);

                // Prevent Duplicate Shows (Movie ID + Date/Time uniqueness)
                const existingShow = await Show.findOne({
                    movie: movieId,
                    showDateTime: showDateTime
                });

                if (existingShow) {
                    console.warn(`Duplicate show detected and skipped: ${movie.title} at ${dateTimeString}`);
                    continue; 
                }

                showsToCreate.push({
                    movie: movieId,
                    showDateTime: showDateTime,
                    showPrice,
                    occupiedSeats: {}
                })
            }
        }

        // 3. Batch insert shows
        if(showsToCreate.length > 0){
            await Show.insertMany(showsToCreate, { ordered: false });
            console.log(`Successfully added ${showsToCreate.length} new showtimes for ${movie.title}.`);
        } else {
             return res.json({success: false, message: 'All provided showtimes already exist for this movie.'})
        }

         // 4. Trigger Inngest event
         await inngest.send({
            name: "app/show.added",
             data: {movieTitle: movie.title}
         })

        res.json({success: true, message: `Successfully added ${showsToCreate.length} shows for "${movie.title}".`})
    } catch (error) {
        console.error("addShow Controller Error:", error);
        res.status(500).json({success: false, message: "General Error: " + error.message})
    }
}



// API to get all shows from the database
export const getShows = async (req, res) =>{
    try {
        const shows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie').sort({ showDateTime: 1 });

        // filter unique shows
        const uniqueShows = new Set(shows.map(show => show.movie))

        res.json({success: true, shows: Array.from(uniqueShows)})
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get a single show from the database
export const getShow = async (req, res) =>{
    try {
        const {movieId} = req.params;
        // get all upcoming shows for the movie
        const shows = await Show.find({movie: movieId, showDateTime: { $gte: new Date() }})

        const movie = await Movie.findById(movieId);
        const dateTime = {};

        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split("T")[0];
            if(!dateTime[date]){
                dateTime[date] = []
            }
            dateTime[date].push({ time: show.showDateTime, showId: show._id })
        })

        res.json({success: true, movie, dateTime})
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}