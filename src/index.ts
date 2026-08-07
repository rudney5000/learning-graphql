import express from 'express'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4';
import { resolvers } from './resolvers'
import { typeDefs } from './schema'

const app = express()
const PORT = 4000

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
    console.log(`🚀 GraphQL prêt sur http://localhost:${PORT}/graphql`);
});