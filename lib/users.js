'use strict';
var Utils = require('./utilities');

var Users = {
    clients: [],

    changeUserName: function(socket, data, broadcast) {
        var taken = false,
            oldName = socket.name,
            newName = data.toString().split(' ')[1].replace(/(\r\n|\n|\r)/gm, '');

        // Check if nick aleady exists
        Utils.each(this.clients, function(client) {
            if (client.name === newName) {
                taken = true;
            }
        });

        if (taken) {
            broadcast.call(
                this,
                '* Sorry ' + oldName + ' name ' + newName + ' is already in use *\n'
            );

            return;
        }

        this.clients.pop(socket);

        socket.name = newName;

        this.clients.push(socket);

        broadcast.call(this, '* ' + oldName + ' changed nick to ' + socket.name + ' *\n');
    },

    createUser: function(socket) {
        socket.name = 'Greenbaby-' + (this.clients.length + 1);

        this.clients.push(socket);
    },

    getUser: function(socket) {
        return this.clients.indexOf(socket);
    },

    getUsers: function() {
        return this.clients;
    }
};

module.exports = Users;
