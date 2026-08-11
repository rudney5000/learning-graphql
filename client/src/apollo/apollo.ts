import {
    ApolloClient,
    InMemoryCache,
    HttpLink
} from "@apollo/client";

const token = localStorage.getItem("access_token");

const httpLink = new HttpLink({
    uri: "http://localhost:4000/graphql",
    headers: {
        "Content-Type": "application/json",
        ...(token && {
            Authorization: `Bearer ${token}`,
        }),
    },
});

export const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});