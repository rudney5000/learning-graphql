import jwt from "jsonwebtoken";
import {GraphQLContext, UserRole} from "./types";

export const JWT_SECRET = "my-super-secret";

export const requireAuth = (context: GraphQLContext) => {
    if (!context.user) {
        throw new Error("Unauthorized");
    }

    return context.user;
}

export const requireRole = (
    context: GraphQLContext,
    role: UserRole
) => {
    const user = context.user;
    if (user.role !== role) {
        throw new Error("Forbidden");
    }
    return user;
}

export const payload = {
    sub: "user-1",
    role: "DOCTOR"
};

const token = jwt.sign(payload, JWT_SECRET)
const decoded = jwt.verify(token, JWT_SECRET)

console.log("JWT:", token);