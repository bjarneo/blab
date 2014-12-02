'use strict';

var utils = require('./utilities');

var commands = (function() {
    return {
        exists: function(data, command) {
            return (utils.contains(data, command) !== -1);
        }
    };
}());

module.exports = commands;
