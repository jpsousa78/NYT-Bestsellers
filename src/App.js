import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

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
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="App">
      <h1>New York Times Bestsellers</h1>
      <div className="genre-selector">
        <label htmlFor="genre">Select a genre: </label>
        <select id="genre" onChange={handleGenreChange} value={selectedGenre}>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre.replace('-', ' ')}
            </option>
          ))}
        </select>
      </div>

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
    </div>
  );
}

export default App;
