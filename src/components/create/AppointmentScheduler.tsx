// components/AppointmentScheduler.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import { firestore } from "../../firebase";
import { Value } from "react-calendar/src/shared/types.js";
import { deleteDoc, doc } from "firebase/firestore";
import { Appointment } from "../../lib/types";
import CustomButton from "../CustomButton";
import { useAuth } from "../../lib/AuthProvider"; // <--- dodane
import { bookAppointment, fetchAppointmentsOnce } from "../../lib/appointments";

const timeslots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

const deleteAppointment = async (
  id: string,
  appointments: Appointment[],
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>
) => {
  try {
    await deleteDoc(doc(firestore, "appointments", id));
    setAppointments(appointments.filter((appt) => appt.id !== id));
    alert("Usunięto wizytę");
  } catch (error) {
    console.error(error);
    alert("Błąd przy usuwaniu wizyty.");
  }
};

const AppointmentScheduler = () => {
  const { user, loading: authLoading } = useAuth();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;
    if (user && selectedDate) {
      fetchAppointmentsOnce(user.uid, selectedDate, setAppointments);
    }
  }, [selectedDate, user]);

  const handleDayClick = (value: Value) => {
    if (value instanceof Date) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");
      const formatted = `${year}-${month}-${day}`;
      setSelectedDate(formatted);
    }
  };

  if (!user) {
    return (
      <div style={{ color: "white" }}>
        Musisz być zalogowany, aby umawiać wizyty.
      </div>
    );
  }

  return (
    <Container>
      <h3>Umów wizytę</h3>

      <Calendar
        onChange={handleDayClick}
        value={selectedDate ? new Date(selectedDate) : new Date()}
        minDate={new Date()}
        maxDate={new Date(new Date().setDate(new Date().getDate() + 60))}
        calendarType="gregory"
        tileClassName={({ date, view }) => {
          if (view === "month" && selectedDate) {
            const isSameDay =
              date.toDateString() === new Date(selectedDate).toDateString();
            if (isSameDay) {
              return "selected";
            }
          }
          return null;
        }}
      />

      {selectedDate && (
        <>
          <TimeslotSection>
            {timeslots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                style={{
                  background: selectedTime === time ? "orange" : "#333",
                }}>
                {time}
              </button>
            ))}
          </TimeslotSection>

          <InputSection>
            <input
              placeholder="Imię klienta"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
            <input
              placeholder="Numer telefonu"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
            />
            <CustomButton
              title="Umów"
              isData={clientName && clientPhone && selectedTime ? false : true}
              isLoading={isBooking}
              handlePress={async () => {
                if (!clientName || !clientPhone || !selectedTime) {
                  alert("Wprowadź dane klienta i wybierz godzinę.");
                } else {
                  setIsBooking(true);
                  try {
                    await bookAppointment(
                      user.uid,
                      selectedDate,
                      selectedTime,
                      clientName,
                      clientPhone,
                      setAppointments
                    );
                  } catch (error) {
                    console.error(error);
                    alert("Wystąpił błąd przy umawianiu wizyty.");
                  } finally {
                    setIsBooking(false);
                    setSelectedTime("");
                    setClientName("");
                    setClientPhone("");
                  }
                }
              }}
            />
          </InputSection>

          <AppointmentList>
            {[...appointments]
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((appt) => (
                <div key={appt.id}>
                  <span>
                    {appt.clientName} – {appt.time}
                  </span>
                  <button
                    onClick={() => {
                      if (
                        !window.confirm(
                          `Czy na pewno chcesz usunąć wizytę ${appt.clientName}?`
                        )
                      ) {
                        return;
                      }
                      deleteAppointment(appt.id, appointments, setAppointments);
                    }}>
                    Usuń
                  </button>
                </div>
              ))}
          </AppointmentList>
        </>
      )}
    </Container>
  );
};

export default AppointmentScheduler;

const Container = styled.div`
  background: #121212;
  color: white;
`;
const TimeslotSection = styled.div`
  display: flex;
  gap: 0.5em;
  margin-top: 1em;
  overflow-x: scroll;
`;
const InputSection = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  input {
    border-radius: 8px;
    border: none;
    width: 100%;
    text-align: center;
    padding: 0.5em;
    font-size: 1.25em;
    background: transparent;
    backdrop-filter: blur(4px);
    border: 1px solid grey;
    color: #f2f2f2;
  }
`;
const AppointmentList = styled.div`
  margin-top: 1.5em;
  display: flex;
  flex-direction: column;
  gap: 0.75em;

  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    position: relative;

    span {
      background: linear-gradient(to right, #333, transparent);
      border-radius: 8px;
      padding: 0.6em 1.2em;
      font-size: 1.125em;
      padding-right: 4.2em;
    }
    button {
      font-size: 1.125em;
      background: #333;
      position: absolute;
      right: 0;
      transform: translateX(0%);
      transition: 0.3s;
      &:hover {
        background: red;
        outline: 0;
        border: 1px solid red;
        right: 50%;
        transform: translateX(50%);
      }
    }
  }
`;
