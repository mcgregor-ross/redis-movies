import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";

import { sortCriteria, searchBuilder } from "../../types/staticTypes";

import { buildRedisQueryString } from "../utility/Utility";

import MovieCard from "../movie-card/MovieCard";
import Button, { OutlineButton } from "../button/Button";
import Input from "../input/Input";
import FilterPanels from "../filter-panels/FilterPanels";
import javaMovieService from "../../api/javaMovieService";
import logo from "../../assets/redis.png";

import "./movie-grid.scss";

const MovieGrid = (props) => {
    const pageParams = {
        page: 0,
        pageSize: 20,
        totalPage: 0,
        totalMovies: 0,
        movies: [],
        searchTerm: "",
        sortBy: "popularity",
        sortOrder: "DESC",
        query: "*",
    };

    const [sort, setSort] = useState(sortCriteria[0]);
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(0);
    const [respTime, setRespTime] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [totalMovies, setTotalMovies] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    const [params, setParams] = useState({ page: 0, size: 20, query: "*", sortBy: "popularity", sortOrder: "DESC" });
    const [filters, setFilters] = useState({});
    const [queryString, setQueryString] = useState();

    useEffect(() => {
        if (!searchTerm && movies.length <= 0) {
            getSearchData(filters, params);
        }
    }, []);

    const buildQueryString = (filterProps, params) => {
        setQueryString(buildRedisQueryString(filterProps, params));
    };

    const newMovieSearch = (params) => {
        params.page = 0;
        getSearchData(filters, params);
    };

    const getSearchData = async (filterProps, params) => {

        const start = new Date().getTime();

        // Define Search type i.e.
        let response = null;
        if (Object.keys(filterProps).length > 0) {
            // Query is passed as a filter prop in the API
            if (params.query && params.query !== "*") {
                filterProps.query = params.query;
            }

            response = await javaMovieService.getMoviesByAdvancedSearch({ filterProps, params });
            buildQueryString(filterProps, params);
            setFilters(filterProps);
        } else {
            response = await javaMovieService.getMoviesBySearchTerm({ params });
            buildQueryString(null, params);
        }

        setRespTime(new Date().getTime() - start);
        setPage(response.data.pageable.pageNumber);
        setTotalPage(response.data.totalPages);
        setTotalMovies(response.data.totalElements);

        if (params.page > 0) {
            setMovies([...movies, ...response.data.content]);
        } else {
            setMovies(response.data.content);
        }
    };

    // Searchbar
    const handleSearch = () => {
        params.query = "*";
        delete filters["query"];
        if (searchTerm && searchTerm.trim().length > 3) {
            params.query = searchTerm;
        }
        params.page = 0;
        getSearchData(filters, params);
    };

    // Sortbar
    const handleSort = (props) => {
        // Unneccessary, but react refuses to put a parsable objects into props :/
        const sort = sortCriteria.find((element) => {
            return element.key === props;
        });
        setSort(sort);
        params.sortBy = sort.sort_by;
        params.sortOrder = sort.sort_order;
        newMovieSearch(params);
    };

    // Triggers Search by pressing the enter key
    const handleKeypress = (e) => {
        if (e.charCode === 13) {
            handleSearch();
        }
    };

    // Filter bar
    const handleFiltering = (props) => {
        for (let [key, value] of Object.entries(props)) {
            if (key === "genres" && value.length > 0 && Array.isArray(value)) {
                // add genres as a command seperated list & ensure default operator
                if (Array.isArray(value)) {
                    props.genres = value.map((genre) => genre.value).join(",");
                    setFilters((props) => {
                        return {
                            genres: value.map((genre) => genre.value).join(","),
                            genreOperator: props.genreOperator ? props.genreOperator : "OR",
                        };
                    });
                }
            } else {
                setFilters(() => {
                    return {
                        [key]: value,
                    };
                });
            }
        }
        params.page = 0;
        getSearchData(props, params);
    };

    const clearFiltering = (props) => {
        params.page = 0;
        getSearchData(filters, params);
    };

    const loadMore = async () => {
        params.page = page + 1;
        let response = null;
        getSearchData(filters, params);
    };

    return (
        <>
            <div className="section mb-3">
                <div className="movie-search">
                    <div className="row">
                        <div className="col" style={{ paddingLeft: "1rem", textAlign: "left" }}>
                            results : <b>{totalMovies}</b>
                        </div>
                        <div className="col" style={{ textAlign: "center" }}>
                            Search took: <b>{respTime}ms</b> (roundtrip)
                        </div>
                        <div className="col" style={{ paddingRight: "1rem", textAlign: "right" }}>
                            Page <b>{page + 1}</b> of <b>{totalPage}</b>
                        </div>
                    </div>
                </div>
                <div className="movie-search">
                    <Input
                        type="text"
                        placeholder="Enter Search Term"
                        value={searchTerm}
                        onKeyPress={handleKeypress}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button className="search" onClick={handleSearch}>
                        Search
                    </Button>
                </div>
                <div className="movie-search">
                    <div className="code">
                        <img src={logo} alt="" />
                        <code className="text-white">{queryString}</code>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-3" id="sticky-sidebar">
                    <FilterPanels
                        handleSort={handleSort}
                        handleFiltering={handleFiltering}
                        clearFiltering={clearFiltering}
                    />
                </div>
                <div className="col" id="main">
                    <div className="movie-grid">
                        {movies.map((movie, i) => (
                            <MovieCard category={props.category} item={movie} key={i} />
                        ))}
                    </div>
                    {page + 1 < totalPage ? (
                        <div className="movie-grid__loadmore">
                            <OutlineButton className="small" onClick={loadMore}>
                                Load more
                            </OutlineButton>
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
};

export default MovieGrid;
