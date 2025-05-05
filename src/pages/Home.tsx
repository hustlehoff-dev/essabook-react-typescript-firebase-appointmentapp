// src/pages/home/index.tsx
import { useEffect, useState } from "react";
import styled from "styled-components";
import AppointmentsToday from "../components/home/AppointmentsToday";

const getCurrentDate = () => {
  const now = new Date();
  const hours = now.getHours();
  // After 18:00 - next day
  if (hours >= 18) {
    now.setDate(now.getDate() + 1);
  }
  return now;
};
const Home = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(getCurrentDate());
  useEffect(() => {
    setSelectedDate(getCurrentDate());
  }, []);
  return (
    <HomeWrapper>
      <AppointmentsToday selectedDate={selectedDate} />
    </HomeWrapper>
  );
};

export default Home;
const HomeWrapper = styled.div`
  //background-color:#f2f2f2;
  height: 100%;
  padding: 1em;
`;
