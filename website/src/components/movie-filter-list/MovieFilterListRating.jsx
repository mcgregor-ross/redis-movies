import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { OutlineButton } from "../button/Button";
import { SwiperSlide, Swiper } from "swiper/react";

import MovieCard from "../movie-card/MovieCard";
import javaMovieService from "../../api/javaMovieService";

import logo from "../../assets/redis.png";

import "./movie-filter-list.scss";

const MovieFilterListRating = (props) => {
    const [movies, setMovies] = useState([]);
    const [activeFilter, setActiveFilter] = useState({
        name: "Top Rated",
        field: "voteAverage",
    });
    const [activeSortFilter, setActiveSortFilter] = useState("DESC");
    const [params, setParams] = useState({ page: 0, size: 20, sortOrder: 'DESC' });
    
    useEffect(() => {
        if (movies.length <= 0) {
            getMovieData(activeFilter.field, params);
        }
    }, []);

    const queryFilters = [
        {
            name: 'Top Rated',
            field: 'rating',
            actual: 'voteAverage' 
        },
        {
            name: 'Popularity',
            field: 'popularity',
            actual: 'popularity' 
        },
        {
            name: 'Budget',
            field: 'budget',
            actual: 'budget' 
        },
        {
            name: 'Revenue',
            field: 'revenue',
            actual: 'revenue' 
        },
        {
            name: 'Runtime',
            field: 'runtime',
            actual: 'runtime' 
        },
        {
            name: 'Date',
            field: 'date',
            actual: 'releastDateUTC' 
        },
    ];

    const sortFilters = [
        {
            name: "DESC",
            style: "bx bx-sort-down",
        },
        {
            name: "ASC",
            style: "bx bx-sort-up",
        },
    ];

    const handleClick = (param) => {
        if (param !== activeFilter) {
            setActiveFilter(param);
            getMovieData(param.field, params);
        }
    };

    const handleSort = (direction) => {
        if (direction !== activeSortFilter) {
            setActiveSortFilter(direction);
            params.sortOrder = direction;
            setParams(params);
            getMovieData(activeFilter.field, params);
        }
    };

    const getMovieData = async (filter, params) => {
        let response = await javaMovieService.getSortedMovies( filter, { params } );
        setMovies(response.data.content);
    }

    return (
        <div className="section mb-3">
            <div className="section__header mb-2">
                <div className="movieList_heading">
                    <h2>Top Rated</h2>
                    <h5>Search all Movies and Sort by Rating</h5>
                </div>
                <Link to="/movie">
                    <OutlineButton className="small">View more</OutlineButton>
                </Link>
            </div>
            <div className="section__header mb-2">
                <div className="filter-content">
                    <div className="filter-button">
                        {queryFilters &&
                            queryFilters.map((field, i) => (
                                <OutlineButton
                                    key={i}
                                    className={`${activeFilter.name === field.name ? "small active" : "small"}`}
                                    onClick={(event) => handleClick(field)}>
                                    {field.name}
                                </OutlineButton>
                            ))}
                    </div>
                </div>
                <div className="filter-button">
                    {sortFilters &&
                        sortFilters.map((sort, i) => (
                            <OutlineButton
                                key={i}
                                className={`${activeSortFilter === sort.name ? "small active" : "small"}`}
                                onClick={(event) => handleSort(sort.name)}>
                                <i className={sort.style}></i>
                            </OutlineButton>
                        ))}
                </div>
            </div>
            <div className="section__header mb-2">
                <div className="code">
                    <img src={logo} alt="" />
                    <code className="text-white">
                        FT.SEARCH io.redis.model.MovieIdx "*" SORTBY {activeFilter.actual} {activeSortFilter} LIMIT 0 20
                    </code>
                </div>
            </div>
            <div className="movie-list">
                <Swiper grabCursor={true} spaceBetween={10} slidesPerView={"auto"}>
                    {movies.map((movie, i) => (
                        <SwiperSlide key={i}>
                            <MovieCard item={movie} category={props.category} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default MovieFilterListRating;
