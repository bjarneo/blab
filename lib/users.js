'use strict';

var utils = require('./utilities'),
    clients = [];

var users = {
    setSocket: function (socket) {
        if (!socket) {
            throw 'No socket?';
        }

        this.socket = socket;
    },

    getSocket: function () {
        return this.socket;
    },

    setData: function (data) {
        if (!data) {
            throw 'No data?';
        }

        this.data = data.toString();
    },

    getData: function () {
        return this.data;
    },

    changeUserName: function () {
        var taken = false,
            oldName = this.getSocket().name,
            newName = this.getData().split(' ')[1].replace(/(\r\n|\n|\r)/gm, '');

        // Check if nick aleady exists
        utils.each(clients, function (client) {
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

        clients.pop(this.getSocket());

        this.getSocket().name = newName;

        clients.push(this.getSocket());

        this.messageUsers('* ' + oldName + ' changed nick to ' + this.getSocket().name + ' *\n');
    },

    addUser: function () {
        this.getSocket().name = 'Freshblab-' + (clients.length + 1);

        clients.push(this.getSocket());
    },

    getUser: function () {
        return clients.indexOf(this.getSocket());
    },

    getUsers: function () {
        return clients;
    },

    removeUser: function () {
        clients.pop(this.getUser(this.getSocket()));
    },

    messageUser: function (message) {
        if (!message.length) {
            return false;
        }

        this.getSocket().write(message + '\n');
    },

    messageUsers: function (message) {
        utils.each(clients, function(client) {
            client.write(message + '\n');
        });

        process.stdout.write(message + '\n');
    }
};

module.exports = users;
