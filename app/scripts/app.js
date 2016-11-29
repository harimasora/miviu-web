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
    'ui.bootstrap',
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
      if (error === "NO_OWNER_ACCESS") {
        toastr.error("Você não possui permissão para acessar esta página.", 'Acesso Negado');
        $location.path("/");
      }
      if (error === "NO_TAG_FOUND") {
        toastr.warning("Não foi possível localizar esta tag.", 'Tag incorreta');
        $location.path("/search");
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
      .when('/objects/:id/edit', {
        templateUrl: 'views/objectsEdit.html',
        controller: 'ObjectsEditCtrl',
        controllerAs: 'objectsEdit',
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireSignIn();
          }],
          "currentObject": function(Object, $route) {
            return Object($route.current.params.id)
          },
          //Here i check if a user has admin rights, note that i pass currentAuth and waitForAuth to this function to make sure those are resolves before this function
          "canAccess": function (Auth, Rights, $q) {
            var currentAuthPromise = Auth.$requireSignIn();
            var waitForAuthPromise = Auth.$waitForSignIn();
            return $q.all([currentAuthPromise, waitForAuthPromise]).then(function(results){
              var currentAuth = results[0];
              return Rights.hasOwnerAccess(currentAuth);
            });
          }
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
        controllerAs: 'tag',
        resolve: {
          "currentObject": function(Tag) {
            return Tag.findObject()
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  })
