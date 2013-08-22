var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var fs = require('fs');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

app.use('/file', express.static(process.cwd()));
server.listen(4915);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/views/index.html');
});

app.get('/plot/:filename', function (req, res) {
    res.sendfile(__dirname + '/views/plot.html');
});

io.sockets.on('connection', function (socket) {
    socket.on('watch', function (data) {
        var filename = data.filename;
        fs.exists(filename, function (exists) {
            if (exists) {
                socket.emit('ready', { 'message': 'watching file' });
                fs.watch(filename, function (e, f) {
                    socket.emit('change', { filename: filename });
                });
            } else {
                socket.emit('error', { 'message': 'no such file' });
            }
        });
    });
});
