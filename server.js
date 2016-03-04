"use strict";

var restify = require('restify');
var server = restify.createServer();
var socketio = require('socket.io');
var io = socketio.listen(server.server);
var port = normalizePort(process.env.PORT || '8080');
var uuid = require('node-uuid');
var EventEmitter = require('events');
var util = require('util');

var RTCat = require('realtimecat-node-sdk');
var config = require('./config.json');
var rtcat = new RTCat({apiKey: config.apikey, apiSecret: config.apisecret});
var sessions = [];

server.use(restify.queryParser());
server.use(restify.bodyParser());
restify.CORS.ALLOW_HEADERS.push('Access-Control-Allow-Origin');
server.use(restify.CORS());

server.get('/tokens/:sessionName', function (req, res, next) {

    if (!sessions[req.params.sessionName]) {
        rtcat.createSession({label: req.params.sessionName}, function (err, resp) {
            if (err) return res.json(400, {error: err.message});
            sessions[req.params.sessionName] = resp.uuid;
            var opts = {
                session_id: sessions[req.params.sessionName]
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
        session_id: sessions[req.params.sessionName]
    };

    rtcat.createToken(opts, function (err, resp) {
        if (err) {
            return res.json(400, {error: err.message})
        }
        return res.json(200, resp)
    });

});

server.get('/sessions', function (req, res, next) {

    rtcat.createSession({label: 'demo'}, function (err, resp) {
        if (err) {
            return res.json(400, {error: err.message})
        }
        return res.json(200, resp)
    });

});

server.get('/:sessionId/tokens', function (req, res, next) {

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

// ################### Android 1v1 demo backend ####################### //

function MyEventHandler() {
    EventEmitter.call(this);
}

util.inherits(MyEventHandler, EventEmitter);

var sockets = [];
var myEvent = new MyEventHandler();

myEvent.on("in", function (data, soc) {

    console.log("here are " + sockets.length);

    if (sockets.length > 0) {
        var cp_soc = sockets[0];
        sockets.shift();
        rtcat.createSession({label: 'demo'}, function (err, resp) {

            var sessionId = resp.uuid;
            var json = {eventName: "get_token"};
            var opts = {
                session_id: sessionId
            };

            rtcat.createToken(opts, function (err, resp) {
                var token = resp.uuid;
                console.log(token);
                json.token = token;
                cp_soc.emit("new message", json);
            });

            rtcat.createToken(opts, function (err, resp) {
                var token = resp.uuid;
                console.log(token);
                json.token = token;
                soc.emit("new message", json);
            });


        });

    } else {
        var json = {eventName: "waiting"};
        soc.emit("new message", json);
        sockets.push(soc);
    }

});

io.on('connection', function (socket) {

    socket.id = uuid.v4();

    socket.on("new message", function (message) {
        var json = JSON.parse(message);
        var eventName = json.eventName;
        var content = json.content;
        console.log(eventName, content);
        myEvent.emit(eventName, content, socket);
    });

    socket.on('disconnect', function () {
        arrayRemove(sockets, socket);
        console.log('a user leave');
    });

    console.log('a user connected');

});

server.listen(port, function () {
    console.log('socket.io server listening at %s', server.url);
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

function arrayRemove(array, value) {
    var index = array.indexOf(value);
    if (index > -1) {
        array.splice(index, 1);
    }
}

