import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import logo from './logo.png'
import {
  Container,
  Header,
  Menu,
} from 'semantic-ui-react'

function App() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('hardcover-fiction');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_KEY = '82UmBzC3cHF3CGf1MtLzoGxx5sh9bsd0';

  useEffect(() => {
    const fetchLists = async () => {
      setLoading(true); 
      setError(null);
      try {
        const response = await axios.get(
          `https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=${API_KEY}`
        );
        setGenres(response.data.results);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchLists();
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://api.nytimes.com/svc/books/v3/lists/current/${selectedGenre}.json?api-key=${API_KEY}`
        );
        setBooks(response.data.results.books);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data.');
        setLoading(false);
      }
    };

    fetchBooks();
  }, [selectedGenre]);

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  return (
    <div>
      <Menu fixed='top' inverted>
        <Container>
          <Menu.Item as='a' header>
            <img size='mini' alt='NYT logo' src={logo} style={{ marginRight: '1.5em' }} />
            New York Times Bestsellers
          </Menu.Item>
          <Menu.Item as='a'>Home</Menu.Item>
          <Menu.Item as='a'>
            <label>Select list: </label>
            <select id="genre" onChange={handleGenreChange} value={selectedGenre}>
              {genres.map((genre) => (
                <option key={genre.list_name_encoded} value={genre.list_name_encoded}>
                  {genre.display_name}
                </option>
              ))}
            </select>
          </Menu.Item>
        </Container>
      </Menu>

      <Container text style={{ marginTop: '7em' }}>
        <Header as='h1'>{(genres.find((item) => item.list_name_encoded === selectedGenre))?.display_name ?? 'Select a list of'} Bestsellers</Header>
        <p>Below are the NYT top 10 picks for the bestsellers in the selected genre.</p>

        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}

        {!loading && !error && (
          <ul>
            {books.map((book) => (
              <li key={book.rank}>
                <h2>{book.title} by {book.author}</h2>
                <p>Rank: {book.rank}</p>
                <img src={book.book_image} alt={book.title} width="150" />
                <p>{book.description}</p>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </div>
  );
}

export default App;
