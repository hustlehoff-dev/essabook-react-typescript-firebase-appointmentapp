//// AppointmentScheduler

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  appointmentDate: string;
  time: string;
}
export interface BookAppointmentPayload {
  selectedDate: string;
  selectedTime: string;
  clientName: string;
  clientPhone: string;
}
