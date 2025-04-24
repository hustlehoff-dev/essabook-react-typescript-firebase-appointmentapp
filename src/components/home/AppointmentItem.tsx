// src/components/AppointmentItem.tsx
import styled from "styled-components";

const AppointmentItemWrapper = styled.div`
  padding: 16px;
  background-color: #1e1e1e;
  margin-bottom: 10px;
  border-radius: 10px;
  border: 1px solid #212121;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const AppointmentText = styled.p`
  font-size: 18px;
  color: #f2f2f2;
  margin-bottom: 2px;
`;

const Button = styled.button`
  background-color: #ff7f00;
  padding: 10px 20px;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #e67e00;
  }
`;

const AppointmentItem = ({
  appointment,
  onDelete,
}: {
  appointment: any;
  onDelete: (id: string) => void;
}) => {
  return (
    <AppointmentItemWrapper>
      <AppointmentText>{appointment.clientName}</AppointmentText>
      <AppointmentText>{appointment.clientPhone}</AppointmentText>
      <AppointmentText>{appointment.status}</AppointmentText>
      <AppointmentText>{appointment.time}</AppointmentText>
      <Button onClick={() => onDelete(appointment.id)}>Delete</Button>
    </AppointmentItemWrapper>
  );
};

export default AppointmentItem;
