import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { OutlineButton } from "../button/Button";
import { SwiperSlide, Swiper } from "swiper/react";

import MovieCard from "../movie-card/MovieCard";
import GenreFilter from "../filters/genre/GenreFilter";
import javaMovieService from "../../api/javaMovieService";

import logo from "../../assets/redis.png";

import "./movie-filter-list.scss";

const MovieFilterListGenre = (props) => {
    const [movies, setMovies] = useState([]);
    const sortFilters = ["AND", "OR"];

    // TODO: Handle No Genres being selected
    const [activeGenres, setActiveGenres] = useState([
        { value: "Action", label: "Action" },
        { value: "Fantasy", label: "Fantasy" },
    ]);

    const [activeSortFilter, setActiveSortFilter] = useState("OR");
    const [queryString, setQueryString] = useState();

    useEffect(() => {
        // Get Movie Data from Redis
        const getList = async () => {
            let response = null;
            let params = {
                page: 0,
                size: 20,
                genres: activeGenres.map((g) => g.value).join(","),
                operator: activeSortFilter == null ? "OR" : activeSortFilter,
                sortBy: "voteAverage",
                sortOrder: "DESC"
            };
            response = await javaMovieService.getMoviesByGenres({ params });
            setMovies(response.data.content);
        };
        getList();

        const queryBuilder = {
            search: "FT.SEARCH io.redis.model.MovieIdx ",
            pagination: "LIMIT 0 20",
            sort: "SORTBY voteAverage DESC ",
            genre: "@genres:{",
        };

        function buildQueryString() {
            var query = queryBuilder.search;
            if (activeGenres.length > 0) {
                switch (activeSortFilter) {
                    case "AND":
                        activeGenres.forEach((genre) => (query += queryBuilder.genre + genre.value + "} "));
                        break;
                    default:
                    case "OR":
                        query += queryBuilder.genre + activeGenres.map((g) => g.value).join("|") + "} ";
                        break;
                }
                query += queryBuilder.sort + queryBuilder.pagination;
                setQueryString(query);
            }
        }
        buildQueryString();
    }, [activeSortFilter, activeGenres]);

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
     * React-Select Multi onChange event, add/remove prop to activeGenres
     * @param {} e
     */
    const handleChange = (e) => {
        setActiveGenres(e);
    };

    return (
        <div className="section mb-3">
            <div className="section__header mb-2">
                <div className="movieList_heading">
                    <h2>Search by Genres</h2>
                    <h5>Tag/Category Matches for Genres i.e. Movies with Action OR Fantasy as a genre</h5>
                </div>
                <Link to="/movie">
                    <OutlineButton className="small">View more</OutlineButton>
                </Link>
            </div>
            <div className="section__header mb-2">
                <div className="filter-content">
                    <div className="filter-button-select">
                        <GenreFilter handleChange = {handleChange} activeGenres={activeGenres}/>
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
            {/* <MovieListRedis category={searchType.genre} genres="Action,Fantasy" /> */}
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

export default MovieFilterListGenre;
