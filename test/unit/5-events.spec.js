describe("events", function () {
  it("should emit events", function () {
    pockets.events.emit('test');
  });

  it("should listen to events", function (done) {
    pockets.events.on('test', done);
    pockets.events.emit('test');
    
    pockets.events.removeListener('test', done);
  });

  it("should listen once events", function (done) {
    pockets.events.once('test', done);
    pockets.events.emit('test');
    pockets.events.emit('test');
  });
});