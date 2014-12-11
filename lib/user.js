'use strict';

var utils = require('./utilities'),
    clients = [];

function User(socket) {
    if (!socket) {
        throw 'No socket?';
    }

    this.socket = socket;

    this.socket.name = 'Freshblab-' + (clients.length + 1);

    clients.push(this.getSocket());
}

User.prototype.getSocket = function () {
    return this.socket;
};

User.prototype.setData = function (data) {
    if (!data) {
        throw 'No data?';
    }

    this.data = data.toString();
};

User.prototype.getData = function () {
    return this.data;
};

User.prototype.changeUserName = function () {
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
};

User.prototype.getUser = function () {
    return clients.indexOf(this.getSocket());
};

User.prototype.getUsers = function () {
    return clients;
};

User.prototype.removeUser = function () {
    clients.pop(this.getUser(this.getSocket()));
};

User.prototype.messageUser = function (message) {
    if (!message.length) {
        return false;
    }

    this.getSocket().write(message + '\n');
};

User.prototype.messageUsers = function (message) {
    utils.each(clients, function(client) {
        client.write(message);
    });

    process.stdout.write(message);
};

module.exports = User;
