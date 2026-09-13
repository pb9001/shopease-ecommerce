import { useEffect, useState } from "react";

import "./AdminReturns.css";

function AdminReturns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReturns = async () => {
    try {
      const token = localStorage.getItem("shopease_token");

      const response = await fetch(
        "http://localhost:5000/api/returns",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch returns");
      }

      setReturns(data.returns);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const updateReturnStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("shopease_token");

      const response = await fetch(
        `http://localhost:5000/api/returns/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
            adminNote:
              status === "Approved"
                ? "Return approved by admin"
                : "Return rejected by admin",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update return status"
        );
      }

      setReturns((currentReturns) =>
        currentReturns.map((item) =>
          item._id === id
            ? data.returnRequest
            : item
        )
      );
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="admin-returns-page">
        <h2>Loading return requests...</h2>
      </div>
    );
  }

  return (
    <div className="admin-returns-page">
      <div className="admin-returns-header">
        <div>
          <h1>Returns</h1>
          <p>Review and manage customer return requests</p>
        </div>
      </div>

      {error && (
        <div className="returns-error">
          {error}
        </div>
      )}

      <div className="returns-table-card">
        <div className="returns-count">
          Total Requests: <strong>{returns.length}</strong>
        </div>

        <div className="returns-table-wrapper">
          <table className="admin-returns-table">
            <thead>
              <tr>
                <th>Return ID</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {returns.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    No return requests found.
                  </td>
                </tr>
              ) : (
                returns.map((item) => (
                  <tr key={item._id}>
                    <td>
                      #{item._id.slice(-6).toUpperCase()}
                    </td>

                    <td>
                      #
                      {item.order?._id
                        ?.toString()
                        .slice(-6)
                        .toUpperCase()}
                    </td>

                    <td>
                      {item.user?.name || "Unknown"}
                    </td>

                    <td>{item.reason}</td>

                    <td>
                      <span
                        className={`return-status ${item.status.toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>
                      {item.status === "Pending" ? (
                        <div className="return-actions">
                          <button
                            className="approve-return-btn"
                            onClick={() =>
                              updateReturnStatus(
                                item._id,
                                "Approved"
                              )
                            }
                          >
                            Approve
                          </button>

                          <button
                            className="reject-return-btn"
                            onClick={() =>
                              updateReturnStatus(
                                item._id,
                                "Rejected"
                              )
                            }
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="action-completed">
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminReturns;