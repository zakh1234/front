import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StaffActivityComponent = () => {
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

      
      

      {/* Displaying activities */}
      {Array.isArray(activities) && activities.length > 0 ? (
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2" style={{ backgroundColor: '#c18c2d' }}>Name</th>
              <th className="border border-gray-300 px-4 py-2" style={{ backgroundColor: '#c18c2d' }}>Description</th>
              <th className="border border-gray-300 px-4 py-2" style={{ backgroundColor: '#c18c2d' }}>Score</th>
              <th className="border border-gray-300 px-4 py-2" style={{ backgroundColor: '#c18c2d' }}>Type</th>
              
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity?.id}>
                <td className="border border-gray-300 px-4 py-2">{activity?.name}</td>
                <td className="border border-gray-300 px-4 py-2">{activity?.description}</td>
                <td className="border border-gray-300 px-4 py-2">{activity?.score}</td>
                <td className="border border-gray-300 px-4 py-2">{activity?.type}</td>
                
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

export default StaffActivityComponent;
