'use strict';

/**
 * @ngdoc function
 * @name miviuApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the miviuApp
 */
angular.module('miviuApp')
  .controller('ProfileCtrl', function ($scope, Profile, currentAuth) {
    $scope.user = Profile(currentAuth.uid);

    // Set user display data
    $scope.user.$watch(function(event) {
      $scope.user.name = $scope.user.name ? $scope.user.name : "\<Sem nome\>";
      $scope.user.phone = $scope.user.phone ? $scope.user.phone : "\<Sem telefone registrado\>";
      $scope.user.objectsMessage = objectsMessage();

      function objectsMessage(){
        var totalObjects = 0;
        if ($scope.user.objects) {
          var total = 0;
          for (var key in Object.keys($scope.user.objects)) { total += 1 }
          totalObjects = total;
        }
        var objectsMessage = "";
        switch (totalObjects) {
          case 0:
            objectsMessage = "Nenhum objeto registrado :(";
            break;
          case 1:
            objectsMessage = "1 objeto";
            break;
          default:
            objectsMessage = totalObjects + " objetos";
        }
        return objectsMessage;
      }
    });
  });
