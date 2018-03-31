const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const {genMsg, genLocationMsg} = require('./utils/messaging');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    // io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    socket.emit('newMessage', genMsg('Jarvis', 'Hi! How are you doing today?'));
    // socket.broadcast.to(params.room).emit('newMessage', genMsg('Admin', `${params.name} has joined`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', genMsg(user.name, message.text));
    }

    var array = message.text.split(' ');
    // console.log(array);

    if(array.includes('headache')) {
      setTimeout(() => {
        socket.emit('newMessage', genMsg('Jarvis', 'Did you give a mid-term today?'));
      }, 2000);
    } else if (array.includes('cold')) {
      setTimeout(() => {
        socket.emit('newMessage', genMsg('Jarvis', 'Did you have too much icecream?'));
      }, 2000);
    } else if (array.includes('i') && array.includes("don't") && array.includes('know')) {
      setTimeout(() => {
        socket.emit('newMessage', genMsg('Jarvis', 'Do you exercise enough?'));
      }, 2000);
    } else if (array.includes('stress') || array.includes('stressed')) {
      setTimeout(() => {
        socket.emit('newMessage', genMsg('Jarvis', 'Are you taking any medications?'));
      }, 2000);
    } else if ((array.includes('feel') || array.includes('feeling')) && array.includes('lonely')) {
      setTimeout(() => {
        socket.emit('newMessage', genMsg('Jarvis', 'Did you have a breakup?'));
      }, 2000);
    } else if (message.text.includes('i feel drowsy')) {
      setTimeout(() => {
        socket.emit('newMessage', genMsg('Jarvis', "I'd suggest to consume atleast 2 litres of water per day"));
      }, 2000);
    } else if (message.text.includes('not good')) {
      setTimeout(() => {
        socket.emit('newMessage', genMsg('Jarvis', "May I know what's bothering you?"));
      }, 2000);
    } else if (array.includes('yes')) {
      setTimeout(() => {
        socket.emit('newMessage', genMsg('Jarvis', "I'll take that as a cause. Is there anything else I should know?"));
      }, 2000);
    } else if (array.includes('need') && array.includes('ambulance')) {
      setTimeout(() => {
        socket.emit('newMessage', genMsg('Jarvis', 'Please send us your location.'));
      }, 2000);
    } else if (array.includes('make') && array.includes('appointment')) {
      setTimeout(() => {
        socket.emit('newMessage', genMsg('Jarvis', 'Very well. When do you want to make an appointment, Weekend or Weekday?'));
      }, 2000);
    } else if (array.includes('Weekend') || array.includes('weekend')) {
      setTimeout(() => {
        socket.emit('newMessage', genMsg('Jarvis', 'The doctor is available from 10am - 4pm on Saturdays. When do you want to book it?'));
      }, 2000);
    } else if (array.includes('1pm')) {
      setTimeout(() => {
        socket.emit('newMessage', genMsg('Jarvis', "Great. I've made an appointment for 1pm on Saturday."));
      }, 2000);
    } else if (array.includes('thanks') || array.includes('thank')) {
      setTimeout(() => {
        socket.emit('newMessage', genMsg('Jarvis', "You're welcome. Take care."));
      }, 2000);
    } else if ((array.includes('good') || array.includes('fine')) && !array.includes('not')) {
      setTimeout(() => {
        socket.emit('newMessage', genMsg('Jarvis', "Oh. Then what brings you here?"));
      }, 2000);
    }

    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', genLocationMsg(user.name, coords.latitude, coords.longitude));
    }

    setTimeout(() => {
      socket.emit('newMessage', genMsg('Jarvis', 'Got it. Sending help right away.'));
    }, 2000);

  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      // io.to(user.room).emit('newMessage', genMsg('Admin', `${user.name} has left`));
    }
  })
})

server.listen(port, () => {
  console.log(`Started the app on port ${port}`);
})
