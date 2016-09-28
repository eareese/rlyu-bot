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
    var wisdom = "It's really you this time!";

    if (request.payload.token && request.payload.token === slackToken) {
      if (request.payload.user_name != 'slackbot') {
        reply({ "text": wisdom }).code(200);
      } else { reply().code(200); }
    } else {
      reply().code(401);
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
