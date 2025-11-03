import React from 'react';
import { Home, Search, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // React Router hooks

// --- HEADER COMPONENT ---
// Ise props (user, search state) App.jsx se milenge
const Header = ({ user, searchTerm, setSearchTerm, onSearchSubmit, isSearchLoading }) => {
  const navigate = useNavigate();

  // Check karein ki user logged in hai
  const isLoggedIn = user && !user.isAnonymous; // Purana logic
  // const isLoggedIn = !!user; // Naya logic

  return (
    <nav className="w-full bg-gray-100 dark:bg-gray-800 p-3 shadow-md transition-colors duration-300 flex justify-between items-center gap-4">
      
      {/* Left Side: Logo (Home link) */}
      <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
        <Home className="w-6 h-6 text-indigo-500" />
        <span className="text-2xl font-bold text-gray-900 dark:text-white font-serif">
          Soul
        </span>
      </Link>

      {/* Center: Search Bar */}
      <form
        onSubmit={onSearchSubmit}
        className="flex-grow max-w-xl mx-4"
      >
        <div className="flex gap-2">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for images (e.g., 'nature', 'cats')"
            className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            disabled={isSearchLoading}
            className="p-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center w-24"
          >
            {isSearchLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>
        </div>
      </form>

      {/* Right Side: Conditional UI */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {isLoggedIn ? (
          <>
            {/* User ka naam, dashboard par link karega */}
            <Link
              to="/dashboard"
              className="text-md font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600"
            >
              {/* Hum user.displayName (Google/FB) ya user.email use kar sakte hain */}
              {user.displayName || (user.email ? user.email.split('@')[0] : 'Profile')}
            </Link>
          </>
        ) : (
          /* Agar logged in nahi hai, toh Create Account button */
          <button
            onClick={() => navigate('/OAuth')} // React Router navigation
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Create Account
          </button>
        )}
      </div>
    </nav>
  );
};

export default Header;
