import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    ServerError,
    CombinedGraphQLErrors
} from "@apollo/client";
import {
    SetContextLink
} from "@apollo/client/link/context";
import {
    ErrorLink
} from "@apollo/client/link/error";
import {
    clearAccessToken,
    getAccessToken
} from "../store/modules/auth";
import router from "../router";

const authLink = new SetContextLink((prevContext, operation) => {
    const token = getAccessToken()

    return {
        headers: {
            ...prevContext.headers,
            authorization: token
                ? `Bearer ${token}`
                : ""
        }
    }
})

const errorLink = new ErrorLink(({ error, operation }) => {
    console.log(
        `[Apollo Error] ${operation.operationName}`,
        error
    )

    if (ServerError.is(error) && error.statusCode === 401) {
        console.log("JWT expired or unauthorized")

        clearAccessToken()

        if (router.currentRoute.path !== "/login") {
            router.push("/login")
        }
    }

    if(CombinedGraphQLErrors.is(error)) {
        error.errors.forEach((graphQLError) => {
            console.error(
                `[GraphQL error] ${operation.operationName}`,
                graphQLError.message,
                graphQLError.extensions
            )
        })
    }
})

const httpLink = createHttpLink({
    uri: "http://localhost:4000/graphql",
});

const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                appointments: {
                    keyArgs: false,

                    merge(existing, incoming){
                        return {
                            ...incoming,

                            items: [
                                ...(existing?.items ?? []),
                                ...incoming.items
                            ]
                        }
                    }
                }
            }
        }
    }
});

export const apolloClient = new ApolloClient({
    link: errorLink.concat(authLink).concat(httpLink),
    cache,
});