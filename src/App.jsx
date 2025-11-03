import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
Route,
Navigate,
} from "react-router-dom";
// import "./App.css"; // Make sure this file exists
import Header from "./componant/header/header.jsx"; // Path ko vaapas "componant" kar diya
import LoginPage from "./Authentication/OAuth.jsx"; // Yeh path theek tha
import Dashboard from "./componant/user-dashboard/dashboard.jsx"; // Path ko vaapas "componant" kar diya
import ImageResults from "./componant/ImageResults/ImageResults.jsx"; // Path ko "componant" kar diya

// !! IMPORTANT !!
// 'process.env' browser mein direct nahi chalta.
// Aapko apni key yahan direct daalni hogi.
const UNSPLASH_ACCESS_KEY = 'REACT_APP_UNSPLASH_ACCESS_KEY'; // <-- Key yahan daalein

const App = () => {
  // --- Auth State (Aapka original code) ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // --- Search State (Header aur ImageResults ke liye) ---
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchStatus, setSearchStatus] = useState('Search for images to begin.');
  const [selectedImages, setSelectedImages] = useState([]);

  // Check login status on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // --- Login function (Aapka original code) ---
  const handleLogin = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  };

  // --- Logout function (Aapka original code) ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  // --- Search Submit Function (Header ko pass hoga) ---
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (!term) return;

    setIsSearchLoading(true);
    setError(null);
    setResults([]);
    setSelectedImages([]);
    setSearchStatus(`Loading images for '${term}'...`);

    // --- Unsplash API Call (Key ab variable se aa rahi hai) ---
    const apiUrl = `https://api.unsplash.com/search/photos?query=${term}&per_page=20&client_id=${UNSPLASH_ACCESS_KEY}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        // Agar key galat hai toh yeh error aayega
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

  // --- Selection Function (ImageResults ko pass hoga) ---
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
        
        {/* Header ab hamesha dikhega aur use search state milega */}
        <Header
          user={user}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearchSubmit={handleSearchSubmit}
          isSearchLoading={isSearchLoading}
        />

        <main>
          <Routes>
            
            {/* Home Page (Ab ImageResults dikhayega) */}
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

            {/* Login / Register Page (Aapka original code) */}
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

            {/* Dashboard (Protected - onLogout ab Dashboard ko pass hoga) */}
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

