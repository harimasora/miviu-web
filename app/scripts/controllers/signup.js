'use strict';

/**
 * @ngdoc function
 * @name miviuApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the miviuApp
 */
angular.module('miviuApp')
  .controller('SignupCtrl', [ "$scope", "$location", "Auth", function ($scope, $location, Auth) {

    $scope.user = {};

    $scope.createUser = function() {
      Auth.$createUserWithEmailAndPassword($scope.user.email, $scope.user.password)
        .then(function(firebaseUser) {
          $location.path("/profile");
        }).catch(function(error) {
        $scope.error = error;
      });
    };

  }]);
