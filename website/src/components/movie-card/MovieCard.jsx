import React from "react";

import "./movie-card.scss";

import { Link } from "react-router-dom";

import Button from "../button/Button";

import apiConfig from "../../api/apiConfig";

const MovieCard = (props) => {
    const item = props.item;

    const link = "/movie/" + item.id;

    let bg;
    if (item.posterImage){
        bg = apiConfig.w500Image(item.posterImage);
    } else {
        bg = apiConfig.w500Image(item.poster_path);
    }
     

    return (
        <Link to={link} state={{ data: item }}>
            <div className="movie-card" style={{ backgroundImage: `url(${bg})` }}>
                <Button props={item}>
                    <i className="bx bx-search"></i>
                </Button>
            </div>
            <div style={{ textAlign: "center" }}>
                <h3>{item.title || item.name}</h3>
            </div>
        </Link>
    );
};

export default MovieCard;
