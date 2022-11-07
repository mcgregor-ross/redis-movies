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

  export const sortCriteria = [
    { key: "pd", value: "Popularity Descending", sort_by: "popularity", sort_order: "DESC" },
    { key: "pa", value: "Popularity Ascending", sort_by: "popularity", sort_order: "ASC" },
    { key: "rd", value: "Rating Descending", sort_by: "voteAverage", sort_order: "DESC" },
    { key: "ra", value: "Rating Ascending", sort_by: "voteAverage", sort_order: "ASC" },
    { key: "rdd", value: "Release Date Descending", sort_by: "releaseDateUTC", sort_order: "DESC" },
    { key: "rda", value: "Release Date Ascending", sort_by: "releaseDateUTC", sort_order: "ASC" },
    { key: "taz", value: "Title A-Z", sort_by: "title", sort_order: "ASC" },
    { key: "tza", value: "Title Z-A", sort_by: "title", sort_order: "DESC" },
    { key: "bd", value: "Budgets Descending", sort_by: "budget", sort_order: "DESC" },
    { key: "ba", value: "Budgets Ascending", sort_by: "budget", sort_order: "ASC" },
    { key: "rund", value: "Runtime Descending", sort_by: "runtime", sort_order: "DESC" },
    { key: "runa", value: "Runtime Ascending", sort_by: "runtime", sort_order: "ASC" },
];

export const searchBuilder = {
  index: "FT.SEARCH io.redis.model.MovieIdx ",
  pagination: "LIMIT ",
  sort: "SORTBY ",
  desc: "DESC ",
  asc: "ASC ",
  and: "AND ",
  or: "OR ",
  genre: "@genres:{",
  rating: "@rating:{",
  popularity: "@popularity:{"
};