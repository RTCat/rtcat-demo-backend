"use strict";

var restify = require('restify');
var server = restify.createServer();
var port = normalizePort(process.env.PORT || '8080');
var RTCat = require('realtimecat-node-sdk');
var config = require('./config.json');
var rtcat = new RTCat({apiKey: config.apikey, apiSecret: config.apisecret});

server.use(restify.queryParser());
server.use(restify.bodyParser());
restify.CORS.ALLOW_HEADERS.push('Access-Control-Allow-Origin');
server.use(restify.CORS());

var sessionId = null;

server.get('/sessions', function (req, res, next) {

    rtcat.createSession({label: 'demo'}, function (err, resp) {
        if (err) {
            return res.json(400, {error: err.message})
        }
        return res.json(200, resp)
    });

});

server.get('/tokens', function (req, res, next) {

    if (!sessionId) {
        rtcat.createSession({label: 'demo'}, function (err, resp) {
            if (err) return res.json(400, {error: err.message});
            sessionId = resp.uuid;
            var opts = {
                session_id: sessionId
            };

            rtcat.createToken(opts, function (err, resp) {
                if (err) {
                    return res.json(400, {error: err.message})
                }
                return res.json(200, resp)
            });
        });
    }

    var opts = {
        session_id: sessionId
    };

    rtcat.createToken(opts, function (err, resp) {
        if (err) {
            return res.json(400, {error: err.message})
        }
        return res.json(200, resp)
    });
});


server.get('/tokens/:sessionId', function (req, res, next) {
    var opts = {
        session_id: req.params.sessionId
    };

    rtcat.createToken(opts, function (err, resp) {
        if (err) {
            return res.json(400, {error: err.message})
        }
        return res.json(200, resp)
    });
});

server.listen(port, function () {
    console.log('%s listening at %s', server.name, server.url);
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
