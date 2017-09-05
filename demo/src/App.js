import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import { initializeDashboard, clearUserPosts } from "./actions";

class App extends Component {
    componentDidMount() {
        this.props.initializeDashboard(1);
    }

    renderLoader() {
        return this.props.loading ? <p>Loading...</p> : null;
    }

    renderError() {
        return this.props.failed ? (
            <div>
                <p>Ups! Errors:</p> 
                {
                    this.props.errors.map(error => {
                        return <p key={error}>{error}</p>
                    })
                }
            </div>
        ) : null;
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
                <button onClick={this.props.clearUserPosts}>Clear posts</button>
            </main>
        ) : <p>No posts to display</p>;
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
        initializeDashboard: compose(dispatch, initializeDashboard),
        clearUserPosts: compose(dispatch, clearUserPosts)
    };
}

function mapStateToProps(state) {
    return {
        user: state.user.data,
        posts: state.posts.data,
        loading: state.posts.pending || state.user.pending,
        failed: state.posts.error !== null || state.user.error !== null,
        errors: state.posts.error || state.user.error
            ? (state.posts.error || []).concat(state.user.error || [])
            : []
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
