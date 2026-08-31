const PATIENT_SERVICE_URL = "http://localhost:4001/graphql"

interface Patient {
    id: string
    firstName: string
    lastName: string
}

interface GetPatientResponse {
    data: {
        patient: Patient | null
    }
}

export async function getPatient(patientId: string): Promise<Patient | null> {

    const response = await fetch(PATIENT_SERVICE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
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
                id: patientId,
            }
        })
    })

    if (!response.ok) {
        throw new Error(
            `Patient Service returned ${response.status}`
        )
    }

    const result = await response.json() as GetPatientResponse

    return result.data.patient
}