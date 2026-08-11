import {
    ApolloClient,
    InMemoryCache,
    HttpLink
} from "@apollo/client";

const httpLink = new HttpLink({
    uri: "http://localhost:4000/graphql",
    // headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`
    // }
});

export const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});