function shadeBlend(p, c0, c1) {
  var n = p < 0 ? p * -1 : p, u = Math.round, w = parseInt;
  if (c0.length > 7) {
    var f = c0.split(","), t = (c1 ? c1 : p < 0 ? "rgb(0,0,0)" : "rgb(255,255,255)").split(","), R = w(f[0].slice(4)), G = w(f[1]), B = w(f[2]);
    return "rgb(" + (u((w(t[0].slice(4)) - R) * n) + R) + "," + (u((w(t[1]) - G) * n) + G) + "," + (u((w(t[2]) - B) * n) + B) + ")"
  } else {
    var f = w(c0.slice(1), 16), t = w((c1 ? c1 : p < 0 ? "#000000" : "#FFFFFF").slice(1), 16), R1 = f >> 16, G1 = f >> 8 & 0x00FF, B1 = f & 0x0000FF;
    return "#" + (0x1000000 + (u(((t >> 16) - R1) * n) + R1) * 0x10000 + (u(((t >> 8 & 0x00FF) - G1) * n) + G1) * 0x100 + (u(((t & 0x0000FF) - B1) * n) + B1)).toString(16).slice(1)
  }
}

var colors = [
  "#d35400",
  "#c0392b",
  "#2980b9",
  "#7f8c8d"
];

angular.module('starter.controllers', [])
  .controller('homeCtrl', function ($scope, $state) {
    console.log('in home');
    $scope.start = function () {
      console.log('clicked');
      $state.go('tab.persona');
    };
  })
  .controller('personaCtrl', function ($scope, $state) {

    var student = {
      parent: null,
      name: 'root',
      pockets: {
        savings: {
          parent: 'root',
          name: 'Savings',
          hard_ratio: 0.33,
          color: '#8e44ad',
          pockets: {
            house: {
              name: 'House',
              parent: 'savings',
              hard_ratio: 0.7
            },
            tv: {
              name: 'TV',
              parent: 'savings',
              hard_ratio: 0.3
            }
          }
        },
        spending: {
          parent: 'root',
          name: 'Spending',
          hard_ratio: 0.333,
          color: '#2c3e50',
          pockets: {
            'shopping': {
              parent: 'spending',
              name: 'shopping',
              hard_ratio: 0.4
            },
            'cigarettes': {
              parent: 'spending',
              name: 'cigarettes',
              hard_ratio: 0.3
            },
            rent: {
              parent: 'spending',
              name: 'Rent',
              hard_ratio: 0.3
            }
          }
        },
        testing: {
          parent: 'root',
          color: '#cccccc',
          name: 'testing',
          hard_ratio: 0.333
        }
      }
    };
    $scope.choosePersona = function (persona) {
      if (persona === 'student') {
        engine.pockets.create(student).then(function () {
          $state.go('tab.pockets');
        }).error(function (err) {
          if (err) throw err;
        });
      }
    };
  })
  .controller('settingsCtrl', function ($scope) {
    $scope.fee = 0.0001;
    $scope.save = function () {
      engine.config.set({fee: $scope.fee});
    };
  })
  .controller('pocketsCtrl', function ($scope, $state, $stateParams, $ionicPopup) {
    $scope.pocketName = $stateParams.pocketName;
    if ($stateParams.pocketName === '')
      $scope.pocketName = 'root';

    engine.pockets.get({name: $scope.pocketName}).then(function (result) {
      var currentColor = result.color;
      var i = 1;

      for (var k in result.pockets) {
        if (result.pockets.hasOwnProperty(k)) {
          if (!result.pockets[k].color && result.pockets[k] != 'root')
            result.pockets[k].color = shadeBlend(i / 10, currentColor);
        }
        i++;
      }

      $scope.pockets = result;
    }).error(function (err) {
      if (err)
        throw err;
    });

    $scope.selectPocket = function (pocketName, hasChildren) {
      if (hasChildren)
        $state.go('tab.pockets', {pocketName: pocketName});
      else
        $state.go('tab.pocket-details', {pocketName: pocketName});
    };
    $scope.pocketHold = function(pocketName) {
      var myPopup = $ionicPopup.alert({
        template: "<div>Delete?</div>",
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: '<b>Delete</b>',
            type: 'button-positive',
            onTap: function() {
              return true
            }
          }
        ]
      });
      myPopup.then(function(res) {
        if (res) {
          engine.pockets.delete({name: pocketName}).then(function() {

          });
        }
      });
    };
    $scope.addPocket = function () {
      $scope.newpocket = {};
      var myPopup = $ionicPopup.show({
        template: '<div class="list">' +
        '<label class="item item-input item-select">' +
        '<span class="input-label">Parent</span>' +
        '<select ng-model="newpocket.parent">' +
        '<option value="root">root</option>' +
        '<option ng-repeat="(key, pocket) in pockets.pockets" value="{{pocket.name}}">{{pocket.name}}</option>' +
        '</select>' +
        '</label>' +
        '<label class="item item-input">' +
        '<span class="input-label">Pocket name</span>' +
        '<input ng-model="newpocket.name" type="text" placeholder="My new pocket">' +
        '</label>' +
        '<label class="item item-input">' +
        '<span class="input-label">Ratio</span>' +
        '<input ng-model="newpocket.hard_ratio" type="number" placeholder="20">' +
        '</label>' +
        '<label class="item item-input">' +
        '<span class="input-label">Color</span>' +
        '<input ng-model="newpocket.color" type="text" placeholder="#cccccc">' +
        '</label>' +
        '<label class="item item-input item-select">' +
        '<span class="input-label">Importance</span>' +
        '<select>' +
        '<option value="low">Low</option>' +
        '<option value="high">High</option>' +
        '</select>' +
        '</label>' +
        '<label class="item item-input">' +
        '<span class="input-label">Limit</span>' +
        '<input ng-model="newpocket.limit" type="number" placeholder="1">' +
        '</label>' +
        '</div>',
        title: 'Add a new pocket',
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: '<b>Add</b>',
            type: 'button-positive',
            onTap: function (e) {
              if (!$scope.newpocket) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.newpocket;
              }
            }
          }
        ]
      });
      myPopup.then(function (res) {
        $scope.newpocket.hard_ratio = $scope.newpocket.hard_ratio / 100;
        engine.pockets.create($scope.newpocket).then(function () {
          //$state.go('')
        }).error(function (err) {
          if (err)
            throw err;
        });
      });
    };
    $scope.rootInfo = function () {
      var myPopup = $ionicPopup.show({
        template: '<div>QR</div>',
        title: 'Info',
        scope: $scope,
        buttons: [
          {
            text: '<b>OK</b>',
            type: 'button-positive'
          }
        ]
      });
      myPopup.then(function (res) {

      });
    };
  })
  .controller('pocketDetailsCtrl', function ($scope, $state, $stateParams) {

  })
  .controller('DashCtrl', function ($scope) {
  })

  .controller('ChatsCtrl', function ($scope, Chats) {
    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    }
  })
  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
