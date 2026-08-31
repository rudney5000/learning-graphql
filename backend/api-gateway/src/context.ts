export interface AuthUser {
    id: string;
    role: string;
}

export interface GraphQLContext {
    user: AuthUser | null;
}