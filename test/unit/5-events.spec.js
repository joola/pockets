describe("events", function () {
  it("should emit events", function () {
    engine.events.emit('test');
  });

  it("should listen to events", function (done) {
    engine.events.on('test', done);
    engine.events.emit('test');

    engine.events.removeListener('test', done);
  });

  it("should listen once events", function (done) {
    engine.events.once('test', done);
    engine.events.emit('test');
    engine.events.emit('test');
  });
});