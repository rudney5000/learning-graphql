import gql from "graphql-tag";
import {PATIENT_FIELDS} from "../fragments/patient";
import {APPOINTMENT_FIELDS} from "../../appointments/fragments/appointment";

export const GET_PATIENT = gql`
    query GetPatient($id: ID!) {
        patient(id: $id) {
            ...PatientFields
            appointments {
                ...AppointmentFields
            }
        }
    }
    ${PATIENT_FIELDS}
    ${APPOINTMENT_FIELDS}
`;