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
import styled from "styled-components";

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
      let fetchedAppointments: Appointment[] = [];
      querySnapshot.forEach((doc) => {
        fetchedAppointments.push({
          id: doc.id,
          ...doc.data(),
        } as Appointment);
      });

      // Sortuj po czasie rosnąco (najwcześniejsza godzina na górze)
      fetchedAppointments = fetchedAppointments.sort((a, b) => {
        const [ah, am] = a.time.split(":").map(Number);
        const [bh, bm] = b.time.split(":").map(Number);
        return ah * 60 + am - (bh * 60 + bm);
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

    return () => unsubscribe();
  }, [selectedDate]);

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
    console.log("Calling");
  };

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

  const isPastAppointment = (appointment: Appointment) => {
    const now = new Date();
    const [hours, minutes] = appointment.time.split(":").map(Number);
    const [year, month, day] = appointment.appointmentDate
      .split("-")
      .map(Number);

    const appointmentTime = new Date(year, month - 1, day, hours, minutes);
    return appointmentTime < now;
  };

  const renderAgendaItem = (item: Appointment, index: number) => {
    const isPast = isPastAppointment(item);
    const isNextVisit = index === 0; // ✅ najbliższy termin

    return (
      <AppointmentItem key={item.id} $past={isPast} $next={isNextVisit}>
        <ItemContent>
          <ItemContentLeft>
            <ClientName>{item.clientName}</ClientName>
            <ClientPhone>{item.clientPhone}</ClientPhone>
          </ItemContentLeft>
          <ItemContentRight>
            <Status status={item.status}>{getStatusText(item.status)}</Status>
            <AppointmentTime status={item.status}>{item.time}</AppointmentTime>
          </ItemContentRight>
        </ItemContent>
        <ButtonContainer>
          <Button
            onClick={() => {
              handleCall(item.clientPhone);
            }}
            disabled={isPast}>
            Zadzwoń
          </Button>
          <Button
            onClick={() => {
              if (
                window.confirm(`Czy chcesz usunąć wizytę ${item.clientName}?`)
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
      {loading ? (
        <Loading>Ładowanie wizyt... :)</Loading>
      ) : (
        <>
          <SectionTitle>{selectedDate.toLocaleDateString()}</SectionTitle>
          {sections.map((section: any) => (
            <AppointmentsWrapper key={section.title}>
              {section.data.map((item: Appointment, index: number) =>
                renderAgendaItem(item, index)
              )}
            </AppointmentsWrapper>
          ))}
        </>
      )}
    </Container>
  );
};

const Loading = styled.p`
  width: 100%;
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
`;

const Container = styled.div`
  flex: 1;
`;

const AppointmentsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
`;

const SectionTitle = styled.h3``;

const AppointmentItem = styled.div<{ $past: boolean; $next: boolean }>`
  padding: 8px 16px;
  width: 100%;
  max-width: 420px;
  backdrop-filter: blur(12px);
  border-radius: 10px;
  border: 1px solid rgba(50, 50, 50, 0.5);
  opacity: ${(props) => (props.$past ? 0.3 : 1)};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  background-color: ${(props) =>
    props.$next ? "rgba(255, 215, 0, 0.2)" : "transparent"}; // ✅ PODŚWIETLENIE
`;

const ItemContent = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ItemContentLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
`;
const ItemContentRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  align-items: flex-end;
`;

const ClientName = styled.p`
  font-size: 1.5em;
  color: #777777;
  font-weight: 600;
  margin: 0;
`;

const ClientPhone = styled.p`
  font-size: 1.25em;
  color: #ff7f00;
  margin: 0 0 0.5em 0;
`;

const Status = styled.p<{ status: string }>`
  font-size: 1.5em;
  font-weight: 600;
  margin: 0;
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
  font-size: 1.25em;
  font-weight: 600;
  margin: 0;
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
