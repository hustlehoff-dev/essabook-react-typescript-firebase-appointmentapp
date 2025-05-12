import { firestore } from "../firebase";
import {
  collection,
  getDoc,
  setDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Appointment } from "./types";

export const getWeekDates = () => {
  const today = new Date();
  const startOfWeek = today.getDate() - today.getDay() + 1;
  const weekDates: Record<
    string,
    { selected: boolean; selectedColor: string }
  > = {};

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(startOfWeek + i);
    const dateString = date.toISOString().split("T")[0];
    weekDates[dateString] = { selected: false, selectedColor: "orange" };
  }

  return weekDates;
};

// Fetch once
export const fetchAppointmentsOnce = async (
  userId: string,
  selectedDate: string,
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>
) => {
  if (!selectedDate) {
    setAppointments([]);
    return;
  }

  const formattedDate = new Date(selectedDate).toISOString().split("T")[0];

  const q = query(
    collection(firestore, "appointments"),
    where("userId", "==", userId),
    where("appointmentDate", "==", formattedDate)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    setAppointments([]);
    return;
  }

  const fetchedAppointments = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Appointment[];

  setAppointments(fetchedAppointments);
};

// Appointment booking

//// Funkcja pomocnicza - generuje unikalne ID
const generateUniqueId = async (): Promise<string> => {
  let uniqueId = "";
  let exists = true;

  while (exists) {
    uniqueId = Math.random().toString(36).substring(2, 8); // np. 'k2j9qz'
    const docRef = doc(firestore, "appointments", uniqueId);
    const docSnap = await getDoc(docRef);
    exists = docSnap.exists(); // true = ID już zajęte
  }

  return uniqueId;
};

export const bookAppointment = async (
  userId: string,
  selectedDate: string,
  selectedTime: string,
  clientName: string,
  clientPhone: string,
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>
) => {
  try {
    const appointmentRef = collection(firestore, "appointments");
    const fullDateTime = new Date(`${selectedDate}T${selectedTime}:00`);

    // Wygeneruj unikalne, krótkie ID
    const uniqueId = await generateUniqueId();

    // Zapisz dokument z własnym ID
    await setDoc(doc(appointmentRef, uniqueId), {
      userId,
      clientName,
      clientPhone,
      appointmentDate: selectedDate,
      time: selectedTime,
      fullDateTime,
      status: "booked",
      createdAt: new Date().toString(),
    });

    await fetch("https://api.essabook.pl/add-appointment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName,
        clientPhone,
        appointmentDate: selectedDate,
        time: selectedTime,
      }),
    });

    alert("Wizyta została zarezerwowana!");
    fetchAppointmentsOnce(userId, selectedDate, setAppointments);
  } catch (error) {
    console.error(error);
    alert("Wystąpił błąd podczas rezerwacji wizyty.");
  }
};

// Old appointment booking
/*
export const bookAppointment = async (
  userId: string,
  selectedDate: string,
  selectedTime: string,
  clientName: string,
  clientPhone: string,
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>
) => {
  try {
    const appointmentRef = collection(firestore, "appointments");
    const fullDateTime = new Date(`${selectedDate}T${selectedTime}:00`);

    await addDoc(appointmentRef, {
      userId,
      clientName,
      clientPhone,
      appointmentDate: selectedDate,
      time: selectedTime,
      fullDateTime,
      status: "booked", 
      createdAt: new Date().toString(),
    });

    await fetch("https://api.essabook.pl/add-appointment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName,
        clientPhone,
        appointmentDate: selectedDate,
        time: selectedTime,
      }),
    });

    alert("Wizyta została zarezerwowana!");
    fetchAppointmentsOnce(userId, selectedDate, setAppointments);
  } catch (error) {
    console.error(error);
    alert("Wystąpił błąd podczas rezerwacji wizyty.");
  }
};*/

/*
export const deleteAppointment = async (
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
};*/

export const handleDeleteAppointment = async (
  clientName: string,
  appointmentId: string,
  afterDelete?: () => void
) => {
  if (!window.confirm(`Czy na pewno chcesz usunąć wizytę ${clientName}?`)) {
    return;
  }

  try {
    await deleteDoc(doc(firestore, "appointments", appointmentId));
    alert("Wizyta została usunięta.");
    if (afterDelete) afterDelete(); // np. odświeżenie lokalnego stanu, jeśli potrzebne
  } catch (error) {
    console.error("Błąd przy usuwaniu wizyty:", error);
    alert("Wystąpił błąd przy usuwaniu wizyty.");
  }
};

// Reminder send
export const sendReminder = async (appointmentId: string): Promise<void> => {
  try {
    const response = await fetch(
      `https://api.essabook.pl/send-reminder/${appointmentId}`,
      { method: "GET" }
    );

    if (!response.ok) {
      throw new Error("Błąd przy wysyłaniu przypomnienia");
    }
  } catch (error) {
    throw error; // błąd w komponencie, nie obsluguje go tutaj
  }
};
