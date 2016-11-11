'use strict';

/**
 * @ngdoc function
 * @name miviuApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the miviuApp
 */
angular.module('miviuApp')
  .controller('SignupCtrl', function ($scope, $location, Auth, Profile) {

    $scope.credentials = {};

    function saveUserToFirebase(user) {
      // Create profile on /users
      $scope.profile = new Profile(user.uid);

      function buildProfile() {
        $scope.profile.email = user.email;
        //Set new name from provider or keep current
        if (user.displayName) {
          $scope.profile.name = user.displayName;
        } else {
          $scope.profile.name = $scope.credentials.name;
        }
        //Keep photo if any
        if (!$scope.profile.photoURL) {
          $scope.profile.photoURL = user.photoURL;
        }
        $scope.profile.phone = $scope.credentials.phonePrefix + " " + $scope.credentials.phone;
      }
      function save() {
        $scope.profile.$save()
          .then(function () {
            $location.path('/profile');
          })
          .catch(function (error) {
            console.error(error);
          });
      }
      function uploadPic(file) {
        var filename = user.uid + ".jpg";
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
          $scope.profile.photoURL = uploadTask.snapshot.downloadURL;
          console.log($scope.profile.photoURL);
          buildProfile();
          save();
        });
      }

      $scope.profile.$loaded()
        .then(function () {
          if ($scope.picFile) {
            uploadPic($scope.picFile);
          } else {
            buildProfile();
            save();
          }
        })
        .catch(function(error) {
          console.error(error);
        });
    }

    $scope.createUser = function() {
      //TODO Validate fields
      Auth.$createUserWithEmailAndPassword($scope.credentials.email, $scope.credentials.password)
        .then(function(firebaseUser) {
          saveUserToFirebase(firebaseUser);
        }).catch(function(error) {
        $scope.error = error;
      });
    };

    $scope.signInWithProvider = function(provider) {
      Auth.$signInWithPopup(provider).then(function(result) {
        saveUserToFirebase(result.user);
      }).catch(function(error) {
        console.error("Authentication failed:", error);
      });
    };

  });
