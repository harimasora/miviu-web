'use strict';

/**
 * @ngdoc function
 * @name miviuApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the miviuApp
 */
angular.module('miviuApp')
  .controller('LoginCtrl', function ($scope, $location, $uibModal, Profile, Auth) {

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

    $scope.sendResetEmail = function(email) {
      Auth.$sendPasswordResetEmail(email)
        .then(function () {
          toastr.success('Você receberá as instruições para redefinir a senha de ' + $scope.credentials.email + ' em seu email.', 'Email enviado');
          $scope.modalInstance.close();
        })
        .catch(function(error){
          console.log(error);
          switch (error.code){
            case 'auth/invalid-email':
              toastr.error('Formatação do email inválida', 'Erro ao enviar o email'); break;
            case 'auth/user-not-found':
              toastr.error('Não foi encontrado nenhua conta com este email.', 'Erro ao enviar o email'); break;
            default:
              toastr.error(error.message, 'Erro ao enviar o email'); $scope.modalInstance.close(); break;
          }
        })
    };

    $scope.openModal = function () {
      $scope.modalInstance = $uibModal.open({
        templateUrl: 'views/_resetPasswordModal.html',
        controller: 'LoginCtrl',
        scope: $scope
      });
    }

  });
