const express = require("express");
const app = express();
const server = app.listen(8080, function(){
    console.log("Listening on 8080");
});
const io = require('socket.io')(server);

app.use(express.static(__dirname + "/static"));
app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs');

let notifications = [];

// TODO: Render index.ejs page for USER
app.get("/", (request, response) => {
    response.render("index");
});

io.on('connection', (socket) => {
    console.log(socket.id);

    socket.emit("send_socket_id", socket.id);

    connect_data = {
        type: "connect",
        id: socket.id
    }

    notifications.push(connect_data);
    io.emit("send_notification", notifications);

    socket.on("trigger_notification", id => {
        connect_data = {
            type: "trigger",
            id: id
        }
    
        notifications.push(connect_data);
        io.emit("send_notification", notifications);
    });

    socket.on("disconnect", () => {
        connect_data = {
            type: "disconnect",
            id: socket.id
        }
    
        notifications.push(connect_data);
        io.emit("send_notification", notifications);
    });
});
