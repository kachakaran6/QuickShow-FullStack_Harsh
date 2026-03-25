import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { CheckIcon, DeleteIcon, StarIcon } from 'lucide-react';
import { kConverter } from '../../lib/kConverter';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddShows = () => {

    const {axios, getToken, user, image_base_url} = useAppContext()

    const currency = import.meta.env.VITE_CURRENCY
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [dateTimeSelection, setDateTimeSelection] = useState({});
    const [dateTimeInput, setDateTimeInput] = useState("");
    const [showPrice, setShowPrice] = useState("");
    const [addingShow, setAddingShow] = useState(false)


     const fetchNowPlayingMovies = async () => {
        try {
            const { data } = await axios.get('/api/show/now-playing', {
                headers: { Authorization: `Bearer ${await getToken()}` }})
                if(data.success){
                    setNowPlayingMovies(data.movies)
                } else {
                    toast.error(data.message)
                    // Set an empty array placeholder to stop the infinite loading screen
                    setNowPlayingMovies([{ id: 'error', title: 'Error Loading Movies', poster_path: '' }])
                }
        } catch (error) {
            console.error('Error fetching movies:', error)
            toast.error('Failed to fetch movies')
        }
    };

    const handleDateTimeAdd = () => {
        if (!dateTimeInput) return;
        const [date, time] = dateTimeInput.split("T");
        if (!date || !time) return;

        setDateTimeSelection((prev) => {
            const times = prev[date] || [];
            if (!times.includes(time)) {
                return { ...prev, [date]: [...times, time] };
            }
            return prev;
        });
    };

    const handleRemoveTime = (date, time) => {
        setDateTimeSelection((prev) => {
            const filteredTimes = prev[date].filter((t) => t !== time);
            if (filteredTimes.length === 0) {
                const { [date]: _, ...rest } = prev;
                return rest;
            }
            return {
                ...prev,
                [date]: filteredTimes,
            };
        });
    };

    const handleSubmit = async ()=>{
        try {
            setAddingShow(true)

            if(!selectedMovie || Object.keys(dateTimeSelection).length === 0 || !showPrice){
                return toast('Missing required fields');
            }

            const showsInput = Object.entries(dateTimeSelection).map(([date, time])=> ({date, time}));

            const payload = {
                movieId: selectedMovie,
                showsInput,
                showPrice: Number(showPrice)
            }

            const { data } = await axios.post('/api/show/add', payload, {headers: { Authorization: `Bearer ${await getToken()}` }})

            if(data.success){
                toast.success(data.message)
                setSelectedMovie(null)
                setDateTimeSelection({})
                setShowPrice("")
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error('An error occurred. Please try again.')
        }
        setAddingShow(false)
    }

    useEffect(() => {
        if(user){
            fetchNowPlayingMovies();
        }
    }, [user]);

  return nowPlayingMovies.length > 0 ? (
    <>
      <Title text1="Add" text2="Shows" />
      <p className="mt-10 text-lg font-medium">Now Playing Movies</p>
      <div className="overflow-x-auto pb-4">
        <div className="group flex flex-wrap gap-4 mt-4 w-max">
            {nowPlayingMovies.map((movie) =>(
                <div key={movie.id} className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300 ${selectedMovie === movie.id ? 'opacity-100' : ''}`} onClick={()=> setSelectedMovie(movie.id)}>
                    <div className="relative rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition">
                        <img src={image_base_url + movie.poster_path} alt="" className="w-full object-cover brightness-90" />
                        <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                                    <p className="flex items-center gap-1 text-gray-400">
                                        <StarIcon className="w-4 h-4 text-primary fill-primary" />
                                        {movie.vote_average.toFixed(1)}
                                    </p>
                                    <p className="text-gray-300">{kConverter(movie.vote_count)}</p>
                                </div>
                    </div>
                    {selectedMovie === movie.id && (
                        <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded shadow-lg">
                            <CheckIcon className="w-4 h-4 text-white" strokeWidth={3} />
                        </div>
                    )}
                    <p className="font-medium truncate mt-2">{movie.title}</p>
                </div>
            ))}
        </div>
      </div>

       {/* Selected Movie Preview & Form */}
       {selectedMovie && (
         <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Preview Mini Card */}
                <div className="w-full md:w-64">
                    <p className="text-sm text-gray-400 mb-3 uppercase tracking-wider">Target Movie</p>
                    <div className="bg-white/10 rounded-lg overflow-hidden border border-white/20">
                        {(() => {
                            const movie = nowPlayingMovies.find(m => m.id === selectedMovie);
                            return movie ? (
                                <>
                                    <img src={image_base_url + movie.poster_path} alt="" className="w-full h-auto" />
                                    <div className="p-4 bg-black/50">
                                        <h3 className="font-bold text-lg text-white">{movie.title}</h3>
                                        <p className="text-sm text-gray-400 mt-1">{movie.release_date}</p>
                                    </div>
                                </>
                            ) : <p className="p-4">Movie details not available</p>;
                        })()}
                    </div>
                </div>

                {/* Show Configuration */}
                <div className="flex-1 space-y-8">
                    {/* Show Price Input */}
                    <div>
                        <label className="block text-sm font-medium mb-3 text-gray-300">Set Ticket Price</label>
                        <div className="inline-flex items-center gap-2 bg-black/30 border border-gray-600 px-4 py-3 rounded-lg focus-within:border-primary transition">
                            <p className="text-primary font-bold">{currency}</p>
                            <input min={0} type="number" value={showPrice} onChange={(e) => setShowPrice(e.target.value)} placeholder="0.00" className="bg-transparent outline-none w-32 text-white font-medium" />
                        </div>
                    </div>

                    {/* Date & Time Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-3 text-gray-300">Schedule Showtimes</label>
                        <div className="flex flex-wrap gap-4 items-end">
                            <div className="bg-black/30 border border-gray-600 p-1 pl-4 rounded-lg focus-within:border-primary transition">
                                <input type="datetime-local" value={dateTimeInput} onChange={(e) => setDateTimeInput(e.target.value)} className="bg-transparent outline-none py-2 text-white" />
                            </div>
                            <button onClick={handleDateTimeAdd} className="bg-primary hover:bg-primary-dull text-white px-6 py-3 rounded-lg font-medium transition cursor-pointer shadow-lg hover:shadow-primary/20" >
                                Add to Schedule
                            </button>
                        </div>
                    </div>

                    {/* Display Selected Times */}
                    {Object.keys(dateTimeSelection).length > 0 && (
                    <div className="pt-4 border-t border-white/10">
                        <h2 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-widest">Planned Schedule</h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.entries(dateTimeSelection).map(([date, times]) => (
                                <li key={date} className="bg-white/5 p-4 rounded-lg border border-white/5">
                                    <div className="font-bold text-primary mb-2 flex items-center gap-2">
                                        <div className="w-1 h-4 bg-primary rounded-full"></div>
                                        {new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {times.map((time) => (
                                            <div key={time} className="bg-primary/20 border border-primary/40 px-3 py-1.5 flex items-center rounded-md group/time" >
                                                <span className="text-white text-xs font-medium">{time}</span>
                                                <DeleteIcon onClick={() => handleRemoveTime(date, time)} width={14} className="ml-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer" />
                                            </div>
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-12 flex justify-end">
                <button onClick={handleSubmit} disabled={addingShow} className="bg-primary hover:bg-primary-dull text-white px-12 py-4 rounded-full font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition disabled:opacity-50 disabled:grayscale cursor-pointer" >
                    {addingShow ? 'Processing...' : 'Confirm and Add Shows'}
                </button>
            </div>
         </div>
       )}
    </>
  ) : <Loading />
}

export default AddShows
