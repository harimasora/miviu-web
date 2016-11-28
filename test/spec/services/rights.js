'use strict';

describe('Service: Rights', function () {

  // load the service's module
  beforeEach(module('miviuApp'));

  // instantiate service
  var Rights;
  beforeEach(inject(function (_Rights_) {
    Rights = _Rights_;
  }));

  it('should do something', function () {
    expect(!!Rights).toBe(true);
  });

});
