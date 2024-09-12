const { Schema } = require('mongoose');

const movieSchema = new Schema({
  
  overview: {
    type: String,
    required: false,
  },
  movieId: {
    type: String,
    required: true,
  },
  poster_path: {
    type: String,
  },
  release_date: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  homepage: {
    type: String
  }
});

module.exports = movieSchema;