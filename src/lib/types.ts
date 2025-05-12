//// AppointmentScheduler

export interface Appointment {
  id: string;
  userId: string;
  clientName: string;
  clientPhone: string;
  appointmentDate: string;
  time: string;
  fullDateTime: Date;
  status: string;
  createdAt: string;
}
export interface BookAppointmentPayload {
  selectedDate: string;
  selectedTime: string;
  clientName: string;
  clientPhone: string;
}
