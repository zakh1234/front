import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActivityComponent = () => {
  const [activities, setActivities] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false); // To toggle form visibility
  const [newActivity, setNewActivity] = useState({
    name: '',
    description: '',
    score: '',
    type: 'Compulsory', // Default value set to 'Compulsory'
  });

  const fetchActivities = async () => {
    try {
      const response = await axios.get('http://localhost:3000/activities');
      console.log(response.data);  // Add this to inspect the response structure
      setActivities(response.data.activities || []);
    } catch (err) {
      setError('Error fetching activities');
    } finally {
      setLoading(false);
    }
  };

  // Fetch activities on component mount
  useEffect(() => {
    fetchActivities();
  }, []); // Empty dependency array means it runs once when component mounts

  // Show loading state while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error if there was an issue with the API request
  if (error) {
    return <div>{error}</div>;
  }

  // Handle the visibility of the add activity form
  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  // Handle input changes for the new activity
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewActivity((prevActivity) => ({
      ...prevActivity,
      [name]: value,
    }));
  };

  // Handle activity form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make an API request to add the new activity
      const response = await axios.post('http://localhost:3000/activities', newActivity);
      // Add the new activity to the activities list
      setActivities((prevActivities) => [...prevActivities, response.data.activity]);
      // Reset the form fields
      setNewActivity({ name: '', description: '', score: '', type: 'Compulsory' });
      // Close the form
      setIsFormVisible(false);
    } catch (err) {
      setError('Error adding activity');
    }
  };

  // Handle delete activity
  const deleteActivity = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/activities/${id}`);
      console.log(response.data.message); // Log response message
      // Remove the deleted activity from the state
      setActivities(activities.filter((activity) => activity.id !== id));
    } catch (err) {
      setError('Error deleting activity');
    }
  };

  return (
    <div>
      <h2>Activity List</h2>

      {/* Add Activity Button */}
      <button onClick={toggleForm} className="btn btn-primary">
        {isFormVisible ? 'Cancel' : 'Add Activity'}
      </button>

      {/* Activity Form */}
      {isFormVisible && (
        <form onSubmit={handleFormSubmit} className="space-y-4 p-6 border rounded-lg shadow-lg max-w-lg mx-auto bg-white">
          <h2 className="text-2xl font-semibold text-center">Add New Activity</h2>

          {/* Name Input */}
          <div className="flex flex-col">
            <label htmlFor="name" className="font-medium text-lg mb-2">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newActivity.name}
              onChange={handleInputChange}
              required
              className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description Input */}
          <div className="flex flex-col">
            <label htmlFor="description" className="font-medium text-lg mb-2">Description:</label>
            <textarea
              id="description"
              name="description"
              value={newActivity.description}
              onChange={handleInputChange}
              required
              className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Score Input */}
          <div className="flex flex-col">
            <label htmlFor="score" className="font-medium text-lg mb-2">Score:</label>
            <input
              type="number"
              id="score"
              name="score"
              value={newActivity.score}
              onChange={handleInputChange}
              required
              className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type Select */}
          <div className="flex flex-col">
            <label htmlFor="type" className="font-medium text-lg mb-2">Type:</label>
            <select
              id="type"
              name="type"
              value={newActivity.type}
              onChange={handleInputChange}
              required
              className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Compulsory">Compulsory</option>
              <option value="Attending">Attending</option>
              <option value="Elective">Elective</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md font-semibold hover:bg-blue-600 transition duration-300"
          >
            Add Activity
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={toggleForm}
            className="w-full mt-2 bg-gray-300 text-black p-3 rounded-md font-semibold hover:bg-gray-400 transition duration-300"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Displaying activities */}
      {Array.isArray(activities) && activities.length > 0 ? (
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2" style={{ backgroundColor: '#c18c2d' }}>Name</th>
              <th className="border border-gray-300 px-4 py-2" style={{ backgroundColor: '#c18c2d' }}>Description</th>
              <th className="border border-gray-300 px-4 py-2" style={{ backgroundColor: '#c18c2d' }}>Score</th>
              <th className="border border-gray-300 px-4 py-2" style={{ backgroundColor: '#c18c2d' }}>Type</th>
              <th className="border border-gray-300 px-4 py-2" style={{ backgroundColor: '#c18c2d' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity?.id}>
                <td className="border border-gray-300 px-4 py-2">{activity?.name}</td>
                <td className="border border-gray-300 px-4 py-2">{activity?.description}</td>
                <td className="border border-gray-300 px-4 py-2">{activity?.score}</td>
                <td className="border border-gray-300 px-4 py-2">{activity?.type}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => deleteActivity(activity.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No activities available</p>
      )}
    </div>
  );
};

export default ActivityComponent;
