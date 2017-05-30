const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const app = express();

const server = http.createServer(app);
const ws = new WebSocket.Server({server});
let clients = [];
let busses = [];
app.use(express.static(__dirname + "/"));
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname + '/index.html'));
});
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
            ws.send(JSON.stringify(bussesSearch));
        }
    });
});
var port = process.env.PORT || 1337;
server.listen(port);