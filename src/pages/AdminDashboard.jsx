import React, { useState } from 'react';
import { UserCircleIcon, DocumentIcon, BuildingLibraryIcon, DocumentTextIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import Users from '../components/Users';
import Activity from '../components/Activity';
import Departments from '../components/Departments';
import Terms from '../components/Terms';
import Staff from '../components/Staff';
import logo from '../logo.png';

const AdminDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('users');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // To toggle the sidebar on small screens

  const handleLogout = () => {
    // Clear local storage and redirect to login page
    localStorage.clear();
    alert('Logged out!');
    window.location.href = '/'; 
  };
  

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`sidebar bg-gray-900 text-white w-64 p-6 fixed top-0 left-0 bottom-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-64'} lg:translate-x-0`}
      >

        <div className="header">
                <img src={logo} alt="University Logo" />
                <h2 className="text-2xl font-bold mb-6 text-center text-[#c18c2d]">{localStorage.name}</h2>
              </div>
        
        <ul className="menu space-y-4">
          {/* Sidebar Menu Items */}
          <li
            onClick={() => setSelectedMenu('staff')}
            className="cursor-pointer hover:bg-gray-700 p-3 rounded-md flex items-center space-x-4 transition-colors duration-200"
          >
            <UserCircleIcon className="h-5 w-5 text-[#c18c2d]" />
            <span>Staff</span>
          </li>
          <li
            onClick={() => setSelectedMenu('users')}
            className="cursor-pointer hover:bg-gray-700 p-3 rounded-md flex items-center space-x-4 transition-colors duration-200"
          >
            <UserCircleIcon className="h-5 w-5 text-[#c18c2d]" />
            <span>Users</span>
          </li>
          <li
            onClick={() => setSelectedMenu('activity')}
            className="cursor-pointer hover:bg-gray-700 p-3 rounded-md flex items-center space-x-4 transition-colors duration-200"
          >
            <DocumentIcon className="h-5 w-5 text-[#c18c2d]" />
            <span>Activity</span>
          </li>
          <li
            onClick={() => setSelectedMenu('departments')}
            className="cursor-pointer hover:bg-gray-700 p-3 rounded-md flex items-center space-x-4 transition-colors duration-200"
          >
            <BuildingLibraryIcon className="h-5 w-5 text-[#c18c2d]" />
            <span>Departments</span>
          </li>
          <li
            onClick={() => setSelectedMenu('terms')}
            className="cursor-pointer hover:bg-gray-700 p-3 rounded-md flex items-center space-x-4 transition-colors duration-200"
          >
            <DocumentTextIcon className="h-5 w-5 text-[#c18c2d]" />
            <span>Terms</span>
          </li>
          <li
            onClick={handleLogout}
            className="cursor-pointer hover:bg-gray-700 p-3 rounded-md flex items-center space-x-4 transition-colors duration-200 mt-8"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 text-[#c18c2d]" />
            <span>Logout</span>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div
        className={`main-content flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-64`}
      >
        

        {/* Dynamic content based on selected menu */}
        {selectedMenu === 'staff' && <Staff />}
        {selectedMenu === 'users' && <Users />}
        {selectedMenu === 'activity' && <Activity />}
        {selectedMenu === 'departments' && <Departments />}
        {selectedMenu === 'terms' && <Terms />}
      </div>

      {/* Toggle Sidebar Button (for mobile screens) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md"
      >
        {isSidebarOpen ? 'Close' : 'Open'} Sidebar
      </button>
    </div>
  );
};

export default AdminDashboard;
