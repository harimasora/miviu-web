'use strict';

/**
 * @ngdoc service
 * @name miviuApp.Profile
 * @description
 * # Profile
 * Service in the miviuApp.
 */
angular.module('miviuApp')
  .service('Profile', function ($firebaseObject) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return function (uid) {
      var usersRef = firebase.database().ref('users').child(uid);
      return $firebaseObject(usersRef);
    };
  });
