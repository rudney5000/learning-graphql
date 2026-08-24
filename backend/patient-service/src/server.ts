import express from 'express';
import { ApolloServer } from '@apollo/server'
import {typeDefs} from "./schema";
import {resolvers} from "./resolvers";
import { expressMiddleware } from "@as-integrations/express4";

const app = express()
const PORT = 4001

const server = new ApolloServer({
    typeDefs,
    resolvers
})

await server.start();

app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server)
);

app.listen(PORT, () => {
    console.log(`🚀 PATIENT SERVICE prêt sur http://localhost:${PORT}/graphql`);
});