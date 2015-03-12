describe("config", function () {
  it("should save a config value", function () {
    pockets.config.set('test', 'test');
    var value = pockets.config.get('test');
    expect(value).to.equal('test');
  });

  it("should load a config value", function () {
    pockets.config.set('test', 'test');
    var value = pockets.config.get('test');
    expect(value).to.equal('test');
  });
});