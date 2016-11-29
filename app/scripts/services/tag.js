'use strict';

/**
 * @ngdoc service
 * @name miviuApp.Tag
 * @description
 * # Tag
 * Service in the miviuApp.
 */
angular.module('miviuApp')
  .service('Tag', function ($q, $route) {
    var ref = firebase.database().ref();

    // Public API here
    return {
      findObject: function () {
        var deferred = $q.defer();
        var code = $route.current.params.id;
        ref.child("qrcodes").child(code).once('value').then(function (snapshot) {
          if (snapshot.val()) {
            if (snapshot.val().active == true) {
              deferred.resolve(true);
            } else {
              deferred.reject("NO_TAG_FOUND");
            }
          }
          else{
            deferred.reject("NO_TAG_FOUND");
          }
        });
        return deferred.promise;
      }
    };
  });
