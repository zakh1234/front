import React, { useState, useEffect } from 'react';

const PostedActivities = () => {
  const [activities, setActivities] = useState([]);
  const [availableActivities, setAvailableActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    activity_name: '',
    starting_date: '',
    link: '',
    submitid_at: ''
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
    try {
      const response = await fetch('http://localhost:3000/posted-activities');
      const data = await response.json();
      setActivities(data.postedActivities);
    } catch (err) {
      setError('Failed to fetch posted activities');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

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
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save activity');

      setSuccess(editingId ? 'Activity updated successfully' : 'Activity posted successfully');
      setFormData({
        activity_name: '',
        starting_date: '',
        link: '',
        submitid_at: ''
      });
      setEditingId(null);
      fetchPostedActivities();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/posted-activities/${id}`, {
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
      submitid_at: activity.submitid_at
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md mb-6 p-4">
        <h2 className="text-xl font-bold mb-4">
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

          <div>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Submit ID"
              value={formData.submitid_at}
              onChange={(e) => setFormData({ ...formData, submitid_at: e.target.value })}
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
                    submitid_at: ''
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

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Your Posted Activities</h2>
        </div>
        
        <div className="p-4">
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
                        Date: {new Date(activity.starting_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Submit ID: {activity.submitid_at}
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
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
                        onClick={() => handleEdit(activity)}
                      >
                        Edit
                      </button>
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

export default PostedActivities;