angular.module('starter.directives', [])
  .directive('qrcode', function () {
    function link(scope, element, attrs) {
      var handled = false;
      scope.$watch(function () {
        if (scope.pockets && scope.pockets.wallet && scope.pockets.wallet.address && !handled) {
          handled = true;
          new QRCode(element[0], scope.pockets.wallet.address);
        }
      });
    }

    return {
      restrict: 'E',
      template: '<div id="qrcode"></div>',
      link: link,
      replace: true,
      scope: "="
    };
  });