import React from 'react';
import { User, Mail, History, Award, LogOut } from 'lucide-react';


export default function Dashboard({ user, onLogout }) {


  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
        <h2 className="text-2xl font-bold text-white text-center">
          Loading user data...
        </h2>
        <p className="text-center text-gray-400">
          If this message persists, please try logging in again.
        </p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

       
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="flex justify-between items-start">
           
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome back, {user.displayName || (user.email ? user.email.split('@')[0] : 'User')}!
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <User className="w-5 h-5 text-indigo-500" />
                  <span>{user.displayName || 'No display name'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Mail className="w-5 h-5 text-indigo-500" />
                  <span>{user.email || 'No email provided'}</span>
                </div>
              </div>
            </div>
            
            // LOGOUT BUTTON 
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>

       
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
       
          <div className="lg:col-span-1 space-y-6">
            
           
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-500" />
                Your Latest 5 Searches
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                This feature is coming soon.
              </p>
            </div>
            
           
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Top Searchers
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                This feature is coming soon.
              </p>
            </div>
          </div>

         
          <div className="lg:col-span-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
               Your Dashboard
             </h3>
             <p className="text-gray-600 dark:text-gray-300">
               This is your personal dashboard.
               <br/><br/>
               The main image search is now available on the Home Page.
             </p>
          </div>

        </div>

      </div>
    </div>
  );
}
