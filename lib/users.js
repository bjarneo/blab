'use strict';

var utils = require('./utilities');

var users = (function() {
    var clients = [];

    return {
        changeUserName: function(socket, data) {
            var taken = false,
                oldName = socket.name,
                newName = data.toString().split(' ')[1].replace(/(\r\n|\n|\r)/gm, '');

            // Check if nick aleady exists
            utils.each(clients, function(client) {
                if (client.name === newName) {
                    taken = true;
                }
            });

            if (taken) {
                this.messageUsers(
                    '* Sorry ' + oldName + ' name ' + newName + ' is already in use *\n'
                );

                return;
            }

            clients.pop(socket);

            socket.name = newName;

            clients.push(socket);

            this.messageUsers('* ' + oldName + ' changed nick to ' + socket.name + ' *\n');
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
        },

        messageUser: function(socket, message) {
            if (!message.length) {
                return false;
            }
            
            socket.write(message);
        },

        messageUsers: function(message) {
            utils.each(clients, function(client) {
                client.write(message);
            });

            process.stdout.write(message);
        }
    };
}());

module.exports = users;
