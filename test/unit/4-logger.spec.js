describe("logger", function () {
  it("should have all logging levels", function () {
    ['silly', 'trace', 'debug', 'info', 'warn', 'error'].forEach(function (level) {
      engine.logger[level].apply(this,['test']);
    });
  });
});