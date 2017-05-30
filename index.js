const app = require('express')();
const server = require('http').createServer(app);
const url = require('url');
const ws = require('socket.io')(server);
const path = require('path');

let clients = [];
let busses = [];
const express = require('express');
app.use(express.static(__dirname + "/"));
app.get('/bus',function(req,res){
    res.sendFile(path.join(__dirname + '/bus.html'));
});

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname + '/client.html'));
});

ws.on('connection', function connection(ws) {
    let bus = false;
    if (ws.protocol) {
        prot = ws.protocol.split('-');
        if (prot.length === 2) {
            ws.busNr = prot[1];
            busses.push(ws);
            bus = true;
        }
        else {
            clients.push(ws);
        }
    }
    else {
        clients.push(ws);
    }
    ws.on('message', function incoming(message) {
        let data = JSON.parse(message);
        if (bus === true) {
            ws.lat = data.lat;
            ws.lng = data.lng;
        }
        else {
            let bussesSearch = {};
            for (let i = 0; i < busses.length; i++) {
                if (busses[i].busNr === data.busNr) {
                    bussesSearch[i] = {lat: busses[i].lat, lng: busses[i].lng}
                }
            }
            clients[client].emit('message', JSON.stringify(statistics));
            ws.emit('message',JSON.stringify(bussesSearch));
        }
    });
});
var port = process.env.PORT || 1337;
server.listen(port);