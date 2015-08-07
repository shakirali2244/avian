'use strict';

/**
 * @ngdoc overview
 * @name AvianServer
 * @description
 * # AvianServer
 *
 * Main module of the application.
 */
angular
  .module('AvianServer', [
    'ui.router',
    'ngCookies',
    'ui.bootstrap',
    'lbServices',
    'leaflet-directive',
    'ngMap'
  ]);
