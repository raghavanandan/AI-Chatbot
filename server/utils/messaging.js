const moment = require('moment');

var genMsg = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf()
  }
};

var genLocationMsg = function (from, latitude, longitude) {
  return {
    from,
    url: `https://www.google.com/maps/?q=${latitude},${longitude}`,
    createdAt: moment().valueOf()
  }
};

module.exports = {
  genMsg,
  genLocationMsg
}
