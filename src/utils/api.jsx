import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000/',  // Backend API base URL
  timeout: 5000,  // Optional timeout for requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include user_id and role_id in the payload
api.interceptors.request.use(
  (config) => {
    const user_id = localStorage.getItem('user_id');
    const role_id = localStorage.getItem('role_id');

    console.log('Intercepted Request Payload before adding User-Id and Role-Id:');
    console.log(config.data);

    if (user_id) {
      config.data = config.data || {};
      config.data['id'] = user_id;
    } else {
      console.warn('User-Id is not found in localStorage!');
    }

    if (role_id) {
      config.data = config.data || {};
      config.data['role_id'] = role_id;
    } else {
      console.warn('Role-Id is not found in localStorage!');
    }

    console.log('Updated Request Payload:');
    console.log(config.data);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized access. Please login again.');
    } else if (error.response && error.response.status === 403) {
      console.error('Permission denied: Admins only.');
    }
    return Promise.reject(error);
  }
);

// Department APIs
export const fetchAllDepartments = async (userId, roleId) => { 
  try {
    const response = await axios.get('http://localhost:3000/departments', {
      headers: {
        'User-Id': userId,
        'Role-Id': roleId,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

export const addDepartment = async (name) => {
  try {
    const response = await api.post('/departments', { name });
    return response.data;
  } catch (error) {
    console.error('Error adding department:', error);
    throw error;
  }
};

export const editDepartment = async (id, name) => {
  try {
    const response = await api.put(`/departments/${id}`, { name });
    return response.data;
  } catch (error) {
    console.error('Error editing department:', error);
    throw error;
  }
};

export const deleteDepartment = async (id) => {
  try {
    const response = await api.delete(`/departments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting department:', error);
    throw error;
  }
};

// User APIs
export const addUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error adding user';
  }
};

export const editUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error editing user';
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error deleting user';
  }
};

export const fetchAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data.users;
  } catch (error) {
    throw error.response?.data || 'Error fetching users';
  }
};

export const fetchUserByName = async (name) => {
  try {
    const response = await api.get(`/users/name/${name}`);
    return response.data.users;
  } catch (error) {
    throw error.response?.data || 'Error fetching user by name';
  }
};

export const updateUserFeedbackScore = async (id, feedbackScore) => {
  try {
    const response = await api.put(`/users/edit-feedback/${id}`, { fb: feedbackScore });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error updating feedback score';
  }
};

export default api;