"use strict";

var io = require('socket.io-client');
var server = require('../server');
var client;

var socketURL = 'http://localhost:8080';
var options = {
    transports: ['websocket']
    , forceNew: true
    , reconnection: false
};


describe("socket.io test", function () {

    beforeEach(function (done) {

        // connect io clients
        client = io(socketURL, options);

        // finish beforeEach setup
        done()
    });

    afterEach(function (done) {

        // disconnect io clients after each test
        client.disconnect();
        done()
    });

    describe('get token', function () {
        it('Should return waiting or token', function (done) {
            this.timeout(5000);

            client.on('connect', function (data) {
                console.log('connected');
                client.emit('new message', JSON.stringify({'eventName': 'in'}));
                done();
            });

            //client.on('new message', function (data) {
            //    if (data.eventName === 'waiting') {
            //        console.log('waiting');
            //    } else if (data.eventName === 'get_token') {
            //        console.log(data.token)
            //    }
            //    /* If this client doesn't disconnect it will interfere
            //     with the next test */
            //    client.disconnect();
            //    done();
            //});

        })
    });
});
