/* jslint node: true */
'use strict';

var net = require('net'),
    clients = [];

//TODO: Split it into lib/resources
net.createServer(function (socket) {
    function welcome() {
        socket.write('Welcome ' + socket.name + '\n');
        socket.write('To change your name simply type: /name myNickBrah\n');
    }

    function createClient() {
        //socket.remoteAddress + ':' + socket.remotePort;
        socket.name = 'Greenbaby-' + (clients.length + 1);

        clients.push(socket);

        welcome();
    }

    // Send message to clients
    function broadcast(message) {
        each(clients, function(client) {
            client.write(message);
        });

        // server output
        process.stdout.write(message);
    }

    function changeNick(data) {
        var taken = false,
            oldName = socket.name,
            newName = data.toString().split(' ')[1].replace(/(\r\n|\n|\r)/gm, '');

        // Check if nick aleady exists
        each(clients, function(client) {
            if (client.name === newName) {
                taken = true;
            }
        });

        if (taken) {
            broadcast('* Sorry ' + oldName + ' name ' + newName + ' is already in use *\n');

            return;
        }

        clients.pop(socket);

        socket.name = newName;

        clients.push(socket);

        broadcast('* ' + oldName + ' changed nick to ' + socket.name + ' *\n');
    }

    function contains(data, text) {
        return data.toString().indexOf(text);
    }

    function each(arr, fn) {
        var len = arr.length, i = 0;

        if (!arr.length && arr instanceof Array) {
            throw new TypeError('Check your array.');
        } else if (typeof fn !== 'function') {
            throw new TypeError('No callback function added.');
        }

        for (; i < len; i++) {
            /* jshint validthis: true */
            fn.call(this, arr[i], i);
        }
    }

    // Create our client
    createClient();

    broadcast(socket.name + ' joined the chat\n');

    // Our chat stream
    socket.on('data', function (data) {
        if (contains(data, '/name ') !== -1) {
            changeNick(data);

            return;
        }

        broadcast(socket.name + ' > ' + data);
    });

    // Pop our client when it leaves
    socket.on('end', function () {
        clients.splice(clients.indexOf(socket), 1);

        broadcast(socket.name + ' left the chat.\n');
    });
}).listen(5000);

console.log('Blab server running at port 5000\n');
