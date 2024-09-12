import React, { useState, useEffect } from "react";
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  CardColumns,
} from "react-bootstrap";

import Auth from "../utils/auth";
import { searchMovies, searchHomePage } from "../utils/API";
import { saveMovieIds, getSavedMovieIds } from "../utils/localStorage";
import { SAVE_MOVIE } from "../utils/mutations";
import { useMutation } from "@apollo/react-hooks";



const SearchMovies = () => {
  // create state for holding returned movie api data
  const [searchedMovies, setSearchedMovies] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

  // create state to hold saved movieId values
  const [savedMovieIds, setSavedMovieIds] = useState(getSavedMovieIds());

  // set up useEffect hook to save `savedMovieIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    // let isMounted = true; // note this flag denote mount status
    return () => {
      saveMovieIds(savedMovieIds);
      // isMounted = false;
    };
  });

  const [saveMovie, { Error }] = useMutation(SAVE_MOVIE);

  // create method to search for movies and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchMovies(searchInput);

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { results } = await response.json();

      console.log(results)

      const movieData = results.map((movie) => ({
        movieId: movie.id,
        overview: movie.overview,
        title: movie.title,
        release_date: movie.release_date,
        poster_path: "https://image.tmdb.org/t/p/original/" + movie.poster_path || "",
        homepage: getHomePage(movie.id)
      }));
    

      setSearchedMovies(movieData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  const getHomePage =async (movieId) => {
    try {
      const response = await searchHomePage(movieId);

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { results } = await response.json();
      return results;
    
  } catch (err) {
    console.error(err);
  }

  }

  // create function to handle saving a movie to our database
  const handleSaveMovie = async (movieId) => {
    
    const movieToSave = searchedMovies.find((movie) => movie.movieId === movieId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await saveMovie({
        variables: {
          input: movieToSave,
        },
      });

      if (!response) {
        throw new Error("something went wrong!");
      }

      // if movie successfully saves to user's account, save movie id to state
      setSavedMovieIds([...savedMovieIds, movieToSave.movieId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
        <Container  className=" my-auto mt-1 text-warning bg-dark">
          <h1>Find Your Favorite Movies!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a movie"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      

      <Container>
        <CardColumns>
          {searchedMovies.map((movie) => {
            return (
              <Card key={movie.movieId} border="dark">
                {movie.poster_path ? (
                  <Card.Img
                    src={movie.poster_path}
                    alt={`The cover for ${movie.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <p className="small">Release Date: {movie.release_date}</p>
                  <Card.Text>{movie.overview}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedMovieIds?.some(
                        (savedMovieId) => savedMovieId === movie.movieId
                      )}
                      className="btn-block btn-info"
                      onClick={() => handleSaveMovie(movie.movieId)}
                    >
                      {savedMovieIds?.some(
                        (savedMovieId) => savedMovieId === movie.movieId
                      )
                        ? "This movie has already been added to the list!"
                        : "Save this Movie!"}
                    </Button>

                  )}
                  <a href={movie.homepage}>
                  <Button className=" mt-2 btn-block btn-info">
                    Watch Trailer
                  </Button>
                  </a>
                  
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchMovies;