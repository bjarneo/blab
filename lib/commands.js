'use strict';

var cmd = [
    '/name',
    '/exit',
    '/help'
];

var commands = {
    exists: function(data, command) {
        var getCommand = data.toString().slice(0, command.length);

        if (cmd.indexOf(getCommand) !== -1 && getCommand === command) {
            return true;
        }

        return false;
    }
};

module.exports = commands;
