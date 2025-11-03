import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
Route,
Navigate,
} from "react-router-dom";

import Header from "./componant/header/header.jsx"; // Path ko vaapas "componant" kar diya
import LoginPage from "./Authentication/OAuth.jsx"; // Yeh path theek tha
import Dashboard from "./componant/user-dashboard/dashboard.jsx"; // Path ko vaapas "componant" kar diya
import ImageResults from "./componant/ImageResults/ImageResults.jsx"; // Path ko "componant" kar diya


const UNSPLASH_ACCESS_KEY = 'REACT_APP_UNSPLASH_ACCESS_KEY'; // <-- Key yahan daalein

const App = () => {
 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchStatus, setSearchStatus] = useState('Search for images to begin.');
  const [selectedImages, setSelectedImages] = useState([]);

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

 
  const handleLogin = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  };

 
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

 
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (!term) return;

    setIsSearchLoading(true);
    setError(null);
    setResults([]);
    setSelectedImages([]);
    setSearchStatus(`Loading images for '${term}'...`);

    
    const apiUrl = `https://api.unsplash.com/search/photos?query=${term}&per_page=20&client_id=${UNSPLASH_ACCESS_KEY}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
       
        if(response.status === 401) {
           throw new Error(`Unauthorized: Check your Unsplash API key.`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResults(data.results);
      setIsSearchLoading(false);

      if (data.results.length === 0) {
        setSearchStatus(`No images found for '${term}'. Try another search.`);
      } else {
        setSearchStatus(`You searched for '${term}' -- ${data.results.length} results.`);
      }
    } catch (err) {
      console.error('Error fetching from Unsplash:', err);
      setError(`Error loading images: ${err.message}`);
      setSearchStatus('Failed to load results.');
      setIsSearchLoading(false);
    }
  };

  
  const handleToggleSelection = (id) => {
    setSelectedImages((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((imgId) => imgId !== id)
        : [...prevSelected, id]
    );
  };

  return (
    <Router>
      <div className="app-container min-h-screen bg-gray-100 dark:bg-gray-900">
        
        
        <Header
          user={user}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearchSubmit={handleSearchSubmit}
          isSearchLoading={isSearchLoading}
        />

        <main>
          <Routes>
            
           
            <Route
              path="/"
              element={
                <ImageResults
                  results={results}
                  isLoading={isSearchLoading}
                  error={error}
                  searchStatus={searchStatus}
                  selectedImages={selectedImages}
                  onToggleSelection={handleToggleSelection}
                />
              }
            />

            
            <Route
              path="/OAuth"
              element={
                isLoggedIn ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              }
            />

            
            <Route
              path="/dashboard"
              element={
                isLoggedIn ? (
                  <Dashboard user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/OAuth" />
                )
              }
            />

          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;

