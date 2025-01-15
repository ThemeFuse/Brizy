import {
  ApolloClient as ApolloClientClass,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

export type ApolloClient = ApolloClientClass<NormalizedCacheObject>;

export interface CreateApolloClientProps {
  uri: string;
  authorization?: string;
}

export function createApolloClient({
  uri,
  authorization
}: CreateApolloClientProps): ApolloClient {
  let link = createHttpLink({
    uri: uri,
    credentials: "include"
  });

  if (authorization) {
    const authLink = setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          authorization
        }
      };
    });
    link = authLink.concat(link);
  }

  return new ApolloClientClass({
    cache: new InMemoryCache(),
    link,
    connectToDevTools: process.env.NODE_ENV === "development",
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "no-cache"
      },
      query: {
        fetchPolicy: "no-cache"
      }
    }
  });
}

let connection: ApolloClient | undefined = undefined;

export const getConnection = ({
  uri,
  authorization
}: CreateApolloClientProps): ApolloClient =>
  connection ??
  (connection = createApolloClient({
    uri,
    authorization
  }));
