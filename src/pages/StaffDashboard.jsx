import React, { useState } from 'react';
import { DocumentIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import StaffActivity from '../components/StaffActivity';
import YourActivity from '../components/YourActivity';
import logo from '../logo.png';

const StaffDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('activity');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    alert('Logged out!');
    window.location.href = '/';
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 bg-gray-900 text-white w-64 p-6 h-full transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-64'
        } lg:translate-x-0`}
      >
        <div className="header">
                        <img src={logo} alt="University Logo" />
                        <h2 className="text-2xl font-bold mb-6 text-center text-[#c18c2d]">{localStorage.name}</h2>
                      </div>

        <ul className="menu space-y-8">
          <li
            onClick={() => setSelectedMenu('activity')}
            className="cursor-pointer hover:bg-gray-700 p-3 rounded-md flex items-center space-x-4 transition-colors duration-200 border-b border-gray-600"
          >
            <DocumentIcon className="h-5 w-5 text-[#c18c2d]" />
            <span className="text-lg ml-1">Activity</span>
          </li>

          <li
            onClick={() => setSelectedMenu('youractivity')}
            className="cursor-pointer hover:bg-gray-700 p-3 rounded-md flex items-center space-x-4 transition-colors duration-200 border-b border-gray-600"
          >
            <DocumentIcon className="h-5 w-5 text-[#c18c2d]" />
            <span className="text-lg ml-1">Your Activity</span>
          </li>

          <li
            onClick={handleLogout}
            className="cursor-pointer hover:bg-gray-700 p-3 rounded-md flex items-center space-x-4 transition-colors duration-200 mt-8 border-b border-gray-600"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 text-[#c18c2d]" />
            <span className="text-lg ml-1">Logout</span>
          </li>
        </ul>
      </div>

      {/* Overlay for sidebar on small screens */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 p-6 transition-all duration-300 lg:ml-64 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <button
          className="absolute top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white lg:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? 'Close' : 'Menu'}
        </button>

        {selectedMenu === 'activity' && <StaffActivity />}
        {selectedMenu === 'youractivity' && <YourActivity />}
      </div>
    </div>
  );
};

export default StaffDashboard;