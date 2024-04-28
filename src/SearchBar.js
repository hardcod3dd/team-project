import React, { useState, useEffect } from 'react';
import { TextField, IconButton, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "xxx",
  authDomain: "xxx",
  projectId: "xxx",
  storageBucket: "xxx",
  messagingSenderId: "xxx",
  appId: "xxx",
  measurementId: "xxx"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get Firestore instance (v9 syntax)
const db = getFirestore(app);

const SearchBar = ({ collectionName = "my_collection", searchField, placeholder }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [db, setDb] = useState(null); // Track Firestore instance

  useEffect(() => {
    // Get Firestore instance asynchronously (assuming setup in firebase.js)
    const getDbInstance = async () => {
      const firestore = await getFirestore();
      setDb(firestore);
    };
    getDbInstance();
  }, []);

  useEffect(() => {
    // Clear results when query is empty
    if (!query) {
      setResults([]);
    }
  }, [query]);

  const handleSearch = async () => {
    if (!db) {
      console.error('Firestore not initialized yet.');
      return; // Prevent search if Firestore is not ready
    }

    try {
      setError('');
      const searchQuery = query(collection(db, collectionName), where(searchField, 'like', `%${query}%`)); // Case-insensitive search
      const snapshot = await getDocs(searchQuery);

      if (snapshot.empty) {
        setError('No results found.');
      } else {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setResults(data);
      }
    } catch (error) {
      console.error('Error searching:', error);
      setError('Error searching. Please try again.');
    }
  };

  return (
    <div>
      <TextField
        label="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        variant="outlined"
        placeholder={placeholder || 'Search...'} // Use provided placeholder or default
      />
      <IconButton onClick={handleSearch}>
        <SearchIcon />
      </IconButton>
      {error && <Typography variant="body1" color="error">{error}</Typography>}
      {results.length > 0 && ( // Conditionally render results only when available
        <div>
          {/* Display your search results here */}
          {results.map((result) => (
            <div key={result.id}>
              <p>{result.name} (or other relevant field)</p>
              {/* You can display additional information from the result object */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
