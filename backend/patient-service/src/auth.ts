import { GraphQLError } from "graphql";

export type Role = "DOCTOR" | "NURSE" | "ADMIN";

export interface GraphQLContext {
    user?: {
        id: string;
        role: Role;
    };
}

export function requireRole(
    context: GraphQLContext,
    allowedRoles: Role[]
) {
    if (!context.user) {
        throw new GraphQLError("Unauthenticated", {
            extensions: {
                code: "UNAUTHENTICATED",
            },
        });
    }

    if (!allowedRoles.includes(context.user.role)) {
        throw new GraphQLError("Forbidden", {
            extensions: {
                code: "FORBIDDEN",
            },
        });
    }

    return context.user;
}