'use strict';

describe('Controller: ObjectsCtrl', function () {

  // load the controller's module
  beforeEach(module('miviuApp'));

  var ObjectsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ObjectsCtrl = $controller('ObjectsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ObjectsCtrl.awesomeThings.length).toBe(3);
  });
});
