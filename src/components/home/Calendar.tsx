// src/components/CalendarComponent.tsx
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarComponent = ({
  selectedDate,
  onDateChange,
}: {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}) => {
  return <Calendar onChange={onDateChange} value={selectedDate} />;
};

export default CalendarComponent;
