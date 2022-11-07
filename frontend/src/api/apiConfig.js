const apiConfig = {
  baseUrl: 'https://api.themoviedb.org/3/',
  javaServiceUrl: `http://${process.env.REACT_APP_MOVIE_SERVICE_HOST}:${process.env.REACT_APP_MOVIE_SERVICE_PORT}/`,
  apiKey: process.env.REACT_APP_API_KEY,
  originalImage: (imgPath) => `https://image.tmdb.org/t/p/original/${imgPath}`,
  w500Image: (imgPath) => `https://image.tmdb.org/t/p/w500/${imgPath}`,
};

export default apiConfig;
