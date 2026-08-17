import jwt from "jsonwebtoken";
import type {
    Appointment,
    GraphQLContext,
    Patient,
    User
} from "./types";
import {
    JWT_SECRET,
    requireRole
} from "./auth";

const fakePatients: Patient[] = [
    { id: "1", firstName: "Jean", "lastName": "Mbala"},
    { id: "2", firstName: "Aline", "lastName": "Kanku"}
]

const fakeAppointments: Appointment[] = [
    { id: "a1", patientId: "1", scheduledAt: '2026-08-10T09:00:00Z', reason: 'Controle'},
    { id: "a2", patientId: "2", scheduledAt: '2026-09-01T14:00:00Z', reason: 'Suivi'},
    { id: "a3", patientId: "2", scheduledAt: '2026-08-15T10:00:00Z', reason: 'Vaccin'}
]

const fakeUsers = [
    {
        id: "user-1",
        username: "doctor",
        password: "1234",
        role: "DOCTOR",
    }
]

interface LoginArgs {
    username: string;
    password: string;
}

interface PatientArgs {
    id: string;
}

interface AppointmentArgs {
    id: string;
}

interface CreatePatientArgs {
    input: {
        firstName: string;
        lastName: string;
    }
}

interface CreateAppointmentArgs {
    input: {
        patientId: string;
        scheduledAt: string;
        reason: string;
    }
}

interface UpdatePatientArgs {
    id: string;
    input: {
        firstName?: string;
        lastName?: string;
    }
}

interface UpdateAppointmentArgs {
    id: string;
    input: {
        patientId?: string;
        scheduledAt?: string;
        reason?: string;
    }
}

let nextPatientId = 3
let nextAppointmentId = 4

export const resolvers = {
    Query: {
        me: (
            _parent: unknown,
            _args: unknown,
            context: GraphQLContext,
        ): User | null => {
            return context.user ?? null;
        },

        patients: (): Patient[] => {
            return fakePatients;
        },
        appointments: (): Appointment[] => {
            return fakeAppointments;
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

        appointment: (
            _parent: unknown,
            args: AppointmentArgs,
            context: GraphQLContext
        ): Appointment | undefined => {
            requireRole(context, "DOCTOR");

            return fakeAppointments.find(
                (appointment) => appointment.id === args.id
            )
        }
    },

    Mutation: {
        login: (
            _parent: unknown,
            args: LoginArgs,
        ) => {
            const user = fakeUsers.find(
                (user) =>
                    user.username === args.username &&
                    user.password === args.password
            );

            if (!user) {
                throw new Error("Invalid credentials.");
            }

            const token = jwt.sign(
                {
                    sub: user.id,
                    role: user.role,
                },
                JWT_SECRET,
                {
                    expiresIn: "1n"
                }
            );

            return {
                token,
                user: {
                    id: user.id,
                    role: user.role,
                }
            }
        },

        createPatient: (_patient: unknown, args: CreatePatientArgs): Patient => {
            const newPatient: Patient = {
                id: String(nextPatientId++),
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
        },

        createAppointment: (_appointment: unknown, args: CreateAppointmentArgs): Appointment => {
            const newAppointment: Appointment = {
                id: `a${nextAppointmentId++}`,
                patientId: args.input.patientId,
                scheduledAt: args.input.scheduledAt,
                reason: args.input.reason
            };

            fakeAppointments.push(newAppointment);
            return newAppointment;
        },

        updateAppointment: (_patient: unknown, args: UpdateAppointmentArgs): Appointment | null => {
            const appointment = fakeAppointments.find((appointment) => appointment.id === args.id);

            if(!appointment) return null

            if(args.input.patientId !== undefined) appointment.patientId = args.input.patientId;
            if(args.input.scheduledAt !== undefined) appointment.scheduledAt = args.input.scheduledAt
            if(args.input.reason !== undefined) appointment.reason = args.input.reason;

            return appointment;
        },

        deleteAppointment: (_parent: unknown, args: AppointmentArgs): boolean => {
            const index = fakeAppointments.findIndex((appointment) => appointment.id === args.id);
            if(index === -1) return false
            fakeAppointments.splice(index, 1);
            return true;
        }
    },

    Patient: {
        appointments: (patient: Patient): Appointment[] => {
            return fakeAppointments.filter((a) => a.patientId === patient.id)
        }
    }
};