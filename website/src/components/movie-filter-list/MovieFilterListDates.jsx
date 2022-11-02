import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DatePicker from "react-datepicker";
import { OutlineButton } from "../button/Button";

//import MovieListRedis from "../movie-list-redis/MovieListRedis";
import MovieCard from "../movie-card/MovieCard";
import javaMovieService from "../../api/javaMovieService";

import logo from "../../assets/redis.png";
import { SwiperSlide, Swiper } from "swiper/react";

import "react-datepicker/dist/react-datepicker.css";
import "./movie-filter-list.scss";

const MovieFilterListDates = (props) => {
    const [movies, setMovies] = useState([]);
    const sortFilters = ["DESC", "ASC"];
    const [yearGT, setYearGT] = useState(new Date("2000/01/01"));
    const [yearLT, setYearLT] = useState(new Date("2001/12/31"));
    const [activeSortFilter, setActiveSortFilter] = useState("DESC");
    const [queryString, setQueryString] = useState();

    useEffect(() => {
        // Get Movie Data from Redis
        const getList = async () => {
            let response = null;
            let params = {
                page: 0,
                size: 20,
                sortBy: "voteAverage",
                sortOrder: activeSortFilter == null ? "DESC" : activeSortFilter,
            };
            response = await javaMovieService.getMoviesByYearBetween(
                yearGT.getFullYear().toString(),
                yearLT.getFullYear().toString(),
                { params }
            );
            setMovies(response.data.content);
        };
        getList();

        const queryBuilder = {
            search: "FT.SEARCH io.redis.model.MovieIdx ",
            pagination: " LIMIT 0 20",
            sort: "SORTBY voteAverage ",
            releaseDate: "@releaseDateUTC:[",
        };

        // Update Query String
        function buildQueryString() {
            var query = queryBuilder.search + queryBuilder.releaseDate;

            // Multi-Year Range Search
            if (yearLT && yearGT) {
                query += yearGT.getFullYear().toString() + " " + yearLT.getFullYear().toString() + "] ";
            }

            // Single Year Search
            if (!yearLT && yearGT) {
                query += yearGT.getFullYear().toString() + "] ";
            }

            query += queryBuilder.sort + activeSortFilter + queryBuilder.pagination;
            setQueryString(query);
        }
        buildQueryString();
    }, [activeSortFilter, yearGT, yearLT]);

    /**
     * OR/AND sorting and coordinating query rebuild
     * @param {*} param
     */
    const handleSort = (param) => {
        if (param !== activeSortFilter) {
            setActiveSortFilter(param);
        }
    };

    /**
     * Build Redis Search Query Syntax
     * @param {*} param
     */

    return (
        <div className="section mb-3">
            <div className="section__header mb-2">
                <div className="movieList_heading">
                    <h2>Search by Date Range</h2>
                    <h5>Numerical Ranges search i.e. Search for movies on or between particular years</h5>
                </div>
                <Link to="/movie">
                    <OutlineButton className="small">View more</OutlineButton>
                </Link>
            </div>
            <div className="section__header mb-2">
                <div className="filter-content">
                    <div className="filter-content-year">
                        <h5 style={{ display: "flex", lineHeight: "35px", marginRight: "1rem" }}> From: </h5>
                        <DatePicker
                            selected={yearGT}
                            placeholderText="Year From"
                            minDate={new Date("1900/01/01")}
                            maxDate={yearLT}
                            onChange={(date) => setYearGT(date)}
                            showYearPicker
                            dateFormat="yyyy"
                        />
                        <h5 style={{ display: "flex", lineHeight: "35px", marginRight: "1rem", marginLeft: "1rem" }}>
                            {" "}
                            To:{" "}
                        </h5>
                        <DatePicker
                            selected={yearLT}
                            minDate={yearGT}
                            maxDate={new Date()}
                            onChange={(date) => setYearLT(date)}
                            showYearPicker
                            dateFormat="yyyy"
                        />
                    </div>
                </div>
                <div className="filter-button">
                    {sortFilters &&
                        sortFilters.slice().map((val, i) => (
                            <OutlineButton
                                key={i}
                                className={`${activeSortFilter === val ? "small active" : "small"}`}
                                onClick={(event) => handleSort(val)}>
                                {val}
                            </OutlineButton>
                        ))}
                </div>
            </div>
            <div className="section__header mb-2">
                <div className="code">
                    <img src={logo} alt="" />
                    <code className="text-white">{queryString}</code>
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

export default MovieFilterListDates;
