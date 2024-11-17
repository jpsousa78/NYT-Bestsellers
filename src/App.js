import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = '82UmBzC3cHF3CGf1MtLzoGxx5sh9bsd0';
  const API_URL = `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${API_KEY}`;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(API_URL);
        setBooks(response.data.results.books);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="App">
      <h1>New York Times Bestsellers - Hardcover Fiction</h1>
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
    </div>
  );
}

export default App;
