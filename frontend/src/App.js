// src/App.js
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import MovieSearch from './components/MovieSearch';
import MovieDetails from './components/MovieDetails';
import { isLoggedIn, logout } from './utils/auth';
import './App.css';


export default function App() {
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(isLoggedIn());

  // Handle logout
  const handleLogout = () => {
    logout();
    setUserLoggedIn(false);
    setSelectedMovieId(null);
  };

  return (
    <Router>
      <div className="App" style={{ padding: 20 }}>
        <header>
          <h1>🎬 Movie Review System</h1>
          <nav>
            {userLoggedIn ? (
              <>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <a href="/login" color="red" style={{ marginRight: 10 }}>Login</a>
                <a href="/register" color="red">Register</a>
              </>
            )}
          </nav>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <MovieSearch onSelect={setSelectedMovieId} />
                {selectedMovieId && <MovieDetails imdbID={selectedMovieId} />}
              </>
            }
          />
          <Route
            path="/login"
            element={userLoggedIn ? <Navigate to="/" /> : <Login onLogin={() => setUserLoggedIn(true)} />}
          />
          <Route
            path="/register"
            element={userLoggedIn ? <Navigate to="/" /> : <Register onRegister={() => setUserLoggedIn(true)} />}
          />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}
