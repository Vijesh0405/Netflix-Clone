import react, { useEffect,useState } from 'react';
import axios from '../../Requests/Axios';
import requests from '../../Requests/Request.js';

const apiKey = import.meta.env.VITE_API_KEY;
const url = "https://api.themoviedb.org/3";


function Banner({loading}) {
  

    const [movie,setMovie] = useState([]);


    useEffect(() => {
        async function fetchData(){
          const request = await axios.get(requests.fetchUpcoming)            
          setMovie(
                request.data.results[
                    Math.floor(Math.random() * (request.data.results.length - 1))
                ]
            );

            return request;
        }

        fetchData();
    },[])

    // console.log(movie);

    function truncate(string,n){
        return string?.length>n ? string.substr(0,n-1) + '...' : string;
    }

        return (
          <header className={`${loading? "hidden":""} banner w-full h-96 relative bg-zinc-900 text-white object-contain bg-center`} style={{
            backgroundImage: `url('https://image.tmdb.org/t/p/original/${movie?.backdrop_path}')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat:'no-repeat'
        }}>
            <div className='banner-contents ml-8 pt-20'>
                <h1 className='banner-title text-4xl font-extrabold'>{movie?.title || movie?.name || movie?.original_name}</h1>
                <div className='banner-buttons mt-4'>
                    <button className='banner-button cursor-pointer text-white outline-none border-none font-semibold rounded-sm px-5 py-2 mr-2 bg-zinc-900/50'>Play</button>
                    <button className='banner-button cursor-pointer text-white outline-none border-none font-semibold rounded-sm px-5 py-2 mr-2 bg-zinc-900/50'>My List</button>
                </div>
                <p className='banner-description mt-4 text-sm'>{truncate(`${movie?.overview}`, 150)}</p>
            </div>
        </header>
        
        )
}

export default Banner;