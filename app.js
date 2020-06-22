var app = require('express')();
app.set('port', 3000);
var server = require('http').createServer(app);
// http server를 socket.io server upgrade 함
var io = require('socket.io').listen(server);

// localhost:3000으로 서버에 접속하면 클라이언트에게 index.html 전송
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

//connection이 수립되면 event handler function 인자로 socket이 들어옴
io.on('connection', (socket) => {

    socket.on('login', (data) => { // 접속한 클라이언트의 정보가 수신되었을 경우
        console.log(`Client logged-in:\n name: ${data.name}, userId: ${data.userid}`);

        // 클라이언트 정보 저장
        socket.name = data.name;
        socket.userid = data.userid;

        io.emit('login', data.name); // 본인을 포함한 모든 클라이언트에게 전송
    });

    socket.on('chat', (data) => { // 클라이언트의 메시지가 수신된 경우
        console.log(`Message from ${socket.name}: ${data.msg}`);

        let msg = {
            form: {
                name: socket.name,
                userid: socket.userid
            },
            msg: data.msg
        };

        // socket.broadcast.emit('chat', msg); // 본인을 제외한 모든 클라이언트에게 전송
        io.emit('chat', msg);
    });

    socket.on('forceDisconnect', () => {
        socket.disconnect();
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.name}`);
    });
});

server.listen(app.get('port'), () => {
    console.log('Socket IO server Listening on port 3000');
})