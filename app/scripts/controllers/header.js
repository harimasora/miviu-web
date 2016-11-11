'use strict';

/**
 * @ngdoc function
 * @name miviuApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the miviuApp
 */
angular.module('miviuApp')
  .controller('HeaderController', function ($scope, $location, Auth) {

    $scope.currentAuth = null;

    Auth.$onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        $scope.currentAuth = user;
      } else {
        // No user is signed in.
        $scope.currentAuth = null;
      }
    });

    $scope.signOut = function() {
      firebase.auth().signOut().then(function() {
        console.log('Signed Out');
        $location.path('/');
      }, function(error) {
        console.error('Sign Out Error', error);
      });
    };

    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
  });
