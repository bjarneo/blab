'use strict';

var Welcome = {
    ahouy: function(socket) {
        socket.write('Welcome ' + socket.name + '\n');

        socket.write('To change your name simply type: /name myNickBrah\n');
    }
};

module.exports = Welcome;
