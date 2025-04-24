import { firestore } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Appointment, BookAppointmentPayload } from "./types";

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

export const fetchAppointments = async (
  selectedDate: string
): Promise<Appointment[]> => {
  const q = query(
    collection(firestore, "appointments"),
    where("appointmentDate", ">=", selectedDate)
  );
  const querySnapshot = await getDocs(q);
  const fetched = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Appointment[];

  return fetched.filter((a) => a.appointmentDate.startsWith(selectedDate));
};

export const bookAppointment = async (data: BookAppointmentPayload) => {
  const { selectedDate, selectedTime, clientName, clientPhone } = data;
  const fullDateTime = new Date(`${selectedDate}T${selectedTime}`);
  await addDoc(collection(firestore, "appointments"), {
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
};

export const deleteAppointment = async (id: string) => {
  await deleteDoc(doc(firestore, "appointments", id));
};
