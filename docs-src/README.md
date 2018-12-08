# Redux Simple Api

Redux Simple Api (**RSA**) is a library that helps handling requests
with redux. It is common problem for many developers - a lot of code
required to handle asynchronous actions. You can mitigate it using
`redux-thunk` and `redux-simple-api`.

`rsa` libary can be used with any redux-compatible view library, but it was
tested only with React.

## The issue

Main issue with redux is amount of code you have to write to handle simple request.
If you wan't to fetch any data from your backend using redux and redux-thunk, you have to
do several things:
1. Create action types for three actions: action dispatched when request is sending, 
action after successful response and action dispatched when something went wrong.
2. Create action creators and pretty complicated request action.
3. Create reducers, that will store information about pending request and possible responses.
Moreover, you have to create many actions, because probably your app will communicate
with backend a lot. That's a lot of duplication...

## The solution

One simple solution for that issue is standarization. `RSA` provide consistent way to handle
all requests in entire application. You can build complicated chain of actions and collect data from them
with ease. Every reducer will work in the same way, every request will dispatch the same set of actions.
No duplication, no place for errors.

## Installation

You can install `redux-simple-api` using npm:

```
npm install --save-dev redux-simple-api
```

**Make sure that redux and redux-thunk are also installed.**

## Usage

* If you don't know how to start, jump to [Example](/DEMOAPP.md) chapter to see real life code with simple
application.
* If you are looking for documentation details, read `Api` section below.