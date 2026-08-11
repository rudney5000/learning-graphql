interface Patient {
    id: string;
    firstName: string;
    lastName: string;
}

interface GetPatientsData {
    patients: Patient[];
}

interface CreatePatientData {
    createPatient: Patient;
}

interface UpdatePatientInput {
    firstName?: string;
    lastName?: string;
}