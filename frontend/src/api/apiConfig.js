
let base = null
if (window.location.protocol !== 'https:') {
  base = `http://${window.location.host}`
  
  if (window.location.href.indexOf("localhost") > -1) {
    base = process.env.REACT_APP_MOVIE_SERVICE
  }
}
else {
  base = `https://${window.location.host}`
}

const apiConfig = {
  baseUrl: 'https://api.themoviedb.org/3/',
  javaServiceUrl: base,
  apiKey: window.API_KEY,
  originalImage: (imgPath) => `https://image.tmdb.org/t/p/original/${imgPath}`,
  w500Image: (imgPath) => `https://image.tmdb.org/t/p/w500/${imgPath}`,
};

export default apiConfig;
