'use strict';

describe('Service: Object', function () {

  // load the service's module
  beforeEach(module('miviuApp'));

  // instantiate service
  var Object;
  beforeEach(inject(function (_Object_) {
    Object = _Object_;
  }));

  it('should do something', function () {
    expect(!!Object).toBe(true);
  });

});
