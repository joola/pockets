describe("listener", function () {
  xit("should listen for a wallet update", function (done) {
    engine.listener.add('mpSKAvSLeZTHbstNEzYKs7fxw9fat6a1Y5');
    engine.events.on('wallet-update',done);
    //now send the money
  });
});