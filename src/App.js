import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import logo from './logo.png'
import {
  Container,
  Divider,
  Grid,
  Header,
  List,
  Menu,
  Segment,
} from 'semantic-ui-react'

function App() {

  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('hardcover-fiction');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Image hyperlinks - Not relevant, but fun
  const sugar = 'https://static.wikia.nocookie.net/powerpuff/images/5/54/Pouring_Sugar.png/revision/latest/scale-to-width-down/1200?cb=20190131193417';
  const spice = 'https://static.wikia.nocookie.net/powerpuff/images/7/73/Pouring_Spice.png/revision/latest/scale-to-width-down/1000?cb=20190131193425';
  const nice = 'https://static.wikia.nocookie.net/powerpuff/images/8/86/Pouring_Everything_Nice.png/revision/latest/scale-to-width-down/1000?cb=20190131193432';
  const cofee = 'https://media.tenor.com/KC5lFvefaGwAAAAM/coffee-time-fry.gif';
  
  const API_BASE_LINK = 'https://api.nytimes.com/svc/books/v3/lists/'
  const API_KEY = '82UmBzC3cHF3CGf1MtLzoGxx5sh9bsd0';


  useEffect(() => {

    // Function used to load every book list category from the ny times book api
    const fetchLists = async () => {
      setLoading(true); 
      setError(null);
      try {
        const response = await axios.get(
          `${API_BASE_LINK}names.json?api-key=${API_KEY}`
        );
        setGenres(response.data.results);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchLists();

    // Function used to load every book from its respective list category from the ny times book api
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${API_BASE_LINK}current/${selectedGenre}.json?api-key=${API_KEY}`
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

  // Handles category list changes
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

      <Segment inverted vertical style={{margin: '5em 0em 0em', padding: '5em 0em'}}>
        <Container textAlign='center'>
          <Grid divided inverted stackable textAlign='center'>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='Made With' />
              <List link inverted>
                <List.Item as='a' href={sugar}>Sugar</List.Item>
                <List.Item as='a' href={spice}>Spice</List.Item>
                <List.Item as='a' href={nice}>Everything Nice</List.Item>
                <List.Item as='a' href={cofee}>Coffee</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={7}>
              <Header inverted as='h4' content='FrontEnd Challenge' />
              <p>
                Creating a single-page application that displays lists of bestsellers from 
                the New York Times Books API.
              </p>
            </Grid.Column>
          </Grid>

          <Divider inverted section />
          <List horizontal inverted divided link size='small'>
            <List.Item as='a' href='#'>
              Site Map
            </List.Item>
            <List.Item as='a' href='#'>
              Contact Us
            </List.Item>
            <List.Item as='a' href='#'>
              Terms and Conditions
            </List.Item>
            <List.Item as='a' href='#'>
              Privacy Policy
            </List.Item>
          </List>
        </Container>
      </Segment>
    </div>
  );
}

export default App;
