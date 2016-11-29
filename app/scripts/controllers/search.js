'use strict';

/**
 * @ngdoc function
 * @name miviuApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the miviuApp
 */
angular.module('miviuApp')
  .controller('SearchCtrl', function ($scope, $location) {
    $scope.searchTag = function() {
      if (!$scope.code) {
        toastr.warning('A tag de pesquisa está em branco.', 'TAG inválida')
      }
      else {
        $location.path('/tag/' + $scope.code)
      }
    }
  });
