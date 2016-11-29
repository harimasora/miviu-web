'use strict';

/**
 * @ngdoc function
 * @name miviuApp.controller:ObjectsCtrl
 * @description
 * # ObjectsCtrl
 * Controller of the miviuApp
 */
angular.module('miviuApp')
  .controller('ObjectsCtrl', function ($scope, $location, Object, Profile, currentAuth) {
    $scope.user = Profile(currentAuth.uid);
    $scope.objectModel = {};
    $scope.uploadStatus = {
      completed: true,
      progress: 0,
      bytesTransferred: 0,
      totalBytes: 0
    };

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

    $scope.addObject = function() {
      $scope.object = Object($scope.objectModel.code);

      $scope.object.$watch(function(event) {
        if ($scope.object.active == true) {
          // Dont have an owner
          if (!$scope.object.prop) {
            //So register the object
            if ($scope.picFile) {
              uploadPic($scope.picFile);
            } else {
              save();
            }
          }
          // Has an owner
          else {
            if ($scope.object.prop == $scope.user.$id) {
              // Is current user
              toastr.warning('Você já registrou esse código.', 'Código já registrado.');
            } else {
              // Is another user
              toastr.error('Este código já foi registrado por outro usuário.', 'Código já registrado.');
            }
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
        $scope.uploadStatus.completed = false;

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', function(snapshot){
          // Observe state change events such as progress, pause, and resume
          // See below for more detail
          $scope.$apply(function(){
            $scope.uploadStatus.totalBytes = snapshot.totalBytes;
            $scope.uploadStatus.bytesTransferred = snapshot.bytesTransferred;
            $scope.uploadStatus.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          });
        }, function(error) {
          // Handle unsuccessful uploads
          console.log(error);
          $scope.uploadStatus.completed = true;
        }, function() {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          $scope.objectModel.photoURL = uploadTask.snapshot.downloadURL;
          $scope.uploadStatus.completed = true;
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
                $location.path('/objects');
                toastr.success('Objeto registrado com sucesso!')
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
