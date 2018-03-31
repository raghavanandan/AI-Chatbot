const expect = require('expect');

var {genMsg, genLocationMsg} = require('./messaging');

describe('genMsg', () => {
  it('should generate the correct message object', () => {
    var from = 'Raghav';
    var text = 'Test message';
    var message = genMsg(from, text);

    expect(typeof message.createdAt).toBe('number');
    expect(message).toInclude({from,text});
  })
});

describe('genLocationMsg', () => {
  it('should generate correct location object', () => {
    var from = "Admin";
    var lat = 15;
    var lng = 20;
    var url = "https://www.google.com/maps/?q=15,20";
    var message = genLocationMsg(from, lat, lng);

    expect(typeof message.createdAt).toBe('number');
    expect(message).toInclude({from,url});
  })
});
