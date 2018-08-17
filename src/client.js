import React from "react";
import { render } from "react-dom";
import App from "./App";
import config from "./config";

import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

const client = new ApolloClient({
  link: createHttpLink({
    uri: config.swapiGraphQLEndpoint
  }),
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__)
});

// no hydrate function in preact
render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept();
}
