import React from 'react';
import { Home, Search, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; 

//  HEADER

const Header = ({ user, searchTerm, setSearchTerm, onSearchSubmit, isSearchLoading }) => {
  const navigate = useNavigate();

  
  const isLoggedIn = user && !user.isAnonymous; 
 

  return (
    <nav className="w-full bg-gray-100 dark:bg-gray-800 p-3 shadow-md transition-colors duration-300 flex justify-between items-center gap-4">
      
     
      <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
        <Home className="w-6 h-6 text-indigo-500" />
        <span className="text-2xl font-bold text-gray-900 dark:text-white font-serif">
          Soul
        </span>
      </Link>

     
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

    
      <div className="flex items-center gap-4 flex-shrink-0">
        {isLoggedIn ? (
          <>
           
            <Link
              to="/dashboard"
              className="text-md font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600"
            >
             
              {user.displayName || (user.email ? user.email.split('@')[0] : 'Profile')}
            </Link>
          </>
        ) : (
      
          <button
            onClick={() => navigate('/OAuth')} 
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
