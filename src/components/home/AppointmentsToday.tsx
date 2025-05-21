import { useState, useEffect } from "react";
import { useAuth } from "../../lib/AuthProvider";
import { format } from "date-fns";
import { firestore } from "../../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import styled from "styled-components";
import { handleDeleteAppointment, sendReminder } from "../../lib/appointments";

interface Appointment {
  id: string;
  userId: string;
  appointmentDate: string;
  clientName: string;
  clientPhone: string;
  createdAt: string;
  status: string;
  time: string;
}

interface appTodayProps {
  selectedDate: Date;
}

const AppointmentsToday = ({ selectedDate }: appTodayProps) => {
  const { user, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextUpcomingAppointmentId, setNextUpcomingAppointmentId] = useState<
    string | null
  >(null);
  const [lastPastAppointment, setLastPastAppointment] =
    useState<Appointment | null>(null);

  console.log(error);
  useEffect(() => {
    if (authLoading || !user) return;

    const appointmentsRef = collection(firestore, "appointments");

    const q = query(
      appointmentsRef,
      where("userId", "==", user.uid),
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

      // Sortowanie po czasie rosnąco
      fetchedAppointments = fetchedAppointments.sort((a, b) => {
        const [ah, am] = a.time.split(":").map(Number);
        const [bh, bm] = b.time.split(":").map(Number);
        return ah * 60 + am - (bh * 60 + bm);
      });

      const now = new Date();
      const pastAppointments: Appointment[] = [];
      const upcomingAppointments: Appointment[] = [];

      fetchedAppointments.forEach((appointment) => {
        const [hours, minutes] = appointment.time.split(":").map(Number);
        const [year, month, day] = appointment.appointmentDate
          .split("-")
          .map(Number);
        const appointmentTime = new Date(year, month - 1, day, hours, minutes);

        if (appointmentTime < now) {
          pastAppointments.push(appointment);
        } else {
          upcomingAppointments.push(appointment);
        }
      });

      // last past visit
      const lastPast =
        pastAppointments.length > 0
          ? pastAppointments[pastAppointments.length - 1]
          : null;

      setLastPastAppointment(lastPast);
      setAppointments(upcomingAppointments);

      const nextUpcoming = upcomingAppointments[0] || null;
      setNextUpcomingAppointmentId(nextUpcoming?.id || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedDate, user]);

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  // Reminder handler
  const handleReminder = async (appointmentId: string) => {
    setError(null);
    try {
      await sendReminder(appointmentId);
      alert("Przypomnienie zostało wysłane!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Nieznany błąd");
      }
    }
  };

  const renderAgendaItem = (item: Appointment, isLastPast = false) => {
    const isPast = isLastPast ? true : false;
    const isNextVisit = item.id === nextUpcomingAppointmentId;

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
          {isLastPast ? (
            <Button
              disabled={false}
              onClick={() => alert(`Umów ponownie z ${item.clientName}`)}>
              Umów ponownie
            </Button>
          ) : (
            <>
              <Button
                onClick={() => handleCall(item.clientPhone)}
                disabled={false}>
                Zadzwoń
              </Button>
              <Button
                onClick={() =>
                  handleDeleteAppointment(item.clientName, item.id)
                }
                disabled={false}>
                Usuń
              </Button>
              <Button onClick={() => handleReminder(item.id)} disabled={false}>
                Wyślij przypomnienie
              </Button>
            </>
          )}
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

          {lastPastAppointment && (
            <>
              <h4>Ostatnia wizyta</h4>
              <AppointmentsWrapper>
                {renderAgendaItem(lastPastAppointment, true)}
              </AppointmentsWrapper>
            </>
          )}

          {appointments.length > 0 && (
            <>
              <h4>Przyszłe wizyty</h4>
              <AppointmentsWrapper>
                {appointments.map((item) => renderAgendaItem(item))}
              </AppointmentsWrapper>
            </>
          )}
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
    props.$next ? "rgba(255, 215, 0, 0.2)" : "transparent"};
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
      ? "#777"
      : props.status === "confirmed"
      ? "green"
      : props.status === "cancelled"
      ? "red"
      : "#777"};
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
