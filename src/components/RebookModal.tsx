import React from "react";
import DatePicker from "react-datepicker";
import StyledInput from "../components/StyledInput"; // dopasuj do ścieżki komponentu

import "react-datepicker/dist/react-datepicker.css";

interface RebookModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  date: Date | null;
  time: string;
  clientName: string;
  onDateChange: (date: Date | null) => void;
  onTimeChange: (time: string) => void;
}

const RebookModal: React.FC<RebookModalProps> = ({
  visible,
  onClose,
  onConfirm,
  date,
  time,
  clientName,
  onDateChange,
  onTimeChange,
}) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}>
      <div
        style={{
          background: "#1e1e1e",
          padding: "2em",
          borderRadius: "10px",
          maxWidth: "400px",
          width: "100%",
        }}>
        <h3>Umów ponownie z {clientName}</h3>
        <div style={{ marginBottom: "1em" }}>
          <DatePicker
            selected={date}
            onChange={onDateChange}
            dateFormat="yyyy-MM-dd"
            withPortal
            customInput={<StyledInput />}
          />
        </div>
        <div style={{ marginBottom: "1em" }}>
          <label>Godzina:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ff7f00",
              backgroundColor: "#2a2a2a",
              color: "#fff",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={onConfirm}>Umów</button>
          <button onClick={onClose}>Anuluj</button>
        </div>
      </div>
    </div>
  );
};

export default RebookModal;
