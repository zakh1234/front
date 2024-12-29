import React, { useState, useEffect } from 'react';

const YourActivity = () => {
  const [activities, setActivities] = useState([]);
  const [availableActivities, setAvailableActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    activity_name: '',
    starting_date: '',
    link: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAvailableActivities();
    fetchPostedActivities();
  }, []);

  const fetchAvailableActivities = async () => {
    try {
      const response = await fetch('http://localhost:3000/posted-activities/available');
      const data = await response.json();
      setAvailableActivities(data.availableActivities);
    } catch (err) {
      setError('Failed to fetch available activities');
    }
  };

  const fetchPostedActivities = async () => {
    setLoading(true);
    const user_id = localStorage.getItem('user_id');
    
    try {
      const response = await fetch(`http://localhost:3000/posted-activities?user_id=${user_id}`);
      const data = await response.json();
      setActivities(data.postedActivities);
    } catch (err) {
      setError('Failed to fetch posted activities');
    } finally {
      setLoading(false);
    }
};

// Add this function to fetch user data
const fetchUserById = async (userId) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:3000/users/id/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const data = await response.json();
      setUserData(data.user);
    } catch (err) {
      setError('Error fetching user data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('user_id'); // Or get ID from props/params
    if (userId) {
      fetchUserById(userId);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Get user_id from localStorage
    const user_id = localStorage.getItem('user_id');
    
    // Add user_id to the form data
    const submitData = {
        ...formData,
        user_id: user_id
    };

    try {
        const url = editingId 
            ? `http://localhost:3000/posted-activities/${editingId}`
            : 'http://localhost:3000/posted-activities';
        
        const method = editingId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submitData),
        });

        if (!response.ok) throw new Error('Failed to save activity');

        setSuccess(editingId ? 'Activity updated successfully' : 'Activity posted successfully');
        setFormData({
            activity_name: '',
            starting_date: '',
            link: '',
        });
        setEditingId(null);
        fetchPostedActivities();
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

  // Frontend handleDelete
const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;

    setLoading(true);
    const user_id = localStorage.getItem('user_id');

    try {
      const response = await fetch(`http://localhost:3000/posted-activities/${id}?user_id=${user_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete activity');

      setSuccess('Activity deleted successfully');
      fetchPostedActivities();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
};

  const handleEdit = (activity) => {
    setEditingId(activity.id);
    setFormData({
      activity_name: activity.activity_name,
      starting_date: activity.starting_date.split('T')[0],
      link: activity.link,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 overflow-auto">
      <div className="bg-white rounded-lg shadow-md mb-6 p-4">
        <h2 className="text-xl font-bold mb-4 text-black">
          {editingId ? 'Edit Activity' : 'Post New Activity'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <select
              className="w-full p-2 border rounded"
              value={formData.activity_name}
              onChange={(e) => setFormData({ ...formData, activity_name: e.target.value })}
              required
            >
              <option value="">Select an activity</option>
              {availableActivities.map((activity) => (
                <option key={activity.id} value={activity.name}>
                  {activity.name} ({activity.type} - {activity.score} points)
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={formData.starting_date}
              onChange={(e) => setFormData({ ...formData, starting_date: e.target.value })}
              required
            />
          </div>

          <div>
            <input
              type="url"
              className="w-full p-2 border rounded"
              placeholder="Activity Link"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              required
            />
          </div>

        

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Loading...' : (editingId ? 'Update Activity' : 'Post Activity')}
            </button>

            {editingId && (
              <button
                type="button"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    activity_name: '',
                    starting_date: '',
                    link: '',
                  });
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

{userData && (
  <div className="bg-white rounded-lg shadow-md p-4 mb-4">
    <h2 className="text-xl font-bold mb-4 text-black">Your Scores</h2>
    <div className="flex flex-wrap gap-4">
      {(() => {
        let calculatedGrade = '';
        let gradeBackground = '';
        
        if (userData.title === 'al') {
          if (userData.total_score >= 0 && userData.total_score <= 5) {
            calculatedGrade = 'E';
            gradeBackground = 'bg-red-500';
          } else if (userData.total_score >= 6 && userData.total_score <= 11) {
            calculatedGrade = 'D';
            gradeBackground = 'bg-gradient-to-r from-red-500 to-yellow-500';
          } else if (userData.total_score >= 12 && userData.total_score <= 17) {
            calculatedGrade = 'C';
            gradeBackground = 'bg-gradient-to-r from-yellow-500 to-green-500';
          } else if (userData.total_score >= 18 && userData.total_score <= 24) {
            calculatedGrade = 'B';
            gradeBackground = 'bg-gradient-to-r from-green-500 to-blue-500';
          } else if (userData.total_score >= 25 && userData.total_score <= 44) {
            calculatedGrade = 'A';
            gradeBackground = 'bg-gradient-to-r from-blue-500 to-indigo-500';
          } else if (userData.total_score >= 45) {
            calculatedGrade = 'A+';
            gradeBackground = 'bg-green-500';
          }
        } else if (userData.title === 'l') {
          if (userData.total_score >= 0 && userData.total_score <= 5) {
            calculatedGrade = 'E';
            gradeBackground = 'bg-red-500';
          } else if (userData.total_score >= 6 && userData.total_score <= 14) {
            calculatedGrade = 'D';
            gradeBackground = 'bg-gradient-to-r from-red-500 to-yellow-500';
          } else if (userData.total_score >= 15 && userData.total_score <= 23) {
            calculatedGrade = 'C';
            gradeBackground = 'bg-gradient-to-r from-yellow-500 to-green-500';
          } else if (userData.total_score >= 24 && userData.total_score <= 34) {
            calculatedGrade = 'B';
            gradeBackground = 'bg-gradient-to-r from-green-500 to-blue-500';
          } else if (userData.total_score >= 35 && userData.total_score <= 54) {
            calculatedGrade = 'A';
            gradeBackground = 'bg-gradient-to-r from-blue-500 to-indigo-500';
          } else if (userData.total_score >= 55) {
            calculatedGrade = 'A+';
            gradeBackground = 'bg-green-500';
          }
        } else if (userData.title === 'ap') {
          if (userData.total_score >= 0 && userData.total_score <= 5) {
            calculatedGrade = 'E';
            gradeBackground = 'bg-red-500';
          } else if (userData.total_score >= 6 && userData.total_score <= 19) {
            calculatedGrade = 'D';
            gradeBackground = 'bg-gradient-to-r from-red-500 to-yellow-500';
          } else if (userData.total_score >= 20 && userData.total_score <= 34) {
            calculatedGrade = 'C';
            gradeBackground = 'bg-gradient-to-r from-yellow-500 to-green-500';
          } else if (userData.total_score >= 35 && userData.total_score <= 49) {
            calculatedGrade = 'B';
            gradeBackground = 'bg-gradient-to-r from-green-500 to-blue-500';
          } else if (userData.total_score >= 50 && userData.total_score <= 69) {
            calculatedGrade = 'A';
            gradeBackground = 'bg-gradient-to-r from-blue-500 to-indigo-500';
          } else if (userData.total_score >= 70) {
            calculatedGrade = 'A+';
            gradeBackground = 'bg-green-500';
          }
        } else if (userData.title === 'p') {
          if (userData.total_score >= 0 && userData.total_score <= 5) {
            calculatedGrade = 'E';
            gradeBackground = 'bg-red-500';
          } else if (userData.total_score >= 6 && userData.total_score <= 19) {
            calculatedGrade = 'D';
            gradeBackground = 'bg-gradient-to-r from-red-500 to-yellow-500';
          } else if (userData.total_score >= 20 && userData.total_score <= 44) {
            calculatedGrade = 'C';
            gradeBackground = 'bg-gradient-to-r from-yellow-500 to-green-500';
          } else if (userData.total_score >= 45 && userData.total_score <= 59) {
            calculatedGrade = 'B';
            gradeBackground = 'bg-gradient-to-r from-green-500 to-blue-500';
          } else if (userData.total_score >= 60 && userData.total_score <= 79) {
            calculatedGrade = 'A';
            gradeBackground = 'bg-gradient-to-r from-blue-500 to-indigo-500';
          } else if (userData.total_score >= 80) {
            calculatedGrade = 'A+';
            gradeBackground = 'bg-green-500';
          }
        }

        return (
          <>
            <div className="flex space-x-4">
              <div className="flex-1 min-w-[110px] bg-red-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-red-800">Total Score</p>
                <p className="text-xl font-bold text-red-600">{userData.total_score}</p>
              </div>
        
              <div className={`flex-1 min-w-[130px] ${gradeBackground} p-4 rounded-lg`}>
                <p className="text-sm font-semibold text-white">Current Grade</p>
                <p className="text-xl font-bold text-white">{calculatedGrade}</p>
              </div>
        
              <div className="flex-1 min-w-[110px] bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-blue-800">FB Score</p>
                <p className="text-xl font-bold text-blue-600">{userData.fb}</p>
              </div>
              
              <div className="flex-1 min-w-[110px] bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-green-800">E. Activity</p>
                <p className="text-xl font-bold text-green-600">{userData.escore}</p>
              </div>
              
              <div className="flex-1 min-w-[110px] bg-purple-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-purple-800">Att. Activity</p>
                <p className="text-xl font-bold text-purple-600">{userData.atts}</p>
              </div>
              
              <div className="flex-1 min-w-[130px] bg-orange-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-orange-800">Act. Activity</p>
                <p className="text-xl font-bold text-orange-600">{userData.acts}</p>
              </div>
            </div>
          </>
        );
        
      })()}
    </div>
  </div>
)}

<div className="bg-white rounded-lg shadow-md">
  <div className="p-4 border-b">
    <h2 className="text-xl font-bold text-black">Your Posted Activities</h2>
  </div>
  
  <div className="p-4 max-h-96 overflow-auto"> {/* Set a max height and make it scrollable */}
    {loading ? (
      <div className="text-center p-4">Loading...</div>
    ) : activities.length === 0 ? (
      <p className="text-center text-gray-500">No activities posted yet</p>
    ) : (
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="border rounded p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{activity.activity_name}</h3>
                <p className="text-sm text-gray-600">
                  Starting Date: {new Date(activity.starting_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Name: {availableActivities.find(a => a.id === activity.activity_id)?.name || "Unknown"}
                </p>
                <p className="text-sm text-gray-600">
                  Type: {availableActivities.find(a => a.id === activity.activity_id)?.type || "Unknown"}
                </p>
                <p className="text-sm text-gray-600">
                  Score: {availableActivities.find(a => a.id === activity.activity_id)?.score || "Unknown"}
                </p>
                <p className="text-sm text-gray-600">
                  Description: {availableActivities.find(a => a.id === activity.activity_id)?.description || "Unknown"}
                </p>

                <a 
                  href={activity.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  View Activity
                </a>
              </div>
              <div className="space-x-2">
                <button
                  className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                  onClick={() => handleDelete(activity.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

    </div>
  );
};

export default YourActivity;



