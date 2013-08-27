var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var fs = require('fs');
var chokidar = require('chokidar');
var consolidate = require('consolidate');
var hogan_express = require('hogan-express');

module.exports = function (port) {
  var app = express();
  var server = http.createServer(app);
  var io = socketio.listen(server);

  var basedir = process.cwd();
  app.use('/file', express.static(basedir));
  app.use('/static', express.static(__dirname + '/static'));
  app.set('views', __dirname + '/views');
  app.engine('mustache', hogan_express);
  server.listen(port);

  function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  app.get('/', function (req, res) {
    res.status(200);
    fs.readdir(basedir, function (err, files) {
      res.render('index.mustache', {
        files: files.filter(function (file) {
          return endsWith(file, '.json');
        })
      });
    });
  });

  app.get('/plot/:filename', function (req, res) {
    res.sendfile(__dirname + '/views/plot.html');
  });

  io.sockets.on('connection', function (socket) {
    var watcher = null;

    socket.on('watch', function (data) {
      var filename = data.filename;
      fs.exists(filename, function (exists) {
        if (exists) {
          socket.emit('ready', { 'message': 'watching file' });
          // N.B.: Using the polling backend to chokidar here since the
          // non-polling (fs.watch) backend seems unstable. On my
          // machine, it was "losing track" of the file after a few
          // updates. (That's true of using fs.watch directly, too.)
          watcher = chokidar.watch(filename);
          watcher.on('change', function (path) {
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

    socket.on('disconnect', function () {
      if (watcher !== null) {
        watcher.close();
      }
    });
  });

  return app;
};
