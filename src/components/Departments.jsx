import React, { useState, useEffect } from 'react';
import { addDepartment, editDepartment, deleteDepartment, fetchAllDepartments } from '../utils/api';  // API functions

const DepartmentComponent = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [editing, setEditing] = useState(false);
  const [editDepartmentId, setEditDepartmentId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages

  // Fetch all departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await fetchAllDepartments();
      setDepartments(data.departments);  // Assuming response contains { departments: [...] }
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      setErrorMessage('Failed to load departments. Please try again later.');
    }
  };

  // Add new department
  const handleAddDepartment = async () => {
    if (!newDepartmentName) {
      setErrorMessage('Department name cannot be empty.');
      return;
    }

    try {
      const data = await addDepartment(newDepartmentName);
      console.log('Department added:', data);
      setNewDepartmentName('');
      fetchDepartments();  // Refresh the department list
    } catch (error) {
      console.error('Failed to add department:', error);
      setErrorMessage('Failed to add department. Please try again later.');
    }
  };

  // Edit department
  const handleEditDepartment = async () => {
    if (!newDepartmentName) {
      setErrorMessage('Department name cannot be empty.');
      return;
    }

    if (editDepartmentId) {
      try {
        const data = await editDepartment(editDepartmentId, newDepartmentName);
        console.log('Department updated:', data);
        setEditing(false);
        setNewDepartmentName('');
        setEditDepartmentId(null);
        fetchDepartments();  // Refresh the department list
      } catch (error) {
        console.error('Failed to edit department:', error);
        setErrorMessage('Failed to edit department. Please try again later.');
      }
    }
  };

  // Delete department
  const handleDeleteDepartment = async (id) => {
    try {
      const data = await deleteDepartment(id);
      console.log('Department deleted:', data);
      fetchDepartments();  // Refresh the department list
    } catch (error) {
      console.error('Failed to delete department:', error);
      setErrorMessage('Failed to delete department. Please try again later.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Departments</h1>

      {/* Add input and button at the top */}
      <div className="flex flex-col space-y-4 mb-6">
        <input
          type="text"
          value={newDepartmentName}
          onChange={(e) => {
            setNewDepartmentName(e.target.value);
            setErrorMessage(''); // Clear error message when user starts typing
          }}
          placeholder="Enter department name"
          className="p-4 text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={editing ? handleEditDepartment : handleAddDepartment}
          disabled={!newDepartmentName}
          className="w-full text-xl bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none disabled:bg-gray-400"
        >
          {editing ? 'Update Department' : 'Add Department'}
        </button>
      </div>

      {/* Display error message */}
      {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

      {/* Display list of departments with a bigger font and list size */}
      <ul className="space-y-6 bg-gray-50 p-6 rounded-lg shadow-md">
        {departments.map((department) => (
          <li
            key={department.id}
            className="flex justify-between items-center p-6 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition duration-300 text-xl"
          >
            <div className="flex justify-between w-full">
              <span className="text-lg font-medium text-gray-800">{department.name}</span>
              <div className="space-x-3">
                <button
                  onClick={() => {
                    setEditing(true);
                    setNewDepartmentName(department.name);
                    setEditDepartmentId(department.id);
                  }}
                  className="px-6 py-3 text-lg text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteDepartment(department.id)}
                  className="px-6 py-3 text-lg text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DepartmentComponent;
