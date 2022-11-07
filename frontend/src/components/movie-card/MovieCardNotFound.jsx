import React from "react";

import "./movie-card.scss";

import notFoundImage from "../../assets/not-found.png";

const MovieCardNotFound = () => {
    return (
        <>
        <div className="movie-not-found">
            <div className="movie-card" style={{ backgroundImage: `url(${notFoundImage})` }}></div>
            <h3>No Movies found!</h3>
            </div>
        </>
    );
};

export default MovieCardNotFound;
