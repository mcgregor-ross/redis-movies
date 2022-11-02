import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import { useParams, useLocation } from "react-router-dom";

import apiConfig from "../../api/apiConfig";

import "./detail.scss";
import CastList from "./CastList";

import MovieList from "../../components/movie-list/MovieList";
import javaMovieService, { searchType } from "../../api/javaMovieService";

const Detail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const location = useLocation();
    // const movie = location.state.data;

    useEffect(() => {
        const getDetail = async () => {
            const response = await javaMovieService.getMovieById(id);
            console.log(response);
            setMovie(response.data);
            window.scrollTo(0, 0);
        };
        getDetail();
    }, [id]);

    return (
        <>
            {movie && (
                <>
                    <div
                        className="banner"
                        style={{
                            backgroundImage: `url(${apiConfig.originalImage(
                                movie.backdrop_path || movie.posterImage
                            )})`,
                        }}></div>
                    <div className="mb-3 movie-content container">
                        <div className="movie-content__poster">
                            <div
                                className="movie-content__poster__img"
                                style={{
                                    backgroundImage: `url(${apiConfig.originalImage(
                                        movie.posterImage || movie.backdrop_path
                                    )})`,
                                }}></div>
                        </div>
                        <div className="movie-content__info">
                            <h1 className="title">{movie.title || movie.name}</h1>
                            <div className="genres">
                                {movie.genres &&
                                    movie.genres.slice(0, 5).map((genre, i) => (
                                        <span key={i} className="genres__item">
                                            {genre}
                                        </span>
                                    ))}
                            </div>
                            <p className="overview">{movie.overview}</p>
                            <div className="cast">
                                <div className="section__header">
                                    <h2>Casts</h2>
                                </div>
                                <CastList id={movie.id} />
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="section mb-3">
                            <div className="section__header mb-2">
                                <h3>JSON Data</h3>
                            </div>
                            <ReactJson src={movie} theme="colors" indentWidth="8" collapsed="false" />
                        </div>
                    </div>
                    <div className="container">
                        <div className="section mb-3">
                            <div className="section__header mb-2">
                                <h2>Similar</h2>
                            </div>
                            <MovieList category={searchType.genre} genres={movie.genres.toString()} operator="AND" />
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Detail;
