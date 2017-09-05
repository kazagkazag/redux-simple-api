const restify = require("restify");

function getUser(req, res, next) {
    res.send(200, {
        name: "John",
        age: "24",
        role: "author",
        id: "1"
    },{
        "session-token": "New token generated at " + new Date().getTime()
    });
    next();
}

function getPosts(req, res, next) {
    if (Math.random() > 0.5) {
        res.send(200, {
            posts: [
                {
                    id: 1,
                    title: "First post"
                },
                {
                    id: 2,
                    title: "Second post"
                }
            ]
        }, {
            "session-token": "New token generated at " + new Date().getTime()
        });
    } else {
        res.send(400, {
            reasons: [
                "Error while fetching data from DB.",
                "DB connection aborted."
            ]
        }, {
            "session-token": "New token generated at " + new Date().getTime()
        });
    }
    next();
}

function logoutUser(req, res, next) {
    res.send(200);
    next();
}

const server = restify.createServer();

server.get("api/user", getUser);
server.get("api/posts/user/:id", getPosts);
server.post("api/user/logout", logoutUser);

server.listen(8080);
