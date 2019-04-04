exports = module.exports = function (io) {
    
  const userOnline = {};

  io.on('connection', (socket) => { // userOnline mapping to their nickname!!!
    console.log('user login');

    socket.on('new user', (data) => {
      if (data in userOnline) {
        console.log('user already exists!');
      } else {
        const nickname = data;
        userOnline[nickname] = socket; // take their socket ID as their nickname
      }
    });

    socket.on('chat message', (from, to, msg) => {
      console.log('I received a private message from', from, ' say to ', to, msg);
      if (to in userOnline) {
        console.log(`privateMsgTo${to}`);
        userOnline[to].emit(`privateMsgTo${to}`, {
          from: from,
          msg: msg
 });
      }
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
