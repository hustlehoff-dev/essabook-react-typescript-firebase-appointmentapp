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
import styled, { createGlobalStyle } from "styled-components";
import { Appointment } from "../../lib/types";
import {
  bookAppointment,
  handleDeleteAppointment,
  sendReminder,
} from "../../lib/appointments";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import StyledInput from "../StyledInput";
import RebookModal from "../RebookModal";
import {
  getStatusText,
  getSafeStatus,
  statusColors,
} from "../../lib/AppointmentStatus";
import AppointmentItem from "./../AppointmentItem";

const getCurrentDate = () => {
  const now = new Date();
  const hours = now.getHours();
  if (hours >= 18) {
    now.setDate(now.getDate() + 1);
  }
  return now;
};

const AppointmentsToday = () => {
  const { user, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [selectedDate, setSelectedDate] = useState(getCurrentDate);

  // Rebook modal state
  const [showRebookModal, setShowRebookModal] = useState(false);
  const [rebookDate, setRebookDate] = useState<Date | null>(new Date());
  const [rebookTime, setRebookTime] = useState("12:00");
  const [rebookClient, setRebookClient] = useState<Appointment | null>(null);

  const handleRebookClick = (appointment: Appointment) => {
    setRebookClient(appointment);
    // ustaw datę i godzinę na aktualne wartości wizyty, jeśli możliwe
    setRebookDate(
      new Date(`${appointment.appointmentDate}T${appointment.time}:00`)
    );
    setRebookTime(appointment.time);
    setShowRebookModal(true);
  };
  const [isBooking, setIsBooking] = useState(false);
  console.log(isBooking);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextUpcomingAppointmentId, setNextUpcomingAppointmentId] = useState<
    string | null
  >(null);
  const [lastPastAppointment, setLastPastAppointment] =
    useState<Appointment | null>(null);

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

        const isToday =
          appointment.appointmentDate === format(selectedDate, "yyyy-MM-dd");

        if (appointmentTime < now && isToday) {
          pastAppointments.push(appointment);
        } else {
          upcomingAppointments.push(appointment);
        }
      });

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
  console.log(error);
  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

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

  // Tu powinna iść funkcja createAppointment do potwierdzenia rezerwacji
  // Na razie prosta alert / symulacja
  const createAppointment = async () => {
    if (!rebookClient || !rebookDate || !rebookTime) return;

    setIsBooking(true);
    try {
      await bookAppointment(
        rebookClient.userId,
        format(rebookDate, "yyyy-MM-dd"), // poprawna, nowa data
        rebookTime, // poprawna, nowa godzina
        rebookClient.clientName,
        rebookClient.clientPhone,
        setAppointments
      );

      alert(
        `Umówiono wizytę dla ${rebookClient.clientName} na ${format(
          rebookDate,
          "yyyy-MM-dd"
        )} o ${rebookTime}`
      );

      setShowRebookModal(false);
    } catch (error) {
      console.error(error);
      alert("Wystąpił błąd przy umawianiu wizyty.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Container>
      {loading ? (
        <Loading>Ładowanie wizyt... :)</Loading>
      ) : (
        <>
          <DatePickerGlobalStyle />
          <DatePicker
            id="date-picker"
            selected={selectedDate}
            onChange={(date) => date && setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            withPortal
            customInput={<StyledInput />}
          />

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

          <RebookModal
            visible={showRebookModal}
            onClose={() => setShowRebookModal(false)}
            onConfirm={createAppointment}
            date={rebookDate}
            time={rebookTime}
            clientName={rebookClient?.clientName || ""}
            onDateChange={setRebookDate}
            onTimeChange={setRebookTime}
          />
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

const DatePickerGlobalStyle = createGlobalStyle`
  .react-datepicker {
    background-color: #2a2a2a;
    color: #fff;
    border: 1px solid #ff7f00;
    font-family: 'Arial', sans-serif;
  }

  .react-datepicker__header {
    background-color: #1f1f1f;
    border-bottom: 1px solid #ff7f00;
  }

  .react-datepicker__current-month,
  .react-datepicker__day-name,
  .react-datepicker__day {
    color: #fff;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: #ff7f00;
    color: #000;
  }

  .react-datepicker__day:hover {
    background-color: #ffa94d;
    color: black;
  }

  .react-datepicker__navigation-icon::before {
    border-color: #fff;
  }
`;

const AppointmentItem = styled.div<{
  $past: boolean;
  $next: boolean;
  status: string;
}>`
  padding: 8px 16px;
  width: 100%;
  max-width: 420px;
  backdrop-filter: blur(12px);
  border-radius: 10px;
  border: 1px solid rgba(50, 50, 50, 0.5);
  opacity: ${(props) => (props.$past ? 0.3 : 1)};
  background-color: ${(props) =>
    statusColors[getSafeStatus(props.status)].background};
  box-shadow: ${(props) => statusColors[getSafeStatus(props.status)].shadow};
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
  font-size: 1.25em;
  color: ;
  font-weight: 600;
  margin: 0;
`;

const ClientPhone = styled.p`
  font-size: 1.25em;
  color: ;
  font-weight: 600;
  margin: 0 0 0.5em 0;
`;

const Status = styled.p<{ status: string }>`
  font-size: 1.5em;
  font-weight: 600;
  margin: 0;
  color: ${(props) => statusColors[getSafeStatus(props.status)].text}};
`;

const AppointmentTime = styled.p<{ status: string }>`
  font-size: 1.5em;
  font-weight: 600;
  margin: 0;
  color: ; //${(props) => statusColors[getSafeStatus(props.status)].text}};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const Button = styled.button<{ disabled?: boolean }>`
  padding: 10px;
  background-color: ${(props) =>
    props.disabled ? "grey" : "rgba(205, 205, 224,.75)"};
  color: black;
  border-radius: 5px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  border: none;
  font-size: 16px;

  &:disabled {
    background-color: grey;
  }
`;

export default AppointmentsToday;
