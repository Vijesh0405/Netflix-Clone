import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Home/Home.jsx';
import Header from './components/Header/Header.jsx';
import Form from './components/Form/Form.jsx';

const HeaderRoute = () => {
    const location = useLocation();
    const hideHeader = location.pathname === '/login' || location.pathname === '/signup';

    return (
        <div className=''>
            {!hideHeader && <Header />}
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/tvShows' element={<Home />} />
                <Route path='/movies' element={<Home />} />
                <Route path='/new&popular' element={<Home />} />
                <Route path='/myList' element={<Home />} />
                <Route path='/login' element={<Form />} />
                <Route path='/signup' element={<Form />} />
            </Routes>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <HeaderRoute />
        </Router>
    );
};

export default App;
