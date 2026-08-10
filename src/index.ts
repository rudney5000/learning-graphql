import express from 'express'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4';
import cors from "cors";
import jwt from "jsonwebtoken";
import { resolvers } from './resolvers'
import { typeDefs } from './schema'
import {GraphQLContext, Payload} from './types';
import {JWT_SECRET} from "./auth";

const app = express()
const PORT = 4000

const server = new ApolloServer({
    typeDefs,
    resolvers
})

await server.start();

app.use(
    '/graphql',
    cors({
        origin: 'http://localhost:5173',
    }),
    express.json(),
    expressMiddleware(server, {
        context: async ({ req }): Promise<GraphQLContext> => {
            console.log("HEADERS:", req.headers);

            const authorization = req.headers.authorization

            if (!authorization) {
                return {
                    user: null,
                }
            }

            console.log("Authorization:", authorization)

            const [type, token] = authorization.split(" ")
            if(type != "Bearer" || !token) {
                return{
                    user: null
                }

            }

            const payload: Payload = jwt.verify(token, JWT_SECRET) as Payload;
            console.log("payload:", payload )

            return {
                user: {
                    id: payload.sub,
                    role: payload.role
                }
            }
        }
    })
);

app.listen(PORT, () => {
    console.log(`🚀 GraphQL prêt sur http://localhost:${PORT}/graphql`);
});