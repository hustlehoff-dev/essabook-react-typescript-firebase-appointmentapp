// src/components/AppointmentsList.tsx
import AppointmentItem from "./AppointmentItem";

const AppointmentsList = ({
  appointments,
  onDelete,
}: {
  appointments: any[];
  onDelete: (id: string) => void;
}) => {
  return (
    <div>
      {appointments.map((appointment) => (
        <AppointmentItem
          key={appointment.id}
          appointment={appointment}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default AppointmentsList;
