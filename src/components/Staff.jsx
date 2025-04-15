import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchAllDepartments } from '../utils/api'; // API functions

const FetchStaffTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editFeedback, setEditFeedback] = useState(null); // State to hold the feedback score being edited
  const [edittp, setEdittp] = useState(null); // State to hold the feedback score being edited
  const [selectedStaffActivities, setSelectedStaffActivities] = useState([]);
  const [showActivitiesModal, setShowActivitiesModal] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(null);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      const userId = localStorage.getItem("user_id");
      const roleId = localStorage.getItem("role_id");

      console.log("Data being sent for fetchUsers:", {
        id: userId,
        role_id: roleId,
      });

      try {
        const response = await axios.get("http://localhost:3000/users", {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            id: userId,
            role_id: roleId,
          },
        });

        console.log("Response received from fetchUsers:", response.data);

        if (response.status === 200) {
          setUsers(response.data.users);
        } else {
          throw new Error("Failed to fetch users");
        }
      } catch (err) {
        console.error("Error in fetchUsers:", err);
        setError(err.message || "An error occurred while fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch departments (assuming you're using the function `fetchAllDepartments` in utils/api)
  const [departments, setDepartments] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await fetchAllDepartments();
      setDepartments(data.departments); // Assuming response contains { departments: [...] }
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      setErrorMessage("Failed to load departments. Please try again later.");
    }
  };

  const fetchStaffActivities = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/posted-activities?user_id=${userId}`);
      setSelectedStaffActivities(response.data.postedActivities);
      setSelectedStaffId(userId);
      setShowActivitiesModal(true);
    } catch (error) {
      console.error("Error fetching staff activities:", error);
      alert('Failed to fetch staff activities');
    }
  };

  // Handle feedback score change
  const handleFeedbackChange = (e, userId) => {
    const updatedUsers = [...users];
    const index = updatedUsers.findIndex(user => user.id === userId);
    if (index !== -1) {
      updatedUsers[index].fb = parseFloat(e.target.value);
      setUsers(updatedUsers);
    }
  };

  const handletpChange = (e, userId) => {
    const updatedUsers = [...users];
    const index = updatedUsers.findIndex(user => user.id === userId);
    if (index !== -1) {
      updatedUsers[index].tp = parseFloat(e.target.value);
      setUsers(updatedUsers);
    }
  };

  const handleSaveFeedback = async (userId) => {
    try {
      const userToUpdate = users.find(user => user.id === userId);
      
      // Make sure the feedback score is valid before sending the request
      if (userToUpdate.fb !== null && userToUpdate.fb >= 0) {
        const response = await axios.put(`http://localhost:3000/users/edit-feedback/${userId}`, {
          fb: userToUpdate.fb,
        });
  
        if (response.status === 200) {
          setEditFeedback(null); // Hide the edit input after saving
          alert('Feedback score updated successfully!');
        }
      } else {
        alert('Please enter a valid feedback score');
      }
    } catch (error) {
      console.error("Error saving feedback:", error);
      alert('An error occurred while updating the feedback score');
    }
  };


  const handleSavetp = async (userId) => {
    try {
      const userToUpdate = users.find(user => user.id === userId);
      
      // Make sure the feedback score is valid before sending the request
      if (userToUpdate.tp !== null && userToUpdate.tp >= 0) {
        const response = await axios.put(`http://localhost:3000/users/edit-tp/${userId}`, {
          tp: userToUpdate.tp,
        });
  
        if (response.status === 200) {
          setEdittp(null); // Hide the edit input after saving
          alert('tp score updated successfully!');
        }
      } else {
        alert('Please enter a valid tp score');
      }
    } catch (error) {
      console.error("Error saving tp:", error);
      alert('An error occurred while updating the tp score');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


  // Add this modal component
const ActivitiesModal = ({ activities, onClose, staffName }) => {
    if (!showActivitiesModal) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-3/4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Activities for {staffName}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
  
          {activities.length === 0 ? (
            <p className="text-gray-500">No activities found for this staff member.</p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="border rounded p-4 bg-gray-50">
                  <h3 className="font-semibold">{activity.activity_name}</h3>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(activity.starting_date).toLocaleDateString()} -
                    Activity ID: {activity.activity_id} -
                    ID: {activity.id}
                  </p>
                  {activity.link && (
                    <a 
                      href={activity.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline text-sm"
                    >
                      View Activity Link
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto mt-5">
      <h1 className="text-2xl font-bold mb-4">Staff</h1>

      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2" style={{ backgroundColor: '#c18c2d' }}>Name</th>
            <th className="border border-gray-300 px-4 py-2" style={{ backgroundColor: '#c18c2d' }}>Degree</th>
            <th className="border border-gray-300 px-4 py-2" style={{ backgroundColor: '#c18c2d' }}>Title</th>
            <th className="border border-gray-300 px-4 py-2" style={{ backgroundColor: '#c18c2d' }}>Department</th>
            <th className="border border-gray-300 px-4 py-2" style={{ backgroundColor: '#c18c2d' }}>Email</th>
            <th className="border border-gray-300 px-4 py-2" style={{ backgroundColor: '#c18c2d' }}>T P.</th>
            <th className="border border-gray-300 px-4 py-2" style={{ backgroundColor: '#c18c2d' }}>F B.</th>
            <th className="border border-gray-300 px-4 py-2" style={{ backgroundColor: '#c18c2d' }}>ATT S.</th>
            <th className="border border-gray-300 px-4 py-2" style={{ backgroundColor: '#c18c2d' }}>ACT S.</th>
            <th className="border border-gray-300 px-4 py-2" style={{ backgroundColor: '#c18c2d' }}>E S.</th>
            <th className="border border-gray-300 px-4 py-2" style={{ backgroundColor: '#c18c2d' }}>Grade</th>
            <th className="border border-gray-300 px-4 py-2" style={{ backgroundColor: '#c18c2d' }}>Activities</th>
          </tr>
        </thead>
        <tbody>
  {users
    .filter(user => user.role_id === 2) // Filter to show only staff users
    .map((user) => {
      let calculatedGrade = '';
      let gradeBackground = '';

      // Calculate grade based on total_score and title
      if (user.title === 'al') {
        if (user.total_score >= 0 && user.total_score <= 5) {
          calculatedGrade = 'E';
          gradeBackground = 'bg-red-500'; // Red for grade E
        } else if (user.total_score >= 6 && user.total_score <= 11) {
          calculatedGrade = 'D';
          gradeBackground = 'bg-gradient-to-r from-red-500 to-yellow-500'; // Gradient for grade D
        } else if (user.total_score >= 12 && user.total_score <= 17) {
          calculatedGrade = 'C';
          gradeBackground = 'bg-gradient-to-r from-yellow-500 to-green-500'; // Gradient for grade C
        } else if (user.total_score >= 18 && user.total_score <= 24) {
          calculatedGrade = 'B';
          gradeBackground = 'bg-gradient-to-r from-green-500 to-blue-500'; // Gradient for grade B
        } else if (user.total_score >= 25 && user.total_score <= 44) {
          calculatedGrade = 'A';
          gradeBackground = 'bg-gradient-to-r from-blue-500 to-indigo-500'; // Gradient for grade A
        } else if (user.total_score >= 45) {
          calculatedGrade = 'A+';
          gradeBackground = 'bg-green-500'; // Green for grade A+
        }
      } else if (user.title === 'l') {
        if (user.total_score >= 0 && user.total_score <= 5) {
          calculatedGrade = 'E';
          gradeBackground = 'bg-red-500';
        } else if (user.total_score >= 6 && user.total_score <= 14) {
          calculatedGrade = 'D';
          gradeBackground = 'bg-gradient-to-r from-red-500 to-yellow-500';
        } else if (user.total_score >= 15 && user.total_score <= 23) {
          calculatedGrade = 'C';
          gradeBackground = 'bg-gradient-to-r from-yellow-500 to-green-500';
        } else if (user.total_score >= 24 && user.total_score <= 34) {
          calculatedGrade = 'B';
          gradeBackground = 'bg-gradient-to-r from-green-500 to-blue-500';
        } else if (user.total_score >= 35 && user.total_score <= 54) {
          calculatedGrade = 'A';
          gradeBackground = 'bg-gradient-to-r from-blue-500 to-indigo-500';
        } else if (user.total_score >= 55) {
          calculatedGrade = 'A+';
          gradeBackground = 'bg-green-500';
        }
      } else if (user.title === 'ap') {
        if (user.total_score >= 0 && user.total_score <= 5) {
          calculatedGrade = 'E';
          gradeBackground = 'bg-red-500';
        } else if (user.total_score >= 6 && user.total_score <= 19) {
          calculatedGrade = 'D';
          gradeBackground = 'bg-gradient-to-r from-red-500 to-yellow-500';
        } else if (user.total_score >= 20 && user.total_score <= 34) {
          calculatedGrade = 'C';
          gradeBackground = 'bg-gradient-to-r from-yellow-500 to-green-500';
        } else if (user.total_score >= 35 && user.total_score <= 49) {
          calculatedGrade = 'B';
          gradeBackground = 'bg-gradient-to-r from-green-500 to-blue-500';
        } else if (user.total_score >= 50 && user.total_score <= 69) {
          calculatedGrade = 'A';
          gradeBackground = 'bg-gradient-to-r from-blue-500 to-indigo-500';
        } else if (user.total_score >= 70) {
          calculatedGrade = 'A+';
          gradeBackground = 'bg-green-500';
        }
      } else if (user.title === 'p') {
        if (user.total_score >= 0 && user.total_score <= 5) {
          calculatedGrade = 'E';
          gradeBackground = 'bg-red-500';
        } else if (user.total_score >= 6 && user.total_score <= 19) {
          calculatedGrade = 'D';
          gradeBackground = 'bg-gradient-to-r from-red-500 to-yellow-500';
        } else if (user.total_score >= 20 && user.total_score <= 44) {
          calculatedGrade = 'C';
          gradeBackground = 'bg-gradient-to-r from-yellow-500 to-green-500';
        } else if (user.total_score >= 45 && user.total_score <= 59) {
          calculatedGrade = 'B';
          gradeBackground = 'bg-gradient-to-r from-green-500 to-blue-500';
        } else if (user.total_score >= 60 && user.total_score <= 79) {
          calculatedGrade = 'A';
          gradeBackground = 'bg-gradient-to-r from-blue-500 to-indigo-500';
        } else if (user.total_score >= 80) {
          calculatedGrade = 'A+';
          gradeBackground = 'bg-green-500';
        }
      }

      return (
        <tr key={user.id} className="text-center">
          <td className="border border-gray-300 px-4 py-2">{user.name}</td>
          <td className="border border-gray-300 px-4 py-2">{user.degree}</td>
          <td className="border border-gray-300 px-4 py-2">
            {user.title === 'p' ? 'Professor' :
              user.title === 'ap' ? 'Assistant Professor' :
              user.title === 'l' ? 'Lecturer' :
              user.title === 'al' ? 'Assistant Lecturer' : 'Unknown'}
          </td>
          <td className="border border-gray-300 px-4 py-2">
            {departments.find(department => department.id === user.department_id)?.name || "Unknown Department"}
          </td>
          <td className="border border-gray-300 px-4 py-2">{user.email}</td>
          <td className="border border-gray-300 px-4 py-2">
            {edittp === user.id ? (
              <input
                type="number"
                step="0.1"
                min="0"
                value={user.tp}
                onChange={(e) => handletpChange(e, user.id)}
                className="border border-gray-300 px-2 py-1"
              />
            ) : (
              user.tp
            )}
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
              onClick={() => setEdittp(user.id)}
            >
              {editFeedback === user.id ? "Cancel" : "Edit Teacher Points"}
            </button>
            {edittp === user.id && (
              <button
                className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                onClick={() => handleSavetp(user.id)}
              >
                Save
              </button>
            )}
          </td>
          <td className="border border-gray-300 px-4 py-2">
            {editFeedback === user.id ? (
              <input
                type="number"
                step="0.1"
                min="0"
                value={user.fb}
                onChange={(e) => handleFeedbackChange(e, user.id)}
                className="border border-gray-300 px-2 py-1"
              />
            ) : (
              user.fb
            )}
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
              onClick={() => setEditFeedback(user.id)}
            >
              {editFeedback === user.id ? "Cancel" : "Edit Feedback"}
            </button>
            {editFeedback === user.id && (
              <button
                className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                onClick={() => handleSaveFeedback(user.id)}
              >
                Save
              </button>
            )}
          </td>
          <td className="border border-gray-300 px-4 py-2">{user.atts}</td>
          <td className="border border-gray-300 px-4 py-2">{user.acts}</td>
          <td className="border border-gray-300 px-4 py-2">{user.escore}</td>
          <td className={`border border-gray-300 px-4 py-2 ${gradeBackground}`}>{calculatedGrade}</td> {/* Apply dynamic background */}
          <td className="border border-gray-300 px-4 py-2">
    <button
      onClick={() => fetchStaffActivities(user.id)}
      className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded"
    >
      View Activities
    </button>
  </td>
        </tr>



      );
    })}
</tbody>

      </table>



  
    <ActivitiesModal
      activities={selectedStaffActivities}
      onClose={() => {
        setShowActivitiesModal(false);
        setSelectedStaffActivities([]);
        setSelectedStaffId(null);
      }}
      staffName={users.find(u => u.id === selectedStaffId)?.name || 'Staff Member'}
    />
  



    </div>
    
  );
};

export default FetchStaffTable;