'use strict';

/**
 * @ngdoc function
 * @name miviuApp.controller:TagCtrl
 * @description
 * # TagCtrl
 * Controller of the miviuApp
 */
angular.module('miviuApp')
  .controller('TagCtrl', function ($scope, $routeParams, Profile, Object) {

    $scope.object = Object($routeParams.id);
    $scope.owner = {};

    $scope.object.$watch(function (event) {
      //Get owner if object is active
      if ($scope.object.active == true) {
        $scope.owner = Profile($scope.object.prop);
      }

      //Register changes
      $scope.owner.$watch(function(event) {
        $scope.owner.name = $scope.owner.name ? $scope.owner.name : "\<Sem nome\>";
        $scope.owner.phone = $scope.owner.phone ? $scope.owner.phone : "\<Sem telefone registrado\>";
      });
    });
  });
