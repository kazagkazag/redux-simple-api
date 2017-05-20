import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import { initializeDashboard } from "./actions";

class App extends Component {
    componentDidMount() {
        this.props.initializeDashboard(1);
    }

    renderLoader() {
        return this.props.loading ? <p>Loading...</p> : null;
    }

    renderError() {
        return this.props.failed ? <p>Ups! Errors!</p> : null;
    }

    renderApp() {
        const {
            user,
            posts
        } = this.props;

        return user && posts ? (
            <main>
                <header>
                    <h1>User {user.name} (as {user.role})</h1>
                </header>
                <ul>
                    {posts.map(post => {
                        return (
                            <li key={post.id}>
                                {post.title}
                            </li>
                        );
                    })}
                </ul>
            </main>
        ) : null;
    }

    render() {
        return this.renderLoader()
            || this.renderError()
            || this.renderApp();
    }
}

App.propTypes = {
    initializeDashboard: PropTypes.func,
    user: PropTypes.object,
    posts: PropTypes.array,
    loading: PropTypes.bool,
    failed: PropTypes.bool
};

function mapDispatchToProps(dispatch) {
    return {
        initializeDashboard: compose(dispatch, initializeDashboard)
    };
}

function mapStateToProps(state) {
    return {
        user: state.user.data,
        posts: state.posts.data,
        loading: state.posts.pending || state.user.pending,
        failed: state.posts.error !== null || state.user.error !== null
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
