describe("events", function () {
  it("should validate a address", function (done) {
    engine.bitcoin.validateWallet({address: 'mpSKAvSLeZTHbstNEzYKs7fxw9fat6a1Y5'}, done);
  });

  it("should fail validating an invalid address", function (done) {
    engine.bitcoin.validateWallet({address: 'mpSKAvSLeZTHbstNEzYKs7fxw9fat6a1Y1'}, function (err) {
      if (err)
        return done();
      return done(new Error('This should fail'));
    });
  });
});