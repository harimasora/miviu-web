'use strict';

/**
 * @ngdoc overview
 * @name miviuApp
 * @description
 * # miviuApp
 *
 * Main module of the application.
 */
angular
  .module('miviuApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'ngFileUpload',
  ])

  .run(["$rootScope", "$location", function($rootScope, $location) {
    $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
      // We can catch the error thrown when the $requireSignIn promise is rejected
      // and redirect the user back to the home page
      if (error === "AUTH_REQUIRED") {
        $location.path("/");
      }
    });
  }])

  .config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profile',
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireSignIn();
          }]
        }
      })
      .when('/profile/edit', {
        templateUrl: 'views/profileEdit.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profile',
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireSignIn();
          }]
        }
      })
      .when('/search', {
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl',
        controllerAs: 'search'
      })
      .when('/objects', {
        templateUrl: 'views/objects.html',
        controller: 'ObjectsCtrl',
        controllerAs: 'objects',
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireSignIn();
          }]
        }
      })
      .when('/objects/new', {
        templateUrl: 'views/objectsNew.html',
        controller: 'ObjectsCtrl',
        controllerAs: 'objects',
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireSignIn();
          }]
        }
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        controllerAs: 'signup'
      })
      .when('/tag/:id', {
        templateUrl: 'views/tag.html',
        controller: 'TagCtrl',
        controllerAs: 'tag'
      })
      .otherwise({
        redirectTo: '/'
      });
  })

  // let's create a re-usable factory that generates the $firebaseAuth instance
  .factory("Auth", ["$firebaseAuth",
    function($firebaseAuth) {
      return $firebaseAuth();
    }
  ]);
