import express from "express";
import {ApolloServer} from "@apollo/server";
import cors from "cors";
import {GraphQLContext} from "./context";
import {typeDefs} from "./schema";
import {resolvers} from "./resolvers";
import { expressMiddleware } from "@as-integrations/express4";

const app = express()

const PORT = 4000

const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
})

await server.start()

app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
        context: async () => ({
            user: null
        })
    })
)

app.listen(PORT, () => {
    console.log(`API GATEWAY Server started on port: ${PORT}/graphql`);
})