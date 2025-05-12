import { useState } from "react";
const SendReminderButton = ({ appointmentId }: { appointmentId: string }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <button onClick={sendReminder} disabled={loading}>
        {loading ? "Wysyłanie..." : "Wyślij przypomnienie"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default SendReminderButton;
