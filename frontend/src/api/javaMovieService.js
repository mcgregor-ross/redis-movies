import { javaAxiosClient } from "./axiosClient";

import apiConfig from "./apiConfig";

// categories
export const searchType = {
    genre: "genre",
    exact: "exact",
    prefix: "prefix",
    year: "year",
    actors: "actors",
    popular: "popular",
    top_rated: "top_rated",
};

export const series = {
    avengers: "Avengers",
    bond: "James Bond",
};

export const genres = [
    { id: 1, value: "Action", label: "Action" },
    { id: 2, value: "Adventure", label: "Adventure" },
    { id: 3, value: "Horror", label: "Horror" },
    { id: 4, value: "Romance", label: "Romance" },
    { id: 5, value: "War", label: "War" },
    { id: 6, value: "History", label: "History" },
    { id: 7, value: "Science Fiction", label: "Science Fiction" },
    { id: 8, value: "Western", label: "Western" },
    { id: 9, value: "Thriller", label: "Thriller" },
    { id: 10, value: "TV Movie", label: "TV Movie" },
    { id: 11, value: "Music", label: "Music" },
    { id: 12, value: "Crime", label: "Crime" },
    { id: 13, value: "Fantasy", label: "Fantasy" },
    { id: 14, value: "Family", label: "Family" },
    { id: 15, value: "Animation", label: "Animation" },
    { id: 16, value: "Comedy", label: "Comedy" },
    { id: 17, value: "Mystery", label: "Mystery" },
];

const javaMovieService = {
    getMovieById: (id) => {
        console.log("getMovieById with ID : " + id);
        const url = "movie/id/" + id;
        return javaAxiosClient.get(url);
    },

    getMoviesBySearchTerm: (params) => {
        console.log("getMoviesBySearchTerm with params : " + JSON.stringify(params));
        const url = "movie/search";
        return javaAxiosClient.get(url, params);
    },

    getMoviesByAdvancedSearch: ({ filterProps, params }) => {
        console.log("getMoviesByAdvancedSearch: filter criteria: " + JSON.stringify(filterProps) + " & Params : " + JSON.stringify(params));
        const url = "movie/advanced/search";
        return javaAxiosClient.post(url, filterProps, { params: params });
    },

    getMoviesByGenres: (params) => {
        console.log("getMoviesByGenres with Genres : " + JSON.stringify(params));
        const url = "movie/genre";
        return javaAxiosClient.get(url, params);
    },

    getMoviesByActors: (params) => {
        console.log("getMoviesByActors with Actors : " + JSON.stringify(params));
        const url = "movie/actors";
        return javaAxiosClient.get(url, params);
    },

    getMoviesByYear: (year, params) => {
        console.log("getMoviesByYear with params : " + JSON.stringify(params));
        const url = "movie/year/" + year;
        return javaAxiosClient.get(url, params);
    },

    getMoviesByYearBetween: (yearGT, yearLT, params) => {
        console.log("getMoviesByYearBetween with params : " + JSON.stringify(params));
        const url = "movie/years/" + yearGT + "/" + yearLT;
        return javaAxiosClient.get(url, params);
    },

    getSortedMovies: (sort, params) => {
        console.log("JAVA URL ::: " +  apiConfig.javaServiceUrl );
        console.log("getSortedMovies with sort value " +  JSON.stringify(sort) + " params : " + JSON.stringify(params));
        const url = "movie/top/" + sort;
        return javaAxiosClient.get(url, params);
    }
};

export default javaMovieService;
