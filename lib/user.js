'use strict';

var utils = require('./utilities');

function User(socket) {
    if (!socket) {
        throw 'No socket?';
    }

    this.clients = [];

    this.socket = socket;

    this.socket.name = 'Freshblab-' + (this.clients.length + 1);

    this.clients.push(this.getSocket());
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
    utils.each(this.clients, function (client) {
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

    this.clients.pop(this.getSocket());

    this.getSocket().name = newName;

    this.clients.push(this.getSocket());

    this.messageUsers('* ' + oldName + ' changed nick to ' + this.getSocket().name + ' *\n');
};

User.prototype.getUser = function () {
    return this.clients.indexOf(this.getSocket());
};

User.prototype.getUsers = function () {
    return this.clients;
};

User.prototype.removeUser = function () {
    this.clients.pop(this.getUser(this.getSocket()));
};

User.prototype.messageUser = function (message) {
    if (!message.length) {
        return false;
    }

    this.getSocket().write(message + '\n');
};

User.prototype.messageUsers = function (message) {
    utils.each(this.clients, function(client) {
        client.write(message);
    });

    process.stdout.write(message);
};

module.exports = User;
