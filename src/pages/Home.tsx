// src/pages/home/index.tsx

import styled from "styled-components";
import AppointmentsToday from "../components/home/AppointmentsToday";

const Home = () => {
  return (
    <HomeWrapper>
      <AppointmentsToday />
    </HomeWrapper>
  );
};

export default Home;
const HomeWrapper = styled.div`
  //background-color:#f2f2f2;
  height: 100%;
  padding: 1em;
`;
