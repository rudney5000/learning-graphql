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

export type UserRole = "DOCTOR" | "PATIENT" | "ADMIN"

export interface GraphQLContext {
    user: User| null;
}

export interface Payload {
    sub: string;
    role: UserRole;
    iat?: number;
}

export interface User {
    id: string;
    role: UserRole;
}