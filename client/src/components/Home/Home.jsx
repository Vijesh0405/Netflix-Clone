import React, { useState, useEffect } from "react";
import requests from "../../Requests/Request";
import Row from "./Row";
import Banner from "./Banner";
import Header from "../Header/Header";
import Loader from "./Loader";

function Home() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

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
