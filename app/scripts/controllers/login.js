'use strict';

/**
 * @ngdoc function
 * @name miviuApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the miviuApp
 */
angular.module('miviuApp')
  .controller('LoginCtrl', ["$scope", "$location", "Auth", function ($scope, $location, Auth) {

    $scope.user = {};

    $scope.signIn = function() {
      $scope.firebaseUser = null;
      $scope.error = null;

      Auth.$signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(firebaseUser) {
        console.log("Signed in as:", firebaseUser.uid);
        $location.path('/profile');
      }).catch(function(error) {
        console.error("Authentication failed:", error);
      });
    };

    $scope.signInWithProvider = function(provider) {
      Auth.$signInWithPopup(provider).then(function(result) {
        console.log("Signed in as:", result.user.uid);
      }).catch(function(error) {
        console.error("Authentication failed:", error);
      });
    };

  }]);
