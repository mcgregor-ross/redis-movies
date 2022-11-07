import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import "./movie-list.scss";

import { SwiperSlide, Swiper } from "swiper/react";

import javaMovieService, { searchType } from "../../api/javaMovieService";

import MovieCard from "../movie-card/MovieCard";

const MovieList = (props) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const getList = async () => {
            let response = null;
            let params = { page: 0, size: 20 };

            switch (props.category) {
                case searchType.exact:
                case searchType.prefix:
                    params.query = props.criteria;
                    response = await javaMovieService.getMoviesBySearchTerm({ params });
                    break;
                case searchType.genre:
                    params.genres = props.genres;
                    params.operator = ((props.operator == null) ? "OR" : props.operator);
                    response = await javaMovieService.getMoviesByGenres({ params });
                    break;
                case searchType.popular:
                    response = await javaMovieService.getMostPopularMovies({ params });
                    break;
                case searchType.top_rated:
                    response = await javaMovieService.getTopRateMovies({ params });
                    break;
                case searchType.actors:
                    params.actors = props.actors;
                    params.operator = ((props.operator == null) ? "AND" : props.operator);
                    response = await javaMovieService.getMoviesByActors({ params });
                    break;
                case searchType.year:
                    params = { page: 0, size: 20 };
                    response = await javaMovieService.getMoviesByYearBetween(props.yearGT, props.yearLT, { params });
                    break;
                default:
                    // top rate
                    break;
            }
            setItems(response.data.content);
        };
        getList();
    }, []);

    return (
        <div className="movie-list">
            <Swiper grabCursor={true} spaceBetween={10} slidesPerView={"auto"}>
                {items.map((item, i) => (
                    <SwiperSlide key={i}>
                        <MovieCard item={item} category={props.category} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

MovieList.propTypes = {
    category: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

export default MovieList;
