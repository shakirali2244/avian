'use strict';

angular.module('AvianServer').config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    var checkLoggedin = function($q, $timeout, $location, User, Auth) {
      var deferred = $q.defer();

      console.log(Auth.getUserState);

      if (Auth.currentUser && Auth.currentUser.email) {
        $timeout(deferred.resolve);
      }
      else {
        Auth.currentUser = User.getCurrent(function() {
          Auth.login();
          $timeout(deferred.resolve);
        },
        function() {
          Auth.logout();
          $timeout(deferred.reject);
          $location.path('/login');
        });
      }

      return deferred.promise;
    };

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('index', {
        url: '/',
        controller: 'HomeCtrl',
        templateUrl: '/views/home.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      // .state('rhino', {
      //   url: '/rhino',
      //   controller: 'HomeCtrl',
      //   templateUrl: '/views/home.html',
      //   resolve: {
      //     loggedin: checkLoggedin
      //   }
      // }) 
      .state('rawdata', {
        url: '/rawdata',
        controller: 'RawDataCtrl',
        templateUrl: '/views/rawdata.html'
      })
      .state('login', {
        url: '/login',
        controller: 'IndexCtrl',
        templateUrl: '/views/login.html'
      })     
      .state('register', {
        url: '/register',
        controller: 'IndexCtrl',
        templateUrl: '/views/register.html'
      })      
      .state('register_success', {
        url: '/register_success',
        controller: 'IndexCtrl',
        templateUrl: '/views/register_success.html'
      });

    //Intercept 401 responses and redirect to login screen
    $httpProvider.interceptors.push(function($q, $location) {
      return {
        responseError: function(response) {
          console.log('intercepted rejection of ', response.config.url, response.status);
          if (response.status === 401 || response.status === 403) {
            // save the current location so that login can redirect back
            $location.nextAfterLogin = $location.path();
            $location.path('/login');
          }
          return $q.reject(response);
        }
      };
    });

    $locationProvider.html5Mode(true);
  });
