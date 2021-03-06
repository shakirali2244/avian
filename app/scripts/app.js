'use strict';

/**
 * @ngdoc overview
 * @name avianApp
 * @description
 * # avianApp
 *
 * Main module of the application.
 */
angular
  .module('avianApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/ip', {
        templateUrl: 'views/ip.html',
        controller: 'ipCtrl',
        controllerAs: 'ip'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/panel', {
        templateUrl: 'views/panel.html',
        controller: 'PanelCtrl',
        controllerAs: 'panel'
      })
      .when('/beacon', {
        templateUrl: 'views/beacon.html',
        controller: 'beaconCtrl',
        controllerAs: 'beacon'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
