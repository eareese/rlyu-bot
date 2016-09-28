'use strict';

const Hapi = require('hapi');
const Good = require('good');

const slackToken = process.env.SLACK_TOKEN;

const server = new Hapi.Server();
server.connection({
  port: process.env.PORT || 3000
});

server.route({
  method: 'POST',
  path: '/rlyu',
  handler: function (request, reply) {
    if (request.payload.token === slackToken) {
      console.log('----');
      console.log(request.payload);
      console.log('----');
    }
  }
});


server.register({
  register: Good,
  options: {
    reporters: {
      console: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{
          response: '*',
          log: '*'
        }]
      }, {
        module: 'good-console'
      }, 'stdout']
    }
  }
}, (err) => {

  if (err) {
    throw err; // something bad happened loading the plugin
  }

  server.start((err) => {

    if (err) {
      throw err;
    }
    server.log('info', 'Server running at: ' + server.info.uri);
  });
});
