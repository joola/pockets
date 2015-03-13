angular.module('starter.directives', [])
  .directive('qrcode', function () {
    function link(scope, element, attrs) {
      var handled = false;
      scope.$watch(function() {
        if (scope.pockets && !handled) {
          handled = true;
          new QRCode(document.getElementById("qrcode"), scope.pockets.wallet.address);
        }
      });
    }
    return {
      restrict: 'E',
      template: '<div id="qrcode"></div>',
      link: link,
      scope: "="
    };
  });