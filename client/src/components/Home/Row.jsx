import React, { useEffect, useState } from 'react';
import axios from '../../Requests/Axios';

function Row({ title, fetchUrl }) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);


    const base_Url = 'https://image.tmdb.org/t/p/original/';

    useEffect(() => {
        async function fetchData() {
            try {
                const request = await axios.get(fetchUrl);
                setMovies(request.data.results);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        
        fetchData();
    }, [fetchUrl, setLoading]);

    return (
        <div className='row  bg-zinc-900 p-1 overflow-x-auto'>
            <h2 className="p-1 absolute text-white text-3xl font-semibold">{title}</h2>

            <div className='row-posters mt-12 flex'>
                {movies.map((movie) => (
                    <img
                        key={movie.id}
                        src={`${base_Url}/${movie.poster_path}`}
                        alt={movie.name}
                        className='card w-36 md:w-48 mx-2 my-1 cursor-pointer transition-transform duration-500 hover:-translate-y-2'
                    />
                ))}
            </div>
            
        </div>
    );
}

export default Row;
