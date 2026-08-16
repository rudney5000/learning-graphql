import gql from "graphql-tag";
import {APPOINTMENT_FIELDS} from "../fragments/appointment";

export const CREATE_APPOINTMENT = gql` 
    mutation CreateAppointment($input: CreateAppointmentInput!) { 
        createAppointment(input: $input) { ...AppointmentFields } 
    }
    ${APPOINTMENT_FIELDS}
`;