'use strict';

/**
 * @ngdoc service
 * @name miviuApp.Object
 * @description
 * # Object
 * Service in the miviuApp.
 */
angular.module('miviuApp')
  .service('Object', function ($firebaseObject) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return function (code) {
      var codesRef = firebase.database().ref('qrcodes').child(code);
      return $firebaseObject(codesRef);
    }
  });
