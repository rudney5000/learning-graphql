import type {
    Appointment,
} from "./types";

const appointments: Appointment[] = [
    {
        id: "a1",
        patientId: "1",
        scheduledAt: "2026-08-10T09:00:00Z",
        reason: "Controle"
    },
    {
        id: "a2",
        patientId: "2",
        scheduledAt: "2026-09-01T14:00:00Z",
        reason: "Suivi"
    },
    {
        id: "a3",
        patientId: "2",
        scheduledAt: "2026-08-15T10:00:00Z",
        reason: "Vaccin"
    }
];

interface AppointmentArgs {
    id: string;
}

interface AppointmentsArgs {
    page?: number;
    limit?: number;
}

interface CreateAppointmentArgs {
    input: {
        patientId: string;
        scheduledAt: string;
        reason: string;
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

let nextAppointmentId = 4

export const resolvers = {
    Query: {
        appointments: (
            _parent: unknown,
            args: AppointmentsArgs
        )=> {
            const page = args.page ?? 1
            const limit = args.limit ?? 5

            const start = (page - 1) * limit
            const items = appointments.slice(start, start + limit)
            return {
                items,
                total: appointments.length,
                hasNext: start + limit < appointments.length,
            };
        },

        appointment: (
            _parent: unknown,
            args: AppointmentArgs,
        ): Appointment | undefined => {

            return appointments.find(
                (appointment) => appointment.id === args.id
            )
        }
    },

    Mutation: {
        createAppointment: (_appointment: unknown, args: CreateAppointmentArgs): Appointment => {
            const newAppointment: Appointment = {
                id: `a${nextAppointmentId++}`,
                patientId: args.input.patientId,
                scheduledAt: args.input.scheduledAt,
                reason: args.input.reason
            };

            appointments.push(newAppointment);
            return newAppointment;
        },

        updateAppointment: (_patient: unknown, args: UpdateAppointmentArgs): Appointment | null => {
            const appointment = appointments.find((appointment) => appointment.id === args.id);

            if(!appointment) return null

            if (args.input.patientId !== undefined) {
                appointment.patientId = args.input.patientId;
            }
            if(args.input.scheduledAt !== undefined) appointment.scheduledAt = args.input.scheduledAt
            if(args.input.reason !== undefined) appointment.reason = args.input.reason;

            return appointment;
        },

        deleteAppointment: (_parent: unknown, args: AppointmentArgs): boolean => {
            const index = appointments.findIndex((appointment) => appointment.id === args.id);
            if(index === -1) return false
            appointments.splice(index, 1);
            return true;
        }
    },
};