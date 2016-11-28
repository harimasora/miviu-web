'use strict';

/**
 * @ngdoc service
 * @name miviuApp.Auth
 * @description
 * # Auth
 * Factory in the miviuApp.
 */
angular.module('miviuApp')
  .factory('Auth', function ($firebaseAuth) {
    return $firebaseAuth();
  });
