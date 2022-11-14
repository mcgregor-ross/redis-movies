
let base = null
if (window.location.protocol !== 'https:') {
  base = `http://${window.location.host}`
}
else {
  base = `https://${window.location.host}`
}

const apiConfig = {
  baseUrl: 'https://api.themoviedb.org/3/',
  javaServiceUrl: base,
  apiKey: process.env.REACT_APP_API_KEY,
  originalImage: (imgPath) => `https://image.tmdb.org/t/p/original/${imgPath}`,
  w500Image: (imgPath) => `https://image.tmdb.org/t/p/w500/${imgPath}`,
};

export default apiConfig;
