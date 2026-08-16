import gql from "graphql-tag";
import {APPOINTMENT_FIELDS} from "../fragments/appointment";

export const GET_APPOINTMENTS = gql`
    query GetAppointments {
        appointments {
            ...AppointmentFields
        }
    }
    ${APPOINTMENT_FIELDS}
`;