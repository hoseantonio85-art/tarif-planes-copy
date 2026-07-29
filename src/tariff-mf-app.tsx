import React from "react";
import ReactDOMClient from "react-dom/client";
import singleSpaReact from "single-spa-react";
import { Row, Text } from "@sber-orm/ui-kit";
import Root from "@/providers";

const lifecycle = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: Root,
  errorBoundary(error: Error) {
    return (
      <Row align="middle" justify="center">
        <Text>{error.message}</Text>
      </Row>
    );
  },
});

export const { bootstrap, mount, unmount } = lifecycle;
