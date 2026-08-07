export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Appointment {
    id: string;
    patientId: string;
    scheduledAt: string;
    reason: string;
}