var http = require('http')
var express = require('express')

var port = 3000
var app = express()
var router = require('./router/router')(app)
var upload = require('express-fileupload')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
  console.log('connected to mongod server')
})

mongoose.connect('mongodb://192.168.1.123/reaction_tagging')

app.use(upload())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)

app.use('/videos', express.static(__dirname + '/static/videos'))

var httpServer = http.createServer(app).listen(port, function() {
	console.log('http server listening on port ' + port)
})

var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', function(socket) {
  socket.emit('connected', 'Hello, client!')
})