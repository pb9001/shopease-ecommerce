import { useEffect, useState } from "react";

import { useAuth } from "../../../context/AuthContext";

import "./AdminUsers.css";

function AdminUsers() {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // FETCH USERS FROM BACKEND
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/auth/users",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch users"
        );
      }

      setUsers(data.users || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // FETCH USERS WHEN ADMIN LOGS IN
  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  return (
    <div className="admin-users-page">
      <div className="admin-users-header">
        <div>
          <h1>Users</h1>

          <p>
            View registered ShopEase users
          </p>
        </div>
      </div>

      <div className="users-table-card">
        <div className="users-count">
          Total Users:{" "}
          <strong>
            {users.length}
          </strong>
        </div>

        {loading && (
          <p>
            Loading users...
          </p>
        )}

        {error && (
          <p className="admin-users-error">
            {error}
          </p>
        )}

        {!loading &&
          !error && (
            <div className="users-table-wrapper">
              <table className="admin-users-table">
                <thead>
                  <tr>
                    <th>ID</th>

                    <th>Name</th>

                    <th>Email</th>

                    <th>Role</th>

                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id}>
                        <td>
                          {user._id}
                        </td>

                        <td>
                          {user.name}
                        </td>

                        <td>
                          {user.email}
                        </td>

                        <td>
                          <span
                            className={`user-role ${user.role.toLowerCase()}`}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td>
                          <span className="user-status active">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </div>
  );
}

export default AdminUsers;