describe("pockets", function () {
  it("should add a pocket", function (done) {
    engine.pockets.create({
      name: 'root',
      description: ''
    }, done);
  });

  it("should update a pocket", function (done) {
    engine.pockets.update({
      name: 'root',
      description: 'test'
    }, function (err) {
      if (err)
        return done(err);

      expect(engine.pockets.ROOT.description).to.equal('test');
      done();
    });
  });

  it("should create a 1st level pocket", function (done) {
    engine.pockets.create({
      name: 'root',
      description: ''
    }, function (err) {
      if (err)
        return done(err);

      engine.pockets.create({
        parent: 'root',
        name: 'savings'
      }, function (err) {
        if (err)
          return done(err);

        expect(engine.pockets.ROOT.pockets.savings).to.be.ok;
        done();
      });
    });
  });
});