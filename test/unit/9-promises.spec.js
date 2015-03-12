describe("promises", function () {
  before(function () {
    engine.promisify();
  });

  it("should promisify", function (done) {
    engine.bitcoin.validateWallet({address: 'mpSKAvSLeZTHbstNEzYKs7fxw9fat6a1Y5'}).then(done).error(function (err) {
      return done(new Error(err))
    });
  });

  it("should promisify with error handling", function (done) {
    engine.promisify();
    engine.bitcoin.validateWallet({address: 'mpSKAvSLeZTHbstNEzYKs7fxw9fat6a1Y1'}).then(function () {
      return done(new Error('This should not fail'))
    }).error(function () {
      return done();
    });
  });

  it("should add a student persona in promise", function (done) {
    var student = {
      parent: null,
      name: 'root',
      pockets: {
        savings: {
          parent: 'root',
          name: 'Savings',
          hard_ratio: 0.33,
          color: '#8e44ad',
          pockets: {
            house: {
              name: 'House',
              parent: 'savings',
              hard_ratio: 0.7
            },
            tv: {
              name: 'TV',
              parent: 'savings',
              hard_ratio: 0.3
            }
          }
        },
        spending: {
          parent: 'root',
          name: 'Spending',
          hard_ratio: 0.333,
          color: '#2c3e50',
          pockets: {
            'shopping': {
              parent: 'spending',
              name: 'shopping',
              hard_ratio: 0.4
            },
            'cigarettes': {
              parent: 'spending',
              name: 'cigarettes',
              hard_ratio: 0.3
            },
            rent: {
              parent: 'spending',
              name: 'Rent',
              hard_ratio: 0.3
            }
          }
        },
        testing: {
          parent: 'root',
          color: '#cccccc',
          name: 'testing',
          hard_ratio: 0.333
        }
      }
    };

    engine.pockets.create(student).then(function () {
      return done();
    }).error(function (err) {
      if (err)
        return done(err);
    });
  })
});