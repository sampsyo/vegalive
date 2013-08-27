var socket = io.connect('/');
var plotFile;
function updatePlot() {
  vg.parse.spec('/file/' + plotFile, function (chart) {
    chart({ el: '#vis' }).update();
  });
}
socket.on('connect', function () {
  var pathParts = window.location.pathname.split('/');
  plotFile = pathParts[pathParts.length - 1];
  socket.emit('watch', { filename: plotFile });
});
socket.on('change', function (data) {
  var filename = data.filename;
  console.log('file changed: ' + filename);
  if (filename === plotFile) {
    // Update the whole plot.
    console.log('updating plot');
    updatePlot();
  } else {
    console.log('unknown file; doing nothing');
  }
});
socket.on('error', function (data) {
  console.log('error: ' + data.message);
  $('#log').append(data.message + '<br>');
});
socket.on('ready', function (data) {
  // Draw for the first time.
  console.log('drawing initial plot');
  updatePlot();
});
