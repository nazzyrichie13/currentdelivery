import { useState } from "react";
import axios from "axios";

function RescheduleByTracking() {
  const [trackingCode, setTrackingCode] = useState("");
  const [requestedDate, setRequestedDate] = useState("");
  const [reason, setReason] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `/api/shipments/track/${trackingCode}/reschedule-request`,
        { requestedDate, reason },
        { withCredentials: true }
      );
      alert("Request submitted");
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  return (
    <form onSubmit={submit}>
      <input
        placeholder="Tracking Code"
        value={trackingCode}
        onChange={(e) => setTrackingCode(e.target.value)}
        required
      />

      <input
        type="date"
        value={requestedDate}
        onChange={(e) => setRequestedDate(e.target.value)}
        required
      />

      <textarea
        placeholder="Reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        required
      />

      <button>Submit</button>
    </form>
  );
}

export default RescheduleByTracking;
