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