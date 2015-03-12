describe("database", function () {
  it("should save a database value", function () {
    pockets.db.set('test', 'test');
    var value = pockets.db.get('test');
    expect(value).to.equal('test');
  });

  it("should load a database value", function () {
    pockets.db.set('test', 'test');
    var value = pockets.db.get('test');
    expect(value).to.equal('test');
  });
});