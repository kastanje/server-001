'use strict';

/**
 * module dependencies
 */
var createKastanjeServer = require( 'kastanje-server' );

var closeEvent = require( 'net-server-event-close' );
var connectionEvent = require( 'net-server-event-connection' );
var errorEvent = require( 'net-server-event-error' );
var listeningEvent = require( 'net-server-event-listening' );

var use = require( 'net-server-method-use-001' );

var dataRequestHandler = require( 'http-server-request-handler-data' );
var fileRequestHandler = require( 'http-server-request-handler-file' );
var locationRequestHandler = require( 'http-server-request-handler-location' );
var responseRequestHandler = require( 'http-server-request-handler-response' );
var requestEvent = require( 'http-server-event-request' );

/**
 * @param {Object} user_options
 *
 * @returns {net.Server|tls.Server}
 */
function createServer( user_options ) {
  var options = user_options || {};

  /**
   * @type {net.Server|tls.Server}
   */
  var Server;

  // set default content_type
  options.content_type = user_options.content_type || 'text/html; utf-8';

  Server = createKastanjeServer( user_options );

  // events
  Server.on( 'close', closeEvent );
  Server.on( 'connection', connectionEvent );
  Server.on( 'error', errorEvent );
  Server.on( 'listening', listeningEvent );
  Server.on( 'request', requestEvent );

  // request handlers
  Server.use = use;
  Server.use( '.', [ responseRequestHandler ], [ '*' ] );
  Server.use( '.', [ locationRequestHandler ], [ '*' ] );
  Server.use( '.', [ dataRequestHandler ], [ 'post', 'put' ] );
  Server.use( '..', [ fileRequestHandler ] );

  return Server;
}

module.exports = createServer;
