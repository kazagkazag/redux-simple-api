const restify = require("restify");

function getUser(req, res, next) {
    res.send({
        name: "John",
        age: "24",
        role: "author",
        id: "1"
    });
    next();
}

function getPosts(req, res, next) {
    if (Math.random() > 0.5) {
        res.send({
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
        });
    } else {
        res.send(400, {
            reasons: [
                "Error while fetching data from DB.",
                "DB connection aborted."
            ]
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
