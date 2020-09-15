'use strict';

module.exports = function(prefix) {
  var uid = parseInt((new Date()).valueOf() +
    (Math.random() * 1000000).toFixed()).toString(36);
  return (prefix || '') + uid;
};
