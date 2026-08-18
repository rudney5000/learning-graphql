import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    from
} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import {errorLink} from "./errorLink";

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("access_token")

    return {
        headers: {
            ...headers,
            authorization: token
                ? `Bearer ${token}`
                : ""
        }
    }
})

const httpLink = createHttpLink({
    uri: "http://localhost:4000/graphql",
});

export const apolloClient = new ApolloClient({
    link: from([
        errorLink,
        authLink,
        httpLink
    ]),
    cache: new InMemoryCache(),
});