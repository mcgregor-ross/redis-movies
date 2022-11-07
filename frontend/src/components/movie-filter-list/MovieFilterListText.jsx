import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";

import { SwiperSlide, Swiper } from "swiper/react";

import MovieCard from "../movie-card/MovieCard";
import MovieCardNotFound from "../movie-card/MovieCardNotFound";
import Button, { OutlineButton } from "../button/Button";
import Input from "../input/Input";
import javaMovieService from "../../api/javaMovieService";

import logo from "../../assets/redis.png";

import "./movie-filter-list.scss";

const MovieFilterListText = (props) => {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('"James Bond"');

    const searchTerms = [
        { value: '"James Bond"', label: '"James Bond"'},
        { value: "James*", label: "James*" },
        { value: "Aliens", label: "Aliens" },
        { value: "@title:(Aliens)", label: "@title:(Aliens)" },
        { value: '@title:("Aliens")', label: '@title:("Aliens")' },
        { value: '@title:("Aliens") -@title:(Monsters|Cowboys|Attic)', label: '@title:("Aliens") -@title:(Monsters|Cowboys|Attic)' },
    ];
    const [preSelectedST, setPreSelectedST] = useState(searchTerms[0]);

    useEffect(() => {
        // Get Movie Data from Redis
        const getList = async () => {
            let response = null;
            let params = { page: 0, size: 20, query: searchTerm };
            response = await javaMovieService.getMoviesBySearchTerm({ params });
            setMovies(response.data.content);
        };
        getList();
    }, [searchTerm, preSelectedST]);

    function handleClick(param) {
        if (param) {
            setSearchTerm(param);
        }
    }

    /**
     * Handle React-Select 'pre-aggregated' search terms
     * @param {} e
     */
    const handleChange = (e) => {
        if ( e.length > 0 ) {
        setPreSelectedST(e.at(-1));
        setSearchTerm(e.at(-1).value);
        } else {
            setPreSelectedST([]);
            setSearchTerm("*");
        }
    };

    return (
        <div className="section mb-3">
            <div className="section__header mb-2">
                <div className="movieList_heading">
                    <h2>Full Text Search</h2>
                    <h5>Search all Movies by provided text syntax</h5>
                </div>
                <Link to="/movie">
                    <OutlineButton className="small">View more</OutlineButton>
                </Link>
            </div>
            <div className="section__header mb-2">
                <div className="filter-content">
                    <div className="movie-search">
                        <Input
                            type="text"
                            placeholder="Enter Search Terms"
                            value={searchTerm}
                            onChange={(e) => {
                                if (preSelectedST) {
                                    setPreSelectedST(null);
                                }
                                setSearchTerm(e.target.value);
                            }}
                        />
                        <Button className="small" onClick={() => handleClick(searchTerm)}>
                            Search
                        </Button>
                    </div>
                </div>
                <div className="filter-button">
                    <div className="filter-button-select">
                        <Select
                            value={preSelectedST}
                            isMulti="true"
                            className="basic-single"
                            classNamePrefix="select"
                            styles={selectStyles}
                            placeholder="Select a Search Term"
                            name="search-terms"
                            options={searchTerms}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
            <div className="section__header mb-2">
                <div className="code">
                    <img src={logo} alt="" />
                    <code className="text-white">FT.SEARCH io.redis.model.MovieIdx {searchTerm} SORTBY voteAverage LIMIT 0 20</code>
                </div>
            </div>
            <div className="movie-list">
                {movies.length > 0 ? (
                    <Swiper grabCursor={true} spaceBetween={10} slidesPerView={"auto"}>
                        {movies.map((movie, i) => (
                            <SwiperSlide key={i}>
                                <MovieCard item={movie} category={props.category} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                        <MovieCardNotFound />
                )}
            </div>
        </div>
    );
};

const selectStyles = {
    option: (provided) => ({
        ...provided,
        borderBottom: "1px dotted pink",
        color: "red",
        padding: 20,
        zIndex: 98,
    }),
    control: (styles) => ({
        ...styles,
        backgroundColor: "black",
        color: "white",
        fontWeight: 600,
        border: "2px solid white",
        boxShadow: "white",
        "&:hover": {
            border: "2px solid white",
        },
    }),
    menuList: (provided, state) => ({
        ...provided,
        paddingTop: 0,
        paddingBottom: 0,
        boxShadow: state.isFocused ? "red" : "white",
    }),
    menu: (base) => ({
        ...base,
        marginTop: 0,
        fontFamily: "Montserrat",
        fontWeight: 600,
        backgroundColor: "white",
        borderRadius: 0,
        color: "red",
        zIndex: 98,
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "red",
    }),
    multiValue: (styles, { data }) => {
        return {
            ...styles,
            backgroundColor: "white",
        };
    },
    multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: "red",
    }),
    multiValueRemove: (styles, { data }) => ({
        ...styles,
        color: "red",
        ":hover": {
            backgroundColor: "red",
            color: "white",
        },
    }),
};

export default MovieFilterListText;
