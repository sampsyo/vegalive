var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var fs = require('fs');
var chokidar = require('chokidar');

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
                // N.B.: Using the polling backend to chokidar here since the
                // non-polling (fs.watch) backend seems unstable. On my
                // machine, it was "losing track" of the file after a few
                // updates. (That's true of using fs.watch directly, too.)
                var watcher = chokidar.watch(filename);
                watcher.on('change', function (path) {
                    console.log('watcher change ' + path);
                    socket.emit('change', { filename: filename });
                });
                watcher.on('error', function (error) {
                    console.log('watcher error: ' + error);
                    socket.emit('error', { 'message': 'watcher error' });
                });
            } else {
                socket.emit('error', { 'message': 'no such file' });
            }
        });
    });
});
