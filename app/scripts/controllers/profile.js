'use strict';

/**
 * @ngdoc function
 * @name miviuApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the miviuApp
 */
angular.module('miviuApp')
  .controller('ProfileCtrl', function ($scope, $location, Profile, currentAuth) {
    $scope.user = Profile(currentAuth.uid);

    // Set user display data
    $scope.user.$watch(function(event) {
      $scope.user.nameMessage = $scope.user.name ? $scope.user.name : "\<Sem nome\>";
      $scope.user.phoneMessage = $scope.user.phone ? $scope.user.phone : "\<Sem telefone registrado\>";
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

    $scope.saveUser = function(){

      function save() {
        $scope.user.$save()
          .then(function () {
            $location.path('/profile');
            toastr.success('Perfil atualizado com sucesso!')
          })
          .catch(function (error) {
            console.error(error);
          });
      }
      function uploadPic(file) {
        var filename = $scope.user.$id + ".jpg";
        var uploadTask = firebase.storage().ref("userimages").child(filename).put(file);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', function(snapshot){
          // Observe state change events such as progress, pause, and resume
          // See below for more detail
        }, function(error) {
          // Handle unsuccessful uploads
          console.log(error);
        }, function() {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          $scope.user.photoURL = uploadTask.snapshot.downloadURL;
          save();
        });
      }

      if ($scope.picFile) {
        uploadPic($scope.picFile);
      } else {
        save();
      }
    }
  });
