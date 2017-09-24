import axios from 'axios';

const api = axios.create({
  // Using popcorn-api for now, until we finished our own scraper
  baseURL: 'http://tv-v2.api-fetch.website'
});

export function getMovies({ page = 1, genre = 'all', sort = 'year' } = {}) {
  const request = api.get(`/movies/${page}`, {
    params: {
      genre,
      sort
    }
  });
  return request;
}

export function getMovie(id) {
  return api.get(`/movie/${id}`);
}