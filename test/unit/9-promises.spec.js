describe("promises", function () {
  before(function () {
    engine.promisify();
  });

  it("should promisify", function (done) {
    engine.bitcoin.validateWallet({address: 'mpSKAvSLeZTHbstNEzYKs7fxw9fat6a1Y5'}).then(done).error(function (err) {
      return done(new Error(err))
    });
  });

  it("should promisify", function (done) {
    engine.promisify();
    engine.bitcoin.validateWallet({address: 'mpSKAvSLeZTHbstNEzYKs7fxw9fat6a1Y1'}).then(function () {
      return done(new Error('This should not fail'))
    }).error(function () {
      return done();
    });
  });
});