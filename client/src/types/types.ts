interface User {
    id: string;
    role: string;
}

interface LoginInput {
    username: string;
    password: string;
}

interface LoginData {
    login: {
        token: string;
        user: User;
    }
}

interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    appointments?: Appointment[];
}

interface GetPatientsData {
    patients: Patient[];
}

interface GetPatientData {
    patient: Patient | null;
}

interface CreatePatientInput {
    createPatient: Patient;
}

interface CreatePatientData {
    createPatient: Patient;
}

interface UpdatePatientData {
    updatePatient: Patient;
}

interface UpdatePatientInput {
    firstName?: string;
    lastName?: string;
}

interface DeletePatientData {
    deletePatient: boolean;
}

interface Appointment {
    id: string;
    patientId: string;
    scheduledAt: string;
    reason: string;
    patient?: Patient;
}

interface GetAppointmentsData {
    appointments: Appointment[];
}

interface GetAppointmentData {
    appointment: Appointment | null;
}

interface CreateAppointmentInput {
    patientId: string;
    scheduledAt: string;
    reason: string;
}

interface CreateAppointmentData {
    appointment: Appointment;
}

interface UpdateAppointmentData {
    appointment: Appointment;
}

interface UpdateAppointmentInput {
    id: string;
    input: {
        patientId?: string;
        scheduledAt?: string;
        reason?: string;
    };
}

interface DeleteAppointmentInput {
    id: string;
}

interface DeleteAppointmentData {
    deleteAppointment: boolean;
}