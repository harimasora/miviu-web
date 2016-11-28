'use strict';

/**
 * @ngdoc function
 * @name miviuApp.controller:ObjectseditCtrl
 * @description
 * # ObjectseditCtrl
 * Controller of the miviuApp
 */
angular.module('miviuApp')
  .controller('ObjectsEditCtrl', function ($scope, $location, Object, Profile, currentAuth, currentObject) {
    $scope.user = Profile(currentAuth.uid);
    $scope.objectModel = currentObject;

    // Set user display data
    $scope.user.$watch(function(event) {
      $scope.user.nameMessage = $scope.user.name ? $scope.user.name : "\<Sem nome\>";
      $scope.user.objectsMessage = objectsMessage();

      function objectsMessage(){
        var totalObjects = 0;
        if ($scope.user.objects) {
          var total = 0;
          angular.forEach($scope.user.objects, function(key, value){total += 1});
          totalObjects = total;
        }
        var objectsMessage = "";
        switch (totalObjects) {
          case 0:
            objectsMessage = "Nenhum objeto registrado :(";
            break;
          case 1:
            objectsMessage = "1 MIV";
            break;
          default:
            objectsMessage = totalObjects + " MIV's";
        }
        return objectsMessage;
      }
    });

    $scope.editObject = function () {

      $scope.object = Object($scope.objectModel.code);

      // Only load once, please.
      $scope.object.$loaded(function(event) {
        if ($scope.object.active == true) {
          if ($scope.picFile) {
            uploadPic($scope.picFile);
          } else {
            save();
          }
        } else {
          toastr.warning('Este código não existe.');
        }
      });

      function buildObject() {
        $scope.object.code = $scope.objectModel.code;
        $scope.object.desc = $scope.objectModel.desc;
        $scope.object.photoURL = $scope.objectModel.photoURL;
        $scope.object.prop = $scope.user.$id;
      }
      function buildUser() {
        if ($scope.user.objects) {
          $scope.user.objects[$scope.objectModel.code] = $scope.objectModel;
        } else {
          var objects = {};
          objects[$scope.objectModel.code] = $scope.objectModel;
          $scope.user.objects = objects;
        }
      }
      function uploadPic(file) {
        var filename = $scope.objectModel.code + ".jpg";
        var uploadTask = firebase.storage().ref("objectimages").child(filename).put(file);

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
          $scope.objectModel.photoURL = uploadTask.snapshot.downloadURL;
          save();
        });
      }
      function save() {
        buildObject();
        $scope.object.$save()
          .then(function(){
            buildUser();
            $scope.user.$save()
              .then(function(){
                toastr.success('Objeto atualizado com sucesso!');
                $location.path('/objects');
              })
              .catch(function (error) {
                console.log(error);
              })
          })
          .catch(function (error) {
            console.log(error);
          })
      }
    }
  });
