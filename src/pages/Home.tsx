// src/pages/home/index.tsx
import React, { useEffect, useState } from "react";
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
  console.log(selectedDate);
  useEffect(() => {
    setSelectedDate(getCurrentDate());
  }, []);
  return (
    <HomeWrapper>
      <h2>{}</h2>
      <AppointmentsToday
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </HomeWrapper>
  );
};

export default Home;
const HomeWrapper = styled.div`
  background-color: #121212;
  height: 100vh;
  padding: 20px;
`;
