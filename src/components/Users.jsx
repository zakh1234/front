import React, { useState, useEffect } from "react";
import axios from "axios";
import { addDepartment, editDepartment, deleteDepartment, fetchAllDepartments } from '../utils/api'; // API functions

const FetchUsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false); // State to show/hide the Add User form
  const [isEditing, setIsEditing] = useState(false); // Track if we're editing a user
  const [currentUserId, setCurrentUserId] = useState(null); // Track the ID of the user being edited
  const userId = localStorage.getItem("user_id");
  const roleId = localStorage.getItem("role_id");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    degree: "PhD",  // Default to PhD
    title: "p",     // Default to "p" (Professor)
    username: "",
    password: "",
    department_id: "",
    role_id: 2,     // Default role as Staff
    gender: "Male", // Default to Male
  });

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

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  // Handle adding or editing a user
  const handleAddUser = async () => {
    try {
      const url = isEditing
        ? `http://localhost:3000/users/${currentUserId}` // PUT for editing an existing user
        : "http://localhost:3000/users"; // POST for adding a new user

      const method = isEditing ? "PUT" : "POST"; // Use PUT for editing, POST for adding

      const response = await axios({
        method,
        url,
        data: newUser,
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          id: userId,
          role_id: roleId,
        },
      });

      if (response.status === (isEditing ? 200 : 201)) {
        alert(isEditing ? "User updated successfully" : "User added successfully");
        if (isEditing) {
          // Update the user list after editing
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === currentUserId ? { ...user, ...newUser } : user
            )
          );
        } else {
          // Add the new user to the list
          setUsers((prevUsers) => [...prevUsers, response.data]);
        }
        setShowAddUserForm(false);
        setIsEditing(false); // Reset the editing state
        setCurrentUserId(null); // Reset the current user ID
      } else {
        throw new Error(isEditing ? "Failed to update user" : "Failed to add user");
      }
    } catch (err) {
      console.error("Error in handleAddUser:", err);
      setError(err.message || "An error occurred while adding/editing the user");
    }
  };

  // Handle editing a user
  const handleEditUser = (userId) => {
    const userToEdit = users.find((user) => user.id === userId);
    setNewUser(userToEdit); // Populate the form with the user's data
    setIsEditing(true); // Set the editing state to true
    setCurrentUserId(userId); // Set the ID of the user being edited
    setShowAddUserForm(true); // Show the form when editing
  };

  // Handle deleting a user
  const handleDeleteUser = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/users/${id}`);

      if (response.status === 200) {
        alert("User deleted successfully");
        setUsers(users.filter(user => user.id !== id)); // Remove the deleted user from the state
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (err) {
      console.error("Error in deleteUser:", err);
      setError(err.message || "An error occurred while deleting the user");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto mt-5">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      {/* Add User Button */}
<button
  className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
  onClick={() => {
    if (showAddUserForm) {
      setShowAddUserForm(false);
      window.location.reload(); // Reloads the page when Cancel is clicked
    } else {
      setShowAddUserForm(true);
    }
  }}
>
  {showAddUserForm ? "Cancel" : "Add User"}
</button>


      {/* Add User Form */}
      {showAddUserForm && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h2 className="text-xl font-semibold text-black">Add New User</h2>
          <form>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newUser.name}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newUser.email}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <select
                  name="degree"
                  value={newUser.degree}
                  onChange={handleChange}
                  className="border p-2 rounded"
                >
                  <option value="PhD">PhD</option>
                  <option value="Master">Master</option>
                  <option value="M.A.">M.A.</option>
                </select>

              <select
                    name="title"
                    value={newUser.title}
                    onChange={handleChange}
                    className="border p-2 rounded"
                  >
                    <option value="p">Professor</option>
                    <option value="ap">Assistant Professor</option>
                    <option value="l">Lecturer</option>
                    <option value="al">Assistant Lecturer</option>
                  </select>

              <input
                type="text"
                name="username"
                placeholder="Username"
                value={newUser.username}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={newUser.password}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <select
                name="department_id"
                value={newUser.department_id}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="" disabled>Select Department</option>
                {departments.length > 0 ? (
                  departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name} {/* Replace name with the correct field from your department */}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Loading departments...</option>
                )}
              </select>
              <select
                name="role_id"
                value={newUser.role_id}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value={1}>Admin</option>
                <option value={2}>Staff</option>
              </select>
              <select
                name="gender"
                value={newUser.gender}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <button
              type="button"
              className="bg-green-500 text-white px-4 py-2 rounded mt-4"
              onClick={handleAddUser}
            >
              Add User
            </button>
          </form>
        </div>
      )}

      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-200">
          <th className="border border-gray-300 px-4 py-2" style={{ backgroundColor: '#c18c2d' }}>Name</th>
            <th className="border border-gray-300 px-4 py-2"style={{ backgroundColor: '#c18c2d' }}>Degree</th>
            <th className="border border-gray-300 px-4 py-2"style={{ backgroundColor: '#c18c2d' }}>Title</th>
            <th className="border border-gray-300 px-4 py-2"style={{ backgroundColor: '#c18c2d' }}>Department</th>
            <th className="border border-gray-300 px-4 py-2"style={{ backgroundColor: '#c18c2d' }}>Email</th>
            <th className="border border-gray-300 px-4 py-2"style={{ backgroundColor: '#c18c2d' }}>Gender</th>
            <th className="border border-gray-300 px-4 py-2"style={{ backgroundColor: '#c18c2d' }}>UserName</th>
            <th className="border border-gray-300 px-4 py-2"style={{ backgroundColor: '#c18c2d' }}>Password</th>
            <th className="border border-gray-300 px-4 py-2"style={{ backgroundColor: '#c18c2d' }}>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center">
            <td className="border border-gray-300 px-4 py-2">{user.name}</td>
            <td className="border border-gray-300 px-4 py-2">{user.degree}</td>
            <td className="border border-gray-300 px-4 py-2">
              {user.title === 'p' ? 'Professor' :
              user.title === 'ap' ? 'Assistant Professor' :
              user.title === 'l' ? 'Lecturer' :
              user.title === 'al' ? 'Assistant Lecturer' : 'Unknown'}
            </td>
            <td className="border border-gray-300 px-4 py-2">{user.department_id}</td>
            <td className="border border-gray-300 px-4 py-2">{user.email}</td>
            <td className="border border-gray-300 px-4 py-2">{user.gender}</td>
            <td className="border border-gray-300 px-4 py-2">{user.username}</td>
            <td className="border border-gray-300 px-4 py-2">{user.password}</td>
            <td className="border border-gray-300 px-4 py-2">
              {user.role_id === 1 ? "Admin" : user.role_id === 2 ? "Staff" : "Unknown"}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {user.role_id !== 1 && (
                <>
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => handleEditUser(user.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </td>
          </tr>
          
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FetchUsersTable;