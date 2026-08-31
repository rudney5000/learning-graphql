import {Appointment} from "./types.js";

const PATIENT_SERVICE_URL = "http://localhost:4001/graphql";
const APPOINTMENT_SERVICE_URL = "http://localhost:4002/graphql";

interface Patient {
    id: string;
    firstName: string;
    lastName: string;
}

interface PatientResponse {
    data: {
        patient: Patient | null;
    }
}

interface GraphQLResponse<T> {
    data?: T;
    errors?: Array<{
        message: string;
    }>
}

async function callGraphQL<T>(
    url: string,
    query: string,
    variables?: Record<string, unknown>
): Promise<T> {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    })

    const result = await response.json() as GraphQLResponse<T>

    if (result.errors?.length) {
        throw new Error(result.errors[0].message)
    }

    if(!result.data) {
        throw new Error("GraphQL service returned no data")
    }

    return result.data
}

async function getPatient(id: string): Promise<Patient| null> {
    const response = await fetch(PATIENT_SERVICE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: `
                    query GetPatient($id: ID!) {
                        patient(id: $id) {
                            id
                            firstName
                            lastName
                        }
                    }
                `,
            variables: {
                id
            }
        })
    });

    if(!response.ok) {
        throw new Error(
            `Patient service returned ${ response.status }`
        )
    }

    const result = await response.json() as PatientResponse

    return result.data.patient
}
export const resolvers = {
    Query: {
        patients: async() => {
            const data = await callGraphQL<{
                patients: Array<{
                    id: string;
                    firstName: string;
                    lastName: string;
                }>
            }>(
                PATIENT_SERVICE_URL,
                `
                    query {
                        patients {
                            id
                            firstName
                            lastName
                        }
                    }
                `
            )
            return data.patients
        },

        patient: async(
            _parent: unknown,
            args: { id: string }
        ): Promise<Patient | null> => {
            return getPatient(args.id)
        },

        appointments: async(
            _parent: unknown,
            args: { page?: number; limit?: number }
        ) => {
            const data = await callGraphQL<{
                appointments: {
                    items: Array<{
                        id: string;
                        patientId: string;
                        scheduledAt: string;
                        reason: string;
                    }>;
                    total: number;
                    hasNext: boolean;
                }
            }>(
                APPOINTMENT_SERVICE_URL,
                `
                    query GetAppointments(
                         $page: Int
                         $limit: Int
                    ){
                        appointments(
                             page: $page
                             limit: $limit
                        ) {
                            items {
                                id
                                patientId
                                scheduledAt
                                reason
                            }
                            total
                            hasNext
                        }
                    }
                `,
                {
                    page: args.page,
                    limit: args.limit,
                }
            )

            return data.appointments
        },

        appointment: async(
            _parent: unknown,
            args: { id: string }
        ) => {
            const data = await callGraphQL<{
                appointment: {
                    id: string;
                    patientId: string;
                    scheduledAt: string;
                    reason: string;
                } | null
            }>(
                APPOINTMENT_SERVICE_URL,
                `
                    query GetAppointment($id: ID!) {
                        appointment(id: $id) {
                            id
                            patientId
                            scheduledAt
                            reason
                        }
                    }
                `,
                {
                    id: args.id,
                }
            )

            return data.appointment
        }
    },

    Appointment: {
        patient: async (appointment: Appointment) => {
            return getPatient(appointment.patientId)
        }
    }
}