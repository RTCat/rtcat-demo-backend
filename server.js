"use strict";

var restify = require('restify');
var server = restify.createServer();
var port = normalizePort(process.env.PORT || '8080');

var RTCat = require('realtimecat-node-sdk');
var config = require('./config.json');
var rtcat = new RTCat({apiKey: config.apikey, apiSecret: config.apisecret});
var sessions = [];

server.use(restify.queryParser());
server.use(restify.bodyParser());
restify.CORS.ALLOW_HEADERS.push('Access-Control-Allow-Origin');
server.use(restify.CORS());

server.get('/tokens/:sessionName', sessionMiddleware, tokenMiddleware);

function sessionMiddleware(req, res, next) {
    if (!sessions[req.params.sessionName]) {
        rtcat.createSession({label: req.params.sessionName}, function (err, resp) {
            if (err) return res.json(400, {error: err.message});
            sessions[req.params.sessionName] = resp.uuid;
            next();
        });
    } else {
        next();
    }
}

function tokenMiddleware(req, res, next) {
    var opts = Object.assign({},
        {session_id: sessions[req.params.sessionName]},
        req.query);

    rtcat.createToken(opts, function (err, resp) {
        if (err) {
            return res.json(400, {error: err.message})
        }
        return res.json(200, resp)
    });
}

server.listen(port, function () {
    console.log('rtcat-demo-web backend server listening at %s', server.url);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

