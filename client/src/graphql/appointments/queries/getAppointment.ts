import gql from "graphql-tag";
import {APPOINTMENT_FIELDS} from "../fragments/appointment";

export const GET_APPOINTMENT = gql`
    query GetAppointment($id: ID!) {
        appointment(id: $id) {
            ...AppointmentFields
        }
    }
    ${APPOINTMENT_FIELDS}
`;