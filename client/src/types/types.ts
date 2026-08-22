import {ApiErrorType} from "../apollo/errors.ts";

export interface MeData {
    me: User | null;
}

export type UserRole = "DOCTOR" | "PATIENT" | "ADMIN"

export interface User {
    id: string;
    role: UserRole;
}

export interface LoginInput {
    username: string;
    password: string;
}

export interface LoginData {
    login: {
        token: string;
        user: User;
    }
}

export interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    appointments?: Appointment[];
}

export interface GetPatientsData {
    patients: Patient[];
}

export interface GetPatientData {
    patient: Patient | null;
}

export interface CreatePatientInput {
    firstName: string;
    lastName: string;
}

export interface CreatePatientData {
    createPatient: Patient;
}

export interface UpdatePatientData {
    updatePatient: Patient;
}

export interface UpdatePatientInput {
    firstName?: string;
    lastName?: string;
}

export interface DeletePatientData {
    deletePatient: boolean;
}

export interface UpdatePatientPayload {
    id: string;
    input: UpdatePatientInput;
}

export interface Appointment {
    id: string;
    patientId: string;
    scheduledAt: string;
    reason: string;
}

export interface AppointmentConnection {
    items: Appointment[];
    total: number
    hasNext: boolean
}

export interface GetAppointmentsData {
    appointments: AppointmentConnection;
}

export interface GetAppointmentData {
    appointment: Appointment | null;
}

export interface CreateAppointmentInput {
    patientId: string;
    scheduledAt: string;
    reason: string;
}

export interface CreateAppointmentData {
    createAppointment: Appointment;
}

export interface UpdateAppointmentData {
    updateAppointment: Appointment;
}

export interface UpdateAppointmentInput {
    patientId?: string;
    scheduledAt?: string;
    reason?: string;
}

export interface DeleteAppointmentInput {
    id: string;
}

export interface DeleteAppointmentData {
    deleteAppointment: boolean;
}

export interface UpdateAppointmentPayload {
    id: string;
    input: UpdateAppointmentInput;
}

export interface ApiError {
    type: ApiErrorType;
    message: string;
}