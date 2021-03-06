describe("bitcoin", function () {
  before(function () {
    engine.options.mock = false;
  });

  xit("should validate a address", function (done) {
    engine.bitcoin.validateWallet({address: 'mpSKAvSLeZTHbstNEzYKs7fxw9fat6a1Y5'}, done);
  });

  xit("should fail validating an invalid address", function (done) {
    engine.bitcoin.validateWallet({address: 'mpSKAvSLeZTHbstNEzYKs7fxw9fat6a1Y1'}, function (err) {
      if (err)
        return done();
      return done(new Error('This should fail'));
    });
  });

  xit("should check balance for a valid a address", function (done) {
    engine.bitcoin.balance({wallet: {address: 'mqoVHUCZGneDUy7Z7mNCdqPmHSTUXicG8r'}}, done);
  });

  xit("should check balance every interval", function (done) {
    var address = 'mqoVHUCZGneDUy7Z7mNCdqPmHSTUXicG8r';
    engine.listener.balances[address] = -100;
    engine.listener.add(address);
    engine.listener.doInterval();
    setTimeout(done, 2500);
  });

  xit("should send a bitcoin from pocket to pocket", function (done) {
    engine.pockets.create({
      parent: null,
      name: 'root',
      wallet: {
        address: 'mqoVHUCZGneDUy7Z7mNCdqPmHSTUXicG8r',
        key: 'cS15SvoeH6cwTL9mfZGK3dpEpCDprFq7K4b1zEeLV5CpxUf3wYFY'
      },
      pockets: {
        test: {
          parent: 'root',
          name: 'test',
          limit: 0.001,
          wallet: {
            address: 'n14gnULbKCPxJJmxbSiKT9nPxFRZMtutaq',
            key: 'cVdx1w953mFriCNmyAmLxNE2S6CXWi9w7aCC2qH34Aw11BMWTR4J'
          }
        }
      }
    }, function (err) {
      if (err)
        return done(err);

      engine.bitcoin.handleTransaction({
        transactions: [
          {
            from: {
              name: 'root',
              wallet: {
                address: 'mqoVHUCZGneDUy7Z7mNCdqPmHSTUXicG8r',
                key: 'cS15SvoeH6cwTL9mfZGK3dpEpCDprFq7K4b1zEeLV5CpxUf3wYFY'
              }
            },
            to: {
              name: 'test',
              wallet: {
                address: 'n14gnULbKCPxJJmxbSiKT9nPxFRZMtutaq',
                key: 'cVdx1w953mFriCNmyAmLxNE2S6CXWi9w7aCC2qH34Aw11BMWTR4J'
              }
            },
            amount: 0.001
          }
        ]
      }, done)
    });
  });

  xit("should send a bitcoin from pocket to wallet", function (done) {
    engine.pockets.create({
      parent: null,
      name: 'root',
      wallet: {
        address: 'mqoVHUCZGneDUy7Z7mNCdqPmHSTUXicG8r',
        key: 'cS15SvoeH6cwTL9mfZGK3dpEpCDprFq7K4b1zEeLV5CpxUf3wYFY'
      },
      pockets: {
        test: {
          parent: 'root',
          name: 'test',
          limit: 0.001,
          wallet: {
            address: 'n14gnULbKCPxJJmxbSiKT9nPxFRZMtutaq',
            key: 'cVdx1w953mFriCNmyAmLxNE2S6CXWi9w7aCC2qH34Aw11BMWTR4J'
          }
        }
      }
    }, function (err) {
      if (err)
        return done(err);

      engine.bitcoin.sendMoney({
        from: {
          name: 'root',
          wallet: {
            address: 'mqoVHUCZGneDUy7Z7mNCdqPmHSTUXicG8r',
            key: 'cS15SvoeH6cwTL9mfZGK3dpEpCDprFq7K4b1zEeLV5CpxUf3wYFY'
          }
        },
        to: {
          name: 'test',
          wallet: {
            address: 'n14gnULbKCPxJJmxbSiKT9nPxFRZMtutaq',
            key: 'cVdx1w953mFriCNmyAmLxNE2S6CXWi9w7aCC2qH34Aw11BMWTR4J'
          }
        },
        amount: 0.001
      }, done)
    });
  });

  after(function () {
    engine.options.mock = true;
  });
});