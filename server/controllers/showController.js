import axios from "axios"
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import { inngest } from "../inngest/index.js";

// API to get now playing movies from TMDB API
export const getNowPlayingMovies = async (req, res)=>{
    try {
        const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`},
            timeout: 5000
        })

        const movies = data.results;
        res.json({success: true, movies: movies})
    } catch (error) {
        console.error("TMDB API Timeout, using fallback data:", error.message);
        const fallbackMovies = [
            { id: 324544, title: "In the Lost Lands", poster_path: "/dDlfjR7gllmr8HTeN6rfrYhTdwX.jpg", release_date: "2025-02-27", vote_average: 6.4, vote_count: 15000 },
            { id: 1232546, title: "Until Dawn", poster_path: "/juA4IWO52Fecx8lhAsxmDgy3M3.jpg", release_date: "2025-04-23", vote_average: 6.405, vote_count: 18000 },
            { id: 552524, title: "Lilo & Stitch", poster_path: "/mKKqV23MQ0uakJS8OCE2TfV5jNS.jpg", release_date: "2025-05-17", vote_average: 7.117, vote_count: 27500 },
            { id: 668489, title: "Havoc", poster_path: "/ubP2OsF3GlfqYPvXyLw9d78djGX.jpg", release_date: "2025-04-25", vote_average: 6.537, vote_count: 35960 }
        ];
        res.json({success: true, movies: fallbackMovies, message: "Using fallback movies due to TMDB network error."});
    }
}

// API to add a new show to the database
export const addShow = async (req, res) =>{
    try {
        const {movieId, showsInput, showPrice} = req.body

        let movie = await Movie.findById(movieId)

        if(!movie) {
            let movieApiData, movieCreditsData;
            try {
                // Fetch movie details and credits from TMDB API
                const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                    axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                        headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`}, timeout: 5000 
                    }),
                    axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
                        headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`}, timeout: 5000 
                    })
                ]);
                movieApiData = movieDetailsResponse.data;
                movieCreditsData = movieCreditsResponse.data;
            } catch (apiError) {
                console.warn("TMDB API Error in addShow, using dummy fallback details", apiError.message);
                movieApiData = {
                    title: "Fallback Movie " + movieId,
                    overview: "Fallback overview due to API block.",
                    poster_path: "/juA4IWO52Fecx8lhAsxmDgy3M3.jpg",
                    backdrop_path: "/juA4IWO52Fecx8lhAsxmDgy3M3.jpg",
                    genres: [{name: "Action"}],
                    release_date: "2025-01-01",
                    original_language: "en",
                    tagline: "API Blocked - Dummy Data",
                    vote_average: 7.0,
                    runtime: 120
                };
                movieCreditsData = {
                    cast: [{name: "Actor 1", profile_path: null}]
                };
            }

             const movieDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                genres: movieApiData.genres,
                casts: movieCreditsData.cast,
                release_date: movieApiData.release_date,
                original_language: movieApiData.original_language,
                tagline: movieApiData.tagline || "",
                vote_average: movieApiData.vote_average,
                runtime: movieApiData.runtime,
             }

             // Add movie to the database
             movie = await Movie.create(movieDetails);
        }

        const showsToCreate = [];
        showsInput.forEach(show => {
            const showDate = show.date;
            show.time.forEach((time)=>{
                const dateTimeString = `${showDate}T${time}`;
                showsToCreate.push({
                    movie: movieId,
                    showDateTime: new Date(dateTimeString),
                    showPrice,
                    occupiedSeats: {}
                })
            })
        });

        if(showsToCreate.length > 0){
            await Show.insertMany(showsToCreate);
        }

         //  Trigger Inngest event
         await inngest.send({
            name: "app/show.added",
             data: {movieTitle: movie.title}
         })

        res.json({success: true, message: 'Show Added successfully.'})
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
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