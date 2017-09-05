import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
/*
    Let's start. You have to include script with initialization
    of the redux-simple-api before your store is created.

    Because store uses reducers to build tree, and reducers
    are created by redux-simple-api, they required init() to be
    called before the are created (because some basic configuration
    is done in init() function).

    Go to api.js to see how redux-simple-api is initialized.
*/
import "./api";
import configureStore from "./store";
import App from "./App";

ReactDOM.render(
    <Provider store={configureStore()}>
        <App />
    </Provider>,
    document.getElementById("root")
);
