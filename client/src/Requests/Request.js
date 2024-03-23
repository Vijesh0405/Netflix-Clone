const API_KEY = import.meta.env.VITE_API_KEY;


const requests = {
    fetchPopular : `/movie/popular?api_key=${API_KEY}&language=en-US`,
    fetchNowPlaying : `/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`,
    fetchUpcoming : `/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`,
    fetchTopRated : `/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`,

}

export default requests;

