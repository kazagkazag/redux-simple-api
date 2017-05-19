import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import { initializeDashboard } from "./actions";

class App extends Component {
    componentDidMount() {
        this.props.initializeDashboard(1);
    }

    render() {
        const {
            user,
            posts
        } = this.props;

        return user && posts ? (
            <main>
                <header>
                    <h1>User {this.props.user.name}</h1>
                </header>
            </main>
        ) : <p>Loading...</p>;
    }
}

App.propTypes = {
    initializeDashboard: PropTypes.func,
    user: PropTypes.object,
    posts: PropTypes.object
};

function mapDispatchToProps(dispatch) {
    return {
        initializeDashboard: compose(dispatch, initializeDashboard)
    };
}

function mapStateToProps(state) {
    return {
        user: state.user.data,
        posts: state.posts.data
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
