describe("database", function () {
  it("should save a database value", function () {
    engine.db.set('test', 'test');
    var value = engine.db.get('test');
    expect(value).to.equal('test');
  });

  it("should load a database value", function () {
    engine.db.set('test', 'test');
    var value = engine.db.get('test');
    expect(value).to.equal('test');
  });
});