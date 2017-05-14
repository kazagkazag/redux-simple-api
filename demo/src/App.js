import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import { initializeDashboard } from "./actions";

class App extends Component {
    componentDidMount() {
        this.props.initializeDashboard();
    }

    render() {
        return (
            <main>
                <header>
                    <h1>User</h1>
                </header>
            </main>
        );
    }
}

App.propTypes = {
    initializeDashboard: PropTypes.func
};

function mapDispatchToProps(dispatch) {
    return {
        initializeDashboard: compose(dispatch, initializeDashboard)
    };
}

export default connect(
    null,
    mapDispatchToProps
)(App);
