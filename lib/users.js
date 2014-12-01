'use strict';

var Utils = require('./utilities');

var Users = (function() {
    var clients = [];

    return {
        changeUserName: function(socket, data, broadcast) {
            var taken = false,
                oldName = socket.name,
                newName = data.toString().split(' ')[1].replace(/(\r\n|\n|\r)/gm, '');

            // Check if nick aleady exists
            Utils.each(clients, function(client) {
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

            clients.pop(socket);

            socket.name = newName;

            clients.push(socket);

            broadcast.call(this, '* ' + oldName + ' changed nick to ' + socket.name + ' *\n');
        },

        addUser: function(socket) {
            socket.name = 'Freshblab-' + (clients.length + 1);

            clients.push(socket);
        },

        getUser: function(socket) {
            return clients.indexOf(socket);
        },

        getUsers: function() {
            return clients;
        },

        removeUser: function(socket) {
            clients.splice(this.getUser(socket), 1);
        }
    };
}());

module.exports = Users;
