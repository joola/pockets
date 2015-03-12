describe("config", function () {
  it("should save a config value", function () {
    engine.config.set('test', 'test');
    var value = engine.config.get('test');
    expect(value).to.equal('test');
  });

  it("should load a config value", function () {
    engine.config.set('test', 'test');
    var value = engine.config.get('test');
    expect(value).to.equal('test');
  });
});