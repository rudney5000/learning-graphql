import type { Appointment, GraphQLContext, Patient } from "./types";
import {requireRole} from "./auth";

const fakePatients: Patient[] = [
    { id: "1", firstName: "Jean", "lastName": "Mbala"},
    { id: "2", firstName: "Aline", "lastName": "Kanku"}
];

const fakeAppointments: Appointment[] = [
    { id: "a1", patientId: "1", scheduledAt: '2026-08-10T09:00:00Z', reason: 'Controle'},
    { id: "a2", patientId: "2", scheduledAt: '2026-09-01T14:00:00Z', reason: 'Suivi'},
    { id: "a3", patientId: "2", scheduledAt: '2026-08-15T10:00:00Z', reason: 'Vaccin'}
];


interface PatientArgs {
    id: string;
};

interface CreatePatientArgs {
    input: {
        firstName: string;
        lastName: string;
    }
}

interface UpdatePatientArgs {
    id: string;
    input: {
        firstName?: string;
        lastName?: string;
    }
}

let nextId = 3;

export const resolvers = {
    Query: {
        patients: (): Patient[] => {
            return fakePatients;
        },

        patient: (
            _parent: unknown,
            args: PatientArgs,
            context: GraphQLContext
        ): Patient | undefined => {
            console.log("USER:", context.user);

            requireRole(context, "DOCTOR");

            return fakePatients.find(
                (patient) => patient.id === args.id
            );
        },
    },

    Mutation: {
        createPatient: (_patient: unknown, args: CreatePatientArgs): Patient => {
            const newPatient: Patient = {
                id: String(nextId++),
                firstName: args.input.firstName,
                lastName: args.input.lastName
            };
            fakePatients.push(newPatient);
            return newPatient;
        },
        updatePatient: (_patient: unknown, args: UpdatePatientArgs): Patient | null => {
            const patient = fakePatients.find((p) => p.id === args.id);
            
            if(!patient) return null

            if(args.input.firstName !== undefined) patient.firstName = args.input.firstName
            if(args.input.lastName !== undefined) patient.lastName = args.input.lastName

            return patient;
        },
        deletePatient: (_parent: unknown, args: PatientArgs): boolean => { 
            const index = fakePatients.findIndex((p) => p.id === args.id)
            if(index === -1) return false
            fakePatients.splice(index, 1);
            return true;
        }
    },
    Patient: {
        appointments: (patient: Patient): Appointment[] => {
            return fakeAppointments.filter((a) => a.patientId === patient.id)
        }
    }
};