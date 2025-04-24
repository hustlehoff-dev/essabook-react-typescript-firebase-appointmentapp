import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { firestore } from "../../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import Calendar from "react-calendar"; // react-calendar for the calendar view
import styled from "styled-components"; // Import styled-components

interface Appointment {
  id: string;
  appointmentDate: string;
  clientName: string;
  clientPhone: string;
  createdAt: string;
  status: string;
  time: string;
}

interface selDateType {
  selectedDate: Date;
}

const AppointmentsToday = ({ selectedDate }: selDateType) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const appointmentsRef = collection(firestore, "appointments");

    const q = query(
      appointmentsRef,
      where("appointmentDate", "==", format(selectedDate, "yyyy-MM-dd")),
      orderBy("fullDateTime", "asc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedAppointments: Appointment[] = [];
      querySnapshot.forEach((doc) => {
        fetchedAppointments.push({
          id: doc.id,
          ...doc.data(),
        } as Appointment);
      });

      // Group appointments into sections based on appointment date
      const groupedAppointments: { [key: string]: Appointment[] } =
        fetchedAppointments.reduce(
          (acc: { [key: string]: Appointment[] }, appointment: Appointment) => {
            const date = appointment.appointmentDate;
            if (!acc[date]) acc[date] = [];
            acc[date].push(appointment);
            return acc;
          },
          {}
        );

      const sectionsData = Object.keys(groupedAppointments).map((date) => ({
        title: date,
        data: groupedAppointments[date],
      }));
      setSections(sectionsData);
      setAppointments(fetchedAppointments);
      setLoading(false);
    });

    // Return unsub function when component unmounts
    return () => unsubscribe();
  }, [selectedDate]);

  // Handle deleting appointment
  const handleDelete = (appointmentId: string) => {
    const appointmentRef = doc(firestore, "appointments", appointmentId);
    deleteDoc(appointmentRef)
      .then(() => {
        console.log("Wizyta usunięta!");
      })
      .catch((err) => {
        console.error("Błąd przy usuwaniu wizyty:", err);
      });
  };

  // Check if appointment time has passed
  const isPastAppointment = (appointment: Appointment) => {
    const now = new Date();
    const [hours, minutes] = appointment.time.split(":").map(Number);
    const [year, month, day] = appointment.appointmentDate
      .split("-")
      .map(Number);

    const appointmentTime = new Date(year, month - 1, day, hours, minutes);
    return appointmentTime < now;
  };

  const renderAgendaItem = (item: Appointment) => {
    const isPast = isPastAppointment(item);
    return (
      <AppointmentItem key={item.id} past={isPast}>
        <ItemContent>
          <div>
            <ClientName>{item.clientName}</ClientName>
            <ClientPhone>{item.clientPhone}</ClientPhone>
          </div>
          <div style={{ textAlign: "right" }}>
            <Status status={item.status}>{getStatusText(item.status)}</Status>
            <AppointmentTime status={item.status}>{item.time}</AppointmentTime>
          </div>
        </ItemContent>
        <ButtonContainer>
          <Button onClick={() => {}} disabled={isPast}>
            Zadzwoń
          </Button>
          <Button
            onClick={() => {
              if (
                window.confirm(
                  `Czy na pewno chcesz usunąć wizytę dla ${item.clientName}?`
                )
              ) {
                handleDelete(item.id);
              }
            }}
            disabled={isPast}>
            Usuń
          </Button>
        </ButtonContainer>
      </AppointmentItem>
    );
  };

  return (
    <Container>
      <Calendar
        value={selectedDate}
        onChange={() => {}}
        calendarType="gregory"
      />
      <div style={{ marginTop: "20px" }}>
        {loading ? (
          <p>Ładowanie wizyt...</p>
        ) : (
          sections.map((section: any) => (
            <div key={section.title}>
              <SectionTitle>{section.title}</SectionTitle>
              {section.data.map(renderAgendaItem)}
            </div>
          ))
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  background-color: #121212;
  padding: 10px;
  flex: 1;
`;

const SectionTitle = styled.h3`
  color: #fff;
`;

const AppointmentItem = styled.div<{ past: boolean }>`
  padding: 16px;
  background-color: #1e1e1e;
  margin-bottom: 10px;
  border-radius: 10px;
  border: 1px solid #212121;
  opacity: ${(props) => (props.past ? 0.3 : 1)};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const ItemContent = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ClientName = styled.p`
  font-size: 18px;
  color: #f2f2f2;
`;

const ClientPhone = styled.p`
  font-size: 18px;
  color: #f2f2f2;
`;

const Status = styled.p<{ status: string }>`
  font-size: 18px;
  font-weight: 600;
  color: ${(props) =>
    props.status === "booked"
      ? "#FF7F00"
      : props.status === "confirmed"
      ? "green"
      : props.status === "cancelled"
      ? "red"
      : "gray"};
`;

const AppointmentTime = styled.p<{ status: string }>`
  font-size: 18px;
  font-weight: 600;
  color: ${(props) =>
    props.status === "booked"
      ? "#FF7F00"
      : props.status === "confirmed"
      ? "green"
      : props.status === "cancelled"
      ? "red"
      : "gray"};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const Button = styled.button<{ disabled: boolean }>`
  padding: 10px;
  background-color: ${(props) => (props.disabled ? "grey" : "#FF7F00")};
  color: black;
  border-radius: 5px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  border: none;
  font-size: 16px;

  &:disabled {
    background-color: grey;
  }
`;

const getStatusText = (status: string) => {
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

export default AppointmentsToday;
