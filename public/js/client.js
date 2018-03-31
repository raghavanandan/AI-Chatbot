var socket = io();

function scrollToBottom() {
  var msg = $('#convo');
  var newMsg = msg.children('li:last-child');
  var clientHeight = msg.prop('clientHeight');
  var scrollTop = msg.prop('scrollTop');
  var scrollHeight = msg.prop('scrollHeight');
  var newMsgHeight = newMsg.innerHeight();
  var lastMsgHeight = newMsg.prev().innerHeight();

  if(clientHeight + scrollTop + newMsgHeight + lastMsgHeight >= scrollHeight) {
    msg.scrollTop(scrollHeight);
  }
}

socket.on('connect', function () {
  var params = $.deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

// socket.on('updateUserList', function (users) {
//   var ol = $('<ol></ol>');
//
//   users.forEach(function (user) {
//     ol.append($('<li></li>').text(user));
//   });
//
//   $('#users').html(ol);
// });

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var temp = $('#message-template').html();
  var html = Mustache.render(temp, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  $('#convo').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var temp = $('#location-message-template').html();
  var html = Mustache.render(temp, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  $('#convo').append(html);
  scrollToBottom();
});

$('#chat-form').on('submit', function (event) {
  event.preventDefault();

  var textBox = $('[name=message]');

    socket.emit('createMessage', {
      text: textBox.val()
    }, function () {
      textBox.val('');
    });
});


var locBtn = $('#location');

locBtn.on('click', function () {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }
  locBtn.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locBtn.removeAttr('disabled').text('Send location');
    // console.log('Position', position);
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locBtn.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location');
  })
});
