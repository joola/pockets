var
  _ = require('underscore'),
  traverse = require('traverse');

describe("balancing", function () {
  it("should play out half", function (done) {
    engine.pockets.create({
      parent: null,
      name: 'root',
      description: '',
      pockets: {
        savings: {
          name: 'savings',
          pockets: {
            house: {
              name: 'house'
            },
            pension: {
              name: 'pension'
            }
          }
        },
        life: {
          name: 'life',
          pockets: {
            rent: {
              name: 'rent'
            },
            food: {
              name: 'food'
            }
          }
        }
      }
    }, function (err) {
      if (err)
        return done(err);

      engine.pockets.list({mock: true}, function (err, pockets) {
        if (err)
          return done(err);

        traverse.map(pockets, function (x) {
          if (x && typeof x === 'object' && x.name) {
            if (x.hasOwnProperty('level_ratio'))
              expect(x.level_ratio).to.equal(0.5);
          }
        });
        done();
      });
    });
  });

  it("should play out thirds", function (done) {
    engine.pockets.create({
      parent: null,
      name: 'root',
      description: '',
      pockets: {
        savings: {
          name: 'savings',
          pockets: {
            house: {
              name: 'house'
            },
            pension: {
              name: 'pension'
            },
            college_fund: {
              name: 'college_fund'
            }
          }
        },
        life: {
          name: 'life',
          pockets: {
            rent: {
              name: 'rent'
            },
            food: {
              name: 'food'
            },
            cleaning: {
              name: 'cleaning'
            }
          }
        }
      }
    }, function (err) {
      if (err)
        return done(err);

      engine.pockets.list({mock: true}, function (err, pockets) {
        if (err)
          return done(err);

        traverse.map(pockets, function (x) {
          if (x && typeof x === 'object' && x.name) {
            if (x.level == 1 && x.leaf) {
              expect(x.level_ratio).to.equal(0.5);
              expect(x.actual_ratio).to.equal(0.5);
            }
            else if (x.level == 2 && x.leaf) {
              expect(x.level_ratio).to.equal(1 / 3);
              expect(x.actual_ratio).to.equal(1 / 6);
            }
          }
        });
        done();
      });
    });
  });

  it("should play out mixed", function (done) {
    engine.pockets.create({
      parent: null,
      name: 'root',
      description: '',
      pockets: {
        savings: {
          name: 'savings',
          pockets: {
            house: {
              name: 'house'
            },
            pension: {
              name: 'pension'
            }
          }
        },
        life: {
          name: 'life',
          pockets: {
            rent: {
              name: 'rent'
            },
            food: {
              name: 'food'
            },
            cleaning: {
              name: 'cleaning'
            }
          }
        }
      }
    }, function (err) {
      if (err)
        return done(err);

      engine.pockets.list({mock: true}, function (err, pockets) {
        if (err)
          return done(err);

        traverse.map(pockets, function (x) {
          if (x && typeof x === 'object' && x.name) {
            if (x.level == 1 && x.leaf) {
              expect(x.level_ratio).to.equal(0.5);
              expect(x.actual_ratio).to.equal(0.5);
            }
            else if (x.level == 2 && x.path.indexOf('savings.') > -1 && x.leaf) {
              expect(x.level_ratio).to.equal(1 / 2);
              expect(x.actual_ratio).to.equal(1 / 4);
            }
            else if (x.level == 2 && x.leaf) {
              expect(x.level_ratio).to.equal(1 / 3);
              expect(x.actual_ratio).to.equal(1 / 6);
            }
          }
        });
        done();
      });
    });
  });

  it("should balance", function (done) {
    engine.pockets.create({
      parent: null,
      name: 'root',
      description: '',
      pockets: {
        savings: {
          name: 'savings',
          pockets: {
            house: {
              name: 'house'
            },
            pension: {
              name: 'pension'
            }
          }
        },
        life: {
          name: 'life',
          pockets: {
            rent: {
              name: 'rent'
            },
            food: {
              name: 'food',
              pockets: {
                vitamins: {
                  name: 'vitamins'
                },
                beer: {
                  name: 'beer'
                }
              }
            }
          }
        }
      }
    }, function (err) {
      if (err)
        return done(err);

      engine.pockets.ROOT.wallet.balance = 0;
      engine.pockets.ROOT.pockets.savings.pockets.house.wallet.balance = 100;
      engine.pockets.ROOT.pockets.savings.pockets.pension.wallet.balance = 100;
      engine.pockets.ROOT.pockets.life.pockets.rent.wallet.balance = 100;
      engine.pockets.ROOT.pockets.life.pockets.food.pockets.vitamins.wallet.balance = 50;
      engine.events.once('equilibrium', function () {
        done();
      });
      engine.events.emit('wallet-update');
    });
  });

  it("should balance changes", function (done) {
    engine.pockets.create({
      parent: null,
      name: 'root',
      description: '',
      pockets: {
        savings: {
          name: 'savings',
          pockets: {
            house: {
              name: 'house'
            },
            pension: {
              name: 'pension'
            }
          }
        },
        life: {
          name: 'life',
          pockets: {
            rent: {
              name: 'rent'
            },
            food: {
              name: 'food'
            }
          }
        }
      }
    }, function (err) {
      if (err)
        return done(err);

      engine.pockets.ROOT.wallet.balance = 0;
      engine.pockets.ROOT.pockets.savings.pockets.house.wallet.balance = 100;
      engine.pockets.ROOT.pockets.savings.pockets.pension.wallet.balance = 100;
      engine.pockets.ROOT.pockets.life.pockets.rent.wallet.balance = 100;
      engine.pockets.ROOT.pockets.life.pockets.food.wallet.balance = 50;
      engine.events.once('equilibrium', function () {
        engine.pockets.ROOT.wallet.balance = 100;
        engine.events.once('equilibrium', function () {
          done();
        });
        engine.events.emit('wallet-update');
      });
      engine.events.emit('wallet-update');
    });
  });

  it("should balance create pocket", function (done) {
    engine.pockets.create({
      parent: null,
      name: 'root',
      description: '',
      pockets: {
        savings: {
          name: 'savings',
          pockets: {
            house: {
              name: 'house'
            },
            pension: {
              name: 'pension'
            }
          }
        },
        life: {
          name: 'life',
          pockets: {
            rent: {
              name: 'rent'
            },
            food: {
              name: 'food'
            }
          }
        }
      }
    }, function (err) {
      if (err)
        return done(err);

      engine.pockets.ROOT.wallet.balance = 0;
      engine.pockets.ROOT.pockets.savings.pockets.house.wallet.balance = 100;
      engine.pockets.ROOT.pockets.savings.pockets.pension.wallet.balance = 100;
      engine.pockets.ROOT.pockets.life.pockets.rent.wallet.balance = 100;
      engine.pockets.ROOT.pockets.life.pockets.food.wallet.balance = 50;
      engine.events.once('equilibrium', function () {
        engine.events.once('equilibrium', function () {
          done();
        });
        engine.pockets.create({
          parent: 'life',
          name: 'play'
        });
      });
      engine.events.emit('wallet-update');
    });
  });

  it("should balance delete pocket", function (done) {
    //this.timeout(10000);
    engine.pockets.create({
      parent: null,
      name: 'root',
      description: '',
      pockets: {
        savings: {
          name: 'savings',
          pockets: {
            house: {
              name: 'house'
            },
            pension: {
              name: 'pension'
            }
          }
        },
        life: {
          name: 'life',
          pockets: {
            rent: {
              name: 'rent'
            },
            food: {
              name: 'food'
            }
          }
        }
      }
    }, function (err) {
      if (err)
        return done(err);

      engine.pockets.ROOT.wallet.balance = 0;
      engine.pockets.ROOT.pockets.savings.pockets.house.wallet.balance = 100;
      engine.pockets.ROOT.pockets.savings.pockets.pension.wallet.balance = 100;
      engine.pockets.ROOT.pockets.life.pockets.rent.wallet.balance = 100;
      engine.pockets.ROOT.pockets.life.pockets.food.wallet.balance = 50;
      engine.events.once('equilibrium', function () {
        engine.events.once('equilibrium', function () {
          done();
        });
        engine.pockets.delete({
          parent: 'life',
          name: 'rent'
        }, function () {
        });
      });
      engine.events.emit('wallet-update');
    });
  });

  it("should handle incorrect percentage breakdown", function (done) {
    this.timeout(5000);
    engine.pockets.create({
      parent: null,
      name: 'root',
      description: '',
      pockets: {
        savings: {
          name: 'savings',
          pockets: {
            house: {name: 'house'},
            pension: {name: 'pension', hard_ratio: 0.3}
          }
        },
        life: {
          name: 'life',
          pockets: {
            rent: {name: 'rent'},
            food: {
              name: 'food',
              pockets: {
                vitamins: {name: 'vitamins'},
                beer: {name: 'beer'}
              }
            },
            takeaway: {name: 'takeaway'}
          }
        }
      }
    }, function (err) {
      if (err)
        return done(err);

      engine.pockets.ROOT.wallet.balance = 0;
      engine.pockets.ROOT.pockets.savings.pockets.house.wallet.balance = 100;
      engine.pockets.ROOT.pockets.savings.pockets.pension.wallet.balance = 100;
      engine.pockets.ROOT.pockets.life.pockets.rent.wallet.balance = 100;
      engine.pockets.ROOT.pockets.life.pockets.food.pockets.vitamins.wallet.balance = 50;
      engine.pockets.ROOT.pockets.life.pockets.food.pockets.beer.wallet.balance = 50;
      engine.events.once('equilibrium', function () {
        engine.events.once('equilibrium', function () {
          engine.events.once('equilibrium', function () {
            done();
          });
          engine.pockets.delete({
            parent: 'life',
            name: 'play',
            level_ratio: 0.5
          });
        });
        engine.pockets.create({
          parent: 'life',
          name: 'play',
          level_ratio: 0.5
        });

      });

      engine.events.emit('wallet-update');
    });
  });

  it("should handle limits", function (done) {
    this.timeout(5000);
    engine.pockets.create({
      parent: null,
      name: 'root',
      description: '',
      pockets: {
        savings: {
          name: 'savings',
          pockets: {
            house: {name: 'house'},
            pension: {name: 'pension', hard_ratio: 0.3, limit: 10}
          }
        },
        life: {
          name: 'life',
          pockets: {
            rent: {name: 'rent'},
            food: {
              name: 'food',
              pockets: {
                vitamins: {name: 'vitamins'},
                beer: {name: 'beer'}
              }
            },
            takeaway: {name: 'takeaway'}
          }
        }
      }
    }, function (err) {
      if (err)
        return done(err);

      engine.pockets.ROOT.wallet.balance = 0;
      engine.pockets.ROOT.pockets.savings.pockets.house.wallet.balance = 100;
      engine.pockets.ROOT.pockets.savings.pockets.pension.wallet.balance = 100;
      engine.pockets.ROOT.pockets.life.pockets.rent.wallet.balance = 100;
      engine.pockets.ROOT.pockets.life.pockets.food.pockets.vitamins.wallet.balance = 50;
      engine.pockets.ROOT.pockets.life.pockets.food.pockets.beer.wallet.balance = 50;
      engine.events.once('equilibrium', function () {
        engine.events.once('equilibrium', function () {
          engine.pockets.realign({}, done);
        });
        engine.pockets.create({
          parent: 'life',
          name: 'play',
          level_ratio: 0.5
        });
      });
      engine.events.emit('wallet-update');
    });
  });

  it("should handle savings", function (done) {
    this.timeout(5000);
    engine.pockets.create({
      parent: null,
      name: 'root',
      description: '',
      pockets: {
        savings: {
          name: 'savings',

          pockets: {
            house: {name: 'house', hard_ratio: 0.3},
            pension: {name: 'pension', savings: true}
          }
        },
        life: {
          name: 'life',
          pockets: {
            rent: {name: 'rent'},
            food: {
              name: 'food',
              pockets: {
                vitamins: {name: 'vitamins'},
                beer: {name: 'beer'}
              }
            },
            takeaway: {name: 'takeaway'}
          }
        }
      }
    }, function (err) {
      if (err)
        return done(err);

      engine.pockets.ROOT.wallet.balance = 0;
      engine.pockets.ROOT.pockets.savings.pockets.house.wallet.balance = 100;
      engine.pockets.ROOT.pockets.savings.pockets.pension.wallet.balance = 100;
      engine.pockets.ROOT.pockets.life.pockets.rent.wallet.balance = 100;
      engine.pockets.ROOT.pockets.life.pockets.food.pockets.vitamins.wallet.balance = 50;
      engine.pockets.ROOT.pockets.life.pockets.food.pockets.beer.wallet.balance = 50;
      engine.events.once('equilibrium', function () {
        engine.events.once('equilibrium', function () {
          done();
        });
        engine.pockets.ROOT.wallet.balance = 100;
        engine.events.emit('wallet-update');
      });
      engine.events.emit('wallet-update');
    });
  });

  it("should handle deposits to parent pockets", function (done) {
    this.timeout(5000);
    engine.pockets.create({
      parent: null,
      name: 'root',
      description: '',
      pockets: {
        savings: {
          name: 'savings',
          pockets: {
            house: {name: 'house', hard_ratio: 0.3},
            pension: {name: 'pension', savings: true}
          }
        },
        life: {
          name: 'life',
          pockets: {
            rent: {name: 'rent'},
            food: {
              name: 'food',
              pockets: {
                vitamins: {name: 'vitamins'},
                beer: {name: 'beer'}
              }
            },
            takeaway: {name: 'takeaway'}
          }
        }
      }
    }, function (err) {
      if (err)
        return done(err);

      engine.pockets.ROOT.wallet.balance = 0;
      engine.pockets.ROOT.pockets.savings.pockets.house.wallet.balance = 100;
      engine.pockets.ROOT.pockets.savings.pockets.pension.wallet.balance = 100;
      engine.pockets.ROOT.pockets.life.pockets.rent.wallet.balance = 100;
      engine.pockets.ROOT.pockets.life.pockets.food.pockets.vitamins.wallet.balance = 50;
      engine.pockets.ROOT.pockets.life.pockets.food.pockets.beer.wallet.balance = 50;
      engine.events.once('equilibrium', function () {
        engine.events.once('equilibrium', function () {
          done();
        });
        engine.pockets.ROOT.pockets.life.pockets.food.wallet.balance = 100;
        engine.events.emit('wallet-update');
      });
      engine.events.emit('wallet-update');
    });
  });
});
