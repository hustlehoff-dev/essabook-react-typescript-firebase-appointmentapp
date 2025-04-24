import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Calendar from "react-calendar"; // Kalendarz na React Web
import { firestore } from "../../firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Appointment } from "../../lib/types"; // Typy danych

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

const getWeekDates = () => {
  const today = new Date();
  const startOfWeek = today.getDate() - today.getDay() + 1;
  const weekDates: {
    [key: string]: { selected: boolean; selectedColor: string };
  } = {};

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(startOfWeek + i);
    const dateString = date.toISOString().split("T")[0];
    weekDates[dateString] = { selected: false, selectedColor: "orange" };
  }

  return weekDates;
};

const fetchAppointments = async (
  selectedDate: string,
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>
) => {
  const q = query(
    collection(firestore, "appointments"),
    where("appointmentDate", ">=", selectedDate)
  );
  const querySnapshot = await getDocs(q);
  const fetchedAppointments = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Appointment[];

  const filteredAppointments = fetchedAppointments.filter((appt) =>
    appt.appointmentDate.startsWith(selectedDate)
  );
  setAppointments(filteredAppointments);
};

const bookAppointment = async (
  selectedDate: string,
  selectedTime: string,
  clientName: string,
  clientPhone: string,
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>
) => {
  try {
    const appointmentRef = collection(firestore, "appointments");
    const fullDateTime = new Date(`${selectedDate}T${selectedTime}`);

    // Rezerwacja do Firestore
    await addDoc(appointmentRef, {
      clientName,
      clientPhone,
      appointmentDate: `${selectedDate}`,
      time: `${selectedTime}`,
      fullDateTime: fullDateTime,
      status: "booked",
      createdAt: new Date().toString(),
    });

    // Sync z backendem
    await fetch("https://api.essabook.pl/add-appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientName,
        clientPhone,
        appointmentDate: `${selectedDate}`,
        time: `${selectedTime}`,
      }),
    });

    alert("Wizyta została zarezerwowana!");
    fetchAppointments(selectedDate, setAppointments); // Odświeżenie wizyt
  } catch (error) {
    console.error(error);
    alert("Wystąpił błąd podczas rezerwacji wizyty.");
  }
};

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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const weekDates = getWeekDates();

  useEffect(() => {
    if (selectedDate) {
      fetchAppointments(selectedDate, setAppointments);
    }
  }, [selectedDate]);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  return (
    <Container>
      <h1>Rezerwacja wizyt</h1>
      <CalendarWrapper>
        <Calendar
          onChange={handleDayClick}
          value={selectedDate ? new Date(selectedDate) : new Date()}
          minDate={new Date()}
          maxDate={new Date(new Date().setDate(new Date().getDate() + 60))}
          tileClassName={({ date, view }) => {
            if (
              view === "month" &&
              weekDates[date.toISOString().split("T")[0]]
            ) {
              return "selected";
            }
          }}
        />
      </CalendarWrapper>

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
            <button
              onClick={() => {
                if (!clientName || !clientPhone) {
                  alert("Proszę wprowadzić dane klienta!");
                } else {
                  bookAppointment(
                    selectedDate,
                    selectedTime,
                    clientName,
                    clientPhone,
                    setAppointments
                  );
                }
              }}>
              Zarezerwuj
            </button>
          </InputSection>

          <AppointmentList>
            {appointments.map((appt) => (
              <div key={appt.id}>
                <span>
                  {appt.clientName} – {appt.time}
                </span>
                <button
                  onClick={() =>
                    deleteAppointment(appt.id, appointments, setAppointments)
                  }>
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
  padding: 2rem;
  background: #121212;
  color: white;
  min-height: 100vh;
`;

const CalendarWrapper = styled.div`
  margin-top: 1rem;
`;

const TimeslotSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const InputSection = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;

  input {
    padding: 0.5rem;
    border-radius: 4px;
    border: none;
  }
`;

const AppointmentList = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
