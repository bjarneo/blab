'use strict';

var utilities = {
    contains: function (data, text) {
        return data.toString().indexOf(text);
    },

    each: function (arr, fn) {
        var len = arr.length, i = 0;

        if (typeof fn !== 'function') {
            throw new TypeError('No callback function added.');
        }

        for (; i < len; i++) {
            /* jshint validthis: true */
            fn.call(this, arr[i], i);
        }
    }
};

module.exports = utilities;
