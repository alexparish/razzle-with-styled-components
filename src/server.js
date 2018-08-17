import App from "./App";
import React from "react";
import express from "express";
import fetch from "node-fetch";
import config from "./config";

import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import {
  ApolloProvider,
  getDataFromTree,
  renderToStringWithData
} from "react-apollo";

// Import the StyledComponents SSR util
import { ServerStyleSheet } from "styled-components";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();

server
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get("/*", render);

async function render(req, res) {
  // Create the server side style sheet
  const sheet = new ServerStyleSheet();
  // When the app is rendered collect the styles that are used inside it

  const client = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: config.swapiGraphQLEndpoint,
      fetch: fetch,
      opts: {
        credentials: "same-origin",
        headers: req.headers
      }
    }),
    cache: new InMemoryCache()
  });

  const app = sheet.collectStyles(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );

  const markup = await renderToStringWithData(sheet.collectStyles(app));
  // Generate all the style tags so they can be rendered into the page
  const styleTags = sheet.getStyleTags();

  const initialState = JSON.stringify(client.extract()).replace(
    /</g,
    "\\u003c"
  );

  res.send(
    `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
          assets.client.css
            ? `<link rel="stylesheet" href="${assets.client.css}">`
            : ""
        }
        ${
          process.env.NODE_ENV === "production"
            ? `<script src="${assets.client.js}" defer></script>`
            : `<script src="${assets.client.js}" defer crossorigin></script>`
        }
        <script>window.__APOLLO_STATE__ = ${initialState}</script>
        <!-- Render the style tags gathered from the components into the DOM -->
        ${styleTags}
    </head>
    <body>
        <div id="root">${markup}</div>
    </body>
</html>`
  );
}

export default server;
