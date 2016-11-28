'use strict';

/**
 * @ngdoc service
 * @name miviuApp.Rights
 * @description
 * # Rights
 * Factory in the miviuApp.
 */
angular.module('miviuApp')
  .factory('Rights', function ($q, $route) {
    var ref = firebase.database().ref();

    // Public API here
    return {
      hasOwnerAccess: function (user) {
        var deferred = $q.defer();
        var code = $route.current.params.id;
        ref.child("qrcodes").child(code).once('value').then(function (snapshot) {
          if (snapshot.val()) {
            if (snapshot.val().prop == user.uid) {
              deferred.resolve(true);
            } else {
              deferred.reject("NO_OWNER_ACCESS");
            }
          }
          else{
            deferred.reject("NO_OWNER_ACCESS");
          }
        });
        return deferred.promise;
      }
    };
  });
