import React from "react";

import HeroSlide from "../components/hero-slide/HeroSlide";

import MovieFilterListRating from "../components/movie-filter-list/MovieFilterListRating";
import MovieFilterListGenre from "../components/movie-filter-list/MovieFilterListGenre";
import MovieFilterListDates from "../components/movie-filter-list/MovieFilterListDates";
import MovieFilterListText from "../components/movie-filter-list/MovieFilterListText";

const Home = () => {
    return (
        <>
            <HeroSlide />

            <div className="container">
                {/* Numerical Range: Movies between 2 dates */}
                <MovieFilterListText />

                {/* Sort By: Top Rated/Most Popular Movie List */}
                <MovieFilterListRating />

                {/* Tag Search: Filter by Genre */}
                <MovieFilterListGenre />

                {/* Numerical Range: Movies between 2 dates */}
                <MovieFilterListDates />

            </div>
        </>
    );
};

export default Home;
