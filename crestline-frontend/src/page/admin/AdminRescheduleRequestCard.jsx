
    import axios from "axios";
import { useState } from "react";

function AdminRescheduleRequestCard({ trackingCode, request, onRefresh }) {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await axios.patch(
        `/api/shipments/track/${trackingCode}/reschedule-request/${request?._id}`,
        { action: "approve" },
        { withCredentials: true }
      );
      alert("Request approved");
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.error || "Approve failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    const adminNote = prompt("Reason for rejection:");
    if (!adminNote) return;

    setLoading(true);
    try {
      await axios.patch(
        `/api/shipments/track/${trackingCode}/reschedule-request/${request?._id}`,
        {
          action: "reject",
          adminNote
        },
        { withCredentials: true }
      );
      alert("Request rejected");
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.error || "Reject failed");
    } finally {
      setLoading(false);
    }
  };

  if (!request) return null; // prevent crash if request is undefined

  return (
    <div style={styles.card}>
      <p>
        <b>Requested Date:</b>{" "}
        {request.requestedDate ? new Date(request.requestedDate).toDateString() : "N/A"}
      </p>
      <p><b>Reason:</b> {request.reason || "No reason provided"}</p>
      <p><b>Status:</b> {request.status || "Unknown"}</p>

      {request.status === "pending" ? (
        <div style={styles.actions}>
          <button onClick={handleApprove} disabled={loading} style={styles.approve}>
            ✅ Approve
          </button>
          <button onClick={handleReject} disabled={loading} style={styles.reject}>
            ❌ Reject
          </button>
        </div>
      ) : (
        <p style={styles.done}>{(request.status || "unknown").toUpperCase()}</p>
      )}
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    padding: "16px",
    marginBottom: "12px",
    borderRadius: "6px"
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  },
  approve: {
    background: "#16a34a",
    color: "white",
    padding: "8px 14px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  },
  reject: {
    background: "#dc2626",
    color: "white",
    padding: "8px 14px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  },
  done: {
    fontWeight: "bold",
    marginTop: "8px"
  }
};

export default AdminRescheduleRequestCard;
