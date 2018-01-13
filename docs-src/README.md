# Redux Simple Api

Redux Simple Api (**RSA**) is a library that helps handling requests
with redux. It is common problem for many developers - a lot of code
required to handle asynchronous actions. You can mitigate it using
`redux-thunk` and `redux-simple-api`.

`rsa` libary can be used with any redux-compatible view library, but it was
tested only with React.

## Installation

You can install `redux-simple-api` using npm:

```
npm install --save-dev redux-simple-api
```

## Usage

* If you don't know how to start, jump to [Example](/example) chapter to see real life code with simple
application.
* If you are looking for documentation details, read `Api` section below.

## API

1. [init](#1-initoptions-object) - initializes library
2. [buildSyncActionCreator](#2-buildsyncactioncreatortype-string-argnames-array-function) - creates regular action creator
3. [request](#3-request-options-object-function) - creates action creator that handles API calls
4. [buildReducers](#4-buildreducersoptions-object-object) - creates reducers that handles results of `request`s