'use strict';

/**
 * @ngdoc function
 * @name miviuApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the miviuApp
 */
angular.module('miviuApp')
  .controller('HeaderController', function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
  });
