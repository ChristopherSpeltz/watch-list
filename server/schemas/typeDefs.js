const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Movie {
    overview: String
    movieId: Int!
    poster_path: String
    release_date: String
    title: String!
    homepage: String
  }
  type User {
    _id: ID
    username: String!
    email: String!
    movieCount: Int
    savedMovies: [Movie]
  }
  type Auth {
    token: ID!
    user: User
  }
  input SavedMovieInput {
    overview: String
    movieId: Int!
    poster_path: String
    release_date: String
    title: String
    homepage: String
  }
  type Query {
    me: User
  }
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveMovie(input: SavedMovieInput): User
    removeMovie(movieId: String!): User
  }
`;

module.exports = typeDefs;