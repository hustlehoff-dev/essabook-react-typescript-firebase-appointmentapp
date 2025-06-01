// lib/status.ts

export type AppointmentStatus =
  | "booked"
  | "confirmed"
  | "cancelled"
  | "default";

export const statusColors: Record<
  AppointmentStatus,
  {
    background: string;
    shadow: string;
    text: string;
    name: string;
  }
> = {
  booked: {
    background: "rgba(255, 127, 0, 0.2)",
    shadow: "0 0 10px rgba(255, 127, 0, 0.4)",
    text: "#FF7F00",
    name: "#CC6600",
  },
  confirmed: {
    background: "rgba(0, 128, 0, 0.20)",
    shadow: "0 0 10px rgba(0, 128, 0, 0.4)",
    text: "green",
    name: "darkgreen",
  },
  cancelled: {
    background: "rgba(255, 0, 0, 0.2)",
    shadow: "0 0 10px rgba(255, 0, 0, 0.4)",
    text: "red",
    name: "darkred",
  },
  default: {
    background: "transparent",
    shadow: "0 2px 4px rgba(0,0,0,0.2)",
    text: "#777",
    name: "#999",
  },
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case "booked":
      return "Zarezerwowane";
    case "confirmed":
      return "Potwierdzone";
    case "cancelled":
      return "Anulowane";
    default:
      return "Nieznany status";
  }
};

export const getSafeStatus = (status: string): AppointmentStatus => {
  return ["booked", "confirmed", "cancelled"].includes(status)
    ? (status as AppointmentStatus)
    : "default";
};
