// src/pages/home/index.tsx
import styled from "styled-components";
import AppointmentScheduler from "../components/create/AppointmentScheduler";

const CreateWrapper = styled.div`
  background-color: #121212;
  height: 100%;
  padding: 1em;
`;

const Create = () => {
  return (
    <CreateWrapper>
      <AppointmentScheduler />
    </CreateWrapper>
  );
};

export default Create;
