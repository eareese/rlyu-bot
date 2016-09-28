'use strict';

const Hapi = require('hapi');
const Good = require('good');

const slackToken = process.env.SLACK_TOKEN;

const wisdom = "it's really you this time!";



const server = new Hapi.Server();
server.connection({
  port: process.env.PORT || 3000
});

server.route({
  method: 'POST',
  path: '/rlyu',
  handler: function (request, reply) {

    let hasSlackKey = (request.payload.token && request.payload.token === slackToken) ? true : false ;

    let notFromBot = (request.payload.user_name == 'slackbot') ? false : true;

    let notEscaped = (request.payload.text && request.payload.text.match(/really you/)) ? false : true;

    if (hasSlackKey && notFromBot && notEscaped) {
      let message = request.payload.user_name + ", " + wisdom;
      reply({"text": message}).code(200);
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
