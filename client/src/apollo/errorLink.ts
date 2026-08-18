import {ErrorLink} from "@apollo/client/link/error";

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(
    handler: () => void
){
    onUnauthorized = handler;
}

export const errorLink = new ErrorLink(
    ({ error, operation }) => {
        console.error(
            `[GraphQL error] ${operation.operationName}]`,
            error,
        )

        if (error.extensions?.code === "UNAUTHENTICATED") {
            onUnauthorized?.()
        }

        if (error.extensions?.code === "FORBIDDEN") {
            console.warn("Forbidden", operation.operationName);
        }
    }
)