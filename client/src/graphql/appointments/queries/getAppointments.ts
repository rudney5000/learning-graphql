import gql from "graphql-tag";
import {APPOINTMENT_FIELDS} from "../fragments/appointment";

export const GET_APPOINTMENTS = gql`
    query GetAppointments($page: Int, $limit: Int) {
        appointments(page: $page, limit: $limit) {
            items{
                ...AppointmentFields
            }
            total
            hasNext
        }
    }
    ${APPOINTMENT_FIELDS}
`;