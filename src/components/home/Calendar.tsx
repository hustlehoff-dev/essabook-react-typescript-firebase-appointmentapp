import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { CalendarProps } from "react-calendar";

const CalendarComponent = ({
  selectedDate,
  onDateChange,
}: {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}) => {
  const handleChange: CalendarProps["onChange"] = (value) => {
    if (value instanceof Date) {
      onDateChange(value);
    }
  };

  return <Calendar onChange={handleChange} value={selectedDate} />;
};

export default CalendarComponent;
