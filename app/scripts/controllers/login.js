'use strict';

/**
 * @ngdoc function
 * @name miviuApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the miviuApp
 */
angular.module('miviuApp')
  .controller('LoginCtrl', function ($scope, $location, Profile, Auth) {

    $scope.credentials = {};

    function saveUserToFirebase(user) {
      // Create profile on /users
      $scope.profile = Profile(user.uid);

      function buildProfile() {
        $scope.profile.email = user.email;
        //Set new name from provider or keep current
        if (user.displayName) {
          $scope.profile.name = user.displayName;
        }
        //Keep photo if any
        if (!$scope.profile.photoURL) {
          $scope.profile.photoURL = user.photoURL;
        }
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

      $scope.profile.$loaded()
        .then(function () {
          buildProfile();
          save();
        })
        .catch(function(error) {
          console.error(error);
        });
    }

    $scope.signIn = function() {
      Auth.$signInWithEmailAndPassword($scope.credentials.email, $scope.credentials.password).then(function(firebaseUser) {
        saveUserToFirebase(firebaseUser);
      }).catch(function(error) {
        console.error("Authentication failed:", error);
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
