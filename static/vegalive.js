var socket = io.connect('/');
var plotFile;
var dataFiles = [];

vg.config.baseURL = '/file/';

socket.on('connect', function () {
  var pathParts = window.location.pathname.split('/');
  plotFile = pathParts[pathParts.length - 1];
  socket.emit('watch', { filename: plotFile });
});

socket.on('change', function (data) {
  var filename = data.filename;
  console.log('file changed: ' + filename);
  if (filename === plotFile || _.contains(dataFiles, filename)) {
    // Update the whole plot.
    // FIXME update data selectively?
    console.log('updating plot');
    updatePlot();
  } else {
    console.log('unknown file; doing nothing');
  }
});

socket.on('error', function (data) {
  console.log('error: ' + data.message);
  d3.select('#log').append('p').text(data.message);
});

socket.on('ready', function (data) {
  // Draw for the first time.
  console.log('drawing initial plot');
  updatePlot();
});

function startsWith(str, prefix) {
  return str.indexOf(prefix) === 0;
}

function isAbsolute(url) {
  // So hacky.
  return startsWith(url, "http:") || startsWith(url, "https:")
      || startsWith(url, "//");
}

function updatePlot() {
  d3.json('/file/' + plotFile, function (error, json) {
    // Watch any new data files.
    var newDataFiles = [];
    if (json.data) {
      _.each(json.data, function(data) {
        if (typeof(data.url) === "string" && !isAbsolute(data.url)) {
          newDataFiles.push(data.url);
        }
      });
    }
    _.each(_.difference(newDataFiles, dataFiles), function (url) {
      console.log('watching data file ' + url);
      socket.emit('watch', { filename: url });
    });
    // FIXME unwatch removed files?
    dataFiles = newDataFiles;

    // Display the new plot.
    vg.parse.spec(json, function (chart) {
      chart({ el: '#vis' }).update();
    });
  });
}
