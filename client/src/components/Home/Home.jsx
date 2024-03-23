import React, { useState, useEffect } from "react";
import requests from "../../Requests/Request";
import Row from "./Row";
import Banner from "./Banner";
import { getCookie } from "../../utils";
const apiKey = "21120aeff0c33b5b5f181b077484675b";
const url = "https://api.themoviedb.org/3";
const imgUrl = "https://image.tmdb.org/t/p/original";
const endpoints = {
  upcoming: "upcoming",
  nowPlaying: "now_playing",
  popular: "popular",
  topRated: "top_rated",
};
import Header from "../Header/Header";
import Loader from "./Loader";

function Home() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

const Row = ({ title, arr = [] }) => {
  return (
    <div className="row bg-zinc-900 p-1 overflow-x-auto" >
      <h2 className="p-1 text-white text-3xl font-semibold">{title}</h2>
      <div className="flex">
        {arr.map((item, index) => (
          <Card key={index} img={`${imgUrl}/${item.poster_path}`} />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [genre, setGenre] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const isLogin  = await getCookie("accessToken");
      console.log(isLogin)
    if (!isLogin) {
        window.location.href = "/login";
      }
    })()
  },[]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const requests = Object.values(endpoints).map(async (endpoint) => {
          const { data } = await axios.get(`${url}/movie/${endpoint}?api_key=${apiKey}`);
          return data.results;
        });

        const [upcoming, nowPlaying, popular, topRated] = await Promise.all(requests);
        setUpcomingMovies(upcoming);
        setNowPlayingMovies(nowPlaying);
        setPopularMovies(popular);
        setTopRatedMovies(topRated);
        setIsLoading(false); // Set isLoading to false when data fetching is complete
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchGenres = async () => {
      try {
        const { data } = await axios.get(`${url}/genre/movie/list?api_key=${apiKey}`);
        setGenre(data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchData();
    fetchGenres();
  }, []);

 

  return (
    <div>
      
      {isLoading ? (
        <div>Loading...</div> // Render loading indicator while fetching data
      ) : (
        <>
        <div>
        <Banner />
      </div>
          <Row title={"New this week"} arr={upcomingMovies} />
          <Row title={"Tranding Now"} arr={popularMovies} />
          <Row title={"Now Playing"} arr={nowPlayingMovies} />
          <Row title={"Top Rated"} arr={topRatedMovies} />
          <div className="genreBox">
            {genre.map((item) => (
              <Link key={item.id} to={`/genre/${item.id}`}>
                {item.name}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
        return () => clearTimeout(timer);
    }, []);

    return (
       <>
       <Header />
       <Loader loading={loading}/>
       <Banner loading={loading} />
       <div className={`${loading? "hidden":""} `}>
           <Row title="Upcoming" fetchUrl={requests.fetchUpcoming} setLoading={setLoading} />
           <Row title="Popular" fetchUrl={requests.fetchPopular} setLoading={setLoading} />
           <Row title="Now Playing" fetchUrl={requests.fetchNowPlaying} setLoading={setLoading} />
           <Row title="Top Rated" fetchUrl={requests.fetchTopRated} setLoading={setLoading} />
       </div>
   </>
    );
}

export default Home;
