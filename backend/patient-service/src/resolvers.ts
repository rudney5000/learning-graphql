import {Patient} from "./types";
import {GraphQLContext, requireRole} from "./auth";

const patients: Patient[] = [
    {
        id: "1",
        firstName: "Jean",
        lastName: "Mbala"
    },
    {
        id: "2",
        firstName: "Aline",
        lastName: "Kanku"
    }
]

interface PatientArgs {
    id: string;
}

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

let nextPatientId = 3

export const resolvers = {
    Query: {

        patients: (): Patient[] => {
            return patients;
        },

        patient: (
            _parent: unknown,
            args: PatientArgs,
            context: GraphQLContext
        ): Patient | undefined => {
            console.log("USER:", context.user);

            requireRole(context, ["DOCTOR", "NURSE"]);

            return patients.find(
                (patient) => patient.id === args.id
            );
        },
    },

    Mutation: {
        createPatient: (_patient: unknown, args: CreatePatientArgs): Patient => {
            const newPatient: Patient = {
                id: String(nextPatientId++),
                firstName: args.input.firstName,
                lastName: args.input.lastName
            };
            patients.push(newPatient);
            return newPatient;
        },

        updatePatient: (_patient: unknown, args: UpdatePatientArgs): Patient | null => {
            const patient = patients.find((p) => p.id === args.id);

            if (!patient) return null

            if (args.input.firstName !== undefined) patient.firstName = args.input.firstName
            if (args.input.lastName !== undefined) patient.lastName = args.input.lastName

            return patient;
        },

        deletePatient: (_parent: unknown, args: PatientArgs): boolean => {
            const index = patients.findIndex((p) => p.id === args.id)
            if (index === -1) return false
            patients.splice(index, 1);
            return true;
        },
    },

};