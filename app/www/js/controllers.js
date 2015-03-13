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
      wallet: {
        address: 'mqoVHUCZGneDUy7Z7mNCdqPmHSTUXicG8r',
        key: 'cS15SvoeH6cwTL9mfZGK3dpEpCDprFq7K4b1zEeLV5CpxUf3wYFY'
      },
      pockets: {
        Savings: {
          parent: 'root',
          name: 'Savings',
          hard_ratio: 0.33,
          color: '#8e44ad',
          pockets: {
            House: {
              name: 'House',
              parent: 'savings',
              hard_ratio: 0.7
            },
            TV: {
              name: 'TV',
              parent: 'savings',
              hard_ratio: 0.3
            }
          }
        },
        Spending: {
          parent: 'root',
          name: 'Spending',
          hard_ratio: 0.333,
          color: '#2c3e50',
          pockets: {
            'Shopping': {
              parent: 'spending',
              name: 'shopping',
              hard_ratio: 0.4
            },
            'Cigarettes': {
              parent: 'spending',
              name: 'cigarettes',
              hard_ratio: 0.3
            },
            Rent: {
              parent: 'spending',
              name: 'Rent',
              hard_ratio: 0.3
            }
          }
        },
        Testing: {
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
      $scope.$digest();
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

    $scope.spend = function () {
      $scope.data = {};
      var myPopup = $ionicPopup.show({
        template: '<div class="list">' +
        '<label class="item item-input item-select">' +
        '<span class="input-label">Spend from</span>' +
        '<select ng-model="data.pocket">' +
        '<option ng-repeat="(key, pocket) in pockets.pockets" value="{{pocket.name}}">{{pocket.name}}</option>' +
        '</select>' +
        '</label>' +
        '<label class="item item-input">' +
        '<span class="input-label">Amount</span>' +
        '<input ng-model="data.amount" type="number" placeholder="0.01">' +
        '</label>' +
        '<label class="item item-input">' +
        '<span class="input-label">To address</span>' +
        '<input ng-model="data.toAddress" type="text" placeholder="0.01">' +
        '</label>' +
        '<br><div style="text-align:center"><button class="btn btn-primary" ng-click="scanQR()">Scan</button></div>' +
        '</div>',
        title: 'Send money',
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: '<b>Send</b>',
            type: 'button-positive',
            onTap: function (e) {
              if (!$scope.data) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.result;
              }
            }
          }
        ]
      });
      myPopup.then(function (res) {
        console.log($scope.data);
      });
    };

    $scope.editPocket = function (pocketName) {
      engine.pockets.get({name: pocketName}).then(function (result) {
        $scope.result = result;
        var myPopup = $ionicPopup.show({
          template: '<div class="list">' +
          '<label class="item item-input item-select">' +
          '<span class="input-label">Parent</span>' +
          '<select ng-model="result.parent">' +
          '<option value="root">root</option>' +
          '<option ng-repeat="(key, pocket) in result.pockets" value="{{result.name}}">{{pocket.name}}</option>' +
          '</select>' +
          '</label>' +
          '<label class="item item-input">' +
          '<span class="input-label">Pocket name</span>' +
          '<input ng-model="result.name" type="text" placeholder="My new pocket">' +
          '</label>' +
          '<label class="item item-input">' +
          '<span class="input-label">Ratio</span>' +
          '<input ng-model="result.hard_ratio" type="number" placeholder="20">' +
          '</label>' +
          '<label class="item item-input">' +
          '<span class="input-label">Color</span>' +
          '<input ng-model="result.color" type="text" placeholder="#cccccc">' +
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
          '<input ng-model="result.limit" type="number" placeholder="1">' +
          '</label>' +
          '</div>',
          title: 'Edit pocket',
          scope: $scope,
          buttons: [
            {text: 'Cancel'},
            {
              text: '<b>Save</b>',
              type: 'button-positive',
              onTap: function (e) {
                if (!$scope.result) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  return $scope.result;
                }
              }
            }
          ]
        });
        myPopup.then(function (res) {
          engine.pockets.update(res).then(function () {

          }).error(function (err) {
            if (err) throw err;
          });

        });
      }).error(function (err) {
        if (err)
          throw err;
      });
    };

    $scope.pocketHold = function (pocketName) {
      var myPopup = $ionicPopup.alert({
        template: "<div>Delete?</div>",
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: '<b>Delete</b>',
            type: 'button-positive',
            onTap: function () {
              return true
            }
          }
        ]
      });
      myPopup.then(function (res) {
        if (res) {
          engine.pockets.delete({name: pocketName}).then(function () {

          }).error(function (err) {
            if (err)
              throw err;
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
      $state.go('tab.rootinfo');
    }
  })

  .controller('rootinfoCtrl', function ($scope, $ionicPopup) {
    engine.pockets.get({name: 'root'}).then(function (pockets) {
      $scope.pockets = pockets;
    }).error(function (err) {
      if (err)
        throw err;
    });
    $scope.spendDialog = function () {
      $scope.data = {};
      var myPopup = $ionicPopup.show({
        template: '<label class="item item-input">' +
        '<span class="input-label">Amount</span>' +
        '<input ng-model="data.amount" type="number" placeholder="0.01">' +
        '</label>' +
        '<label class="item item-input">' +
        '<span class="input-label">To address</span>' +
        '<input ng-model="data.toAddress" type="text" placeholder="0.01">' +
        '</label>' +
        '<br><div style="text-align:center"><button class="btn btn-primary" ng-click="scanQR()">Scan</button></div>',
        title: 'Spend from parent wallet',
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: '<b>Send!</b>',
            type: 'button-positive'
          }
        ]
      });
      myPopup.then(function (res) {
        if (res) {
          engine.bitcoin.sendMoney({
            from: {
              name: 'root',
              wallet: {
                address: $scope.pockets.wallet.address,
                key: $scope.pockets.wallet.key
              }
            },
            to: {
              name: 'test',
              wallet: {
                address: $scope.data.toAddress
              }
            },
            amount: $scope.data.amount
          }).then(function (result) {
            console.log(result);
          }).error(function (err) {
            console.log(err);
          });
          console.log($scope.pockets.name, $scope.data.toAddress, $scope.data.amount);
        }
      });
    };
    console.log('in root');
  })

  .controller('pocketDetailsCtrl', function ($scope, $state, $ionicPopup, $stateParams, $cordovaBarcodeScanner) {
    engine.pockets.get({name: $stateParams.pocketName}).then(function (result) {
      $scope.pockets = result;
      $scope.$digest();
    });
    $scope.scanQR = function () {
      $cordovaBarcodeScanner.scan().then(function (imageData) {
        $scope.data.toAddress = imageData.text;
      }, function (error) {
        console.log("An error happened -> " + error);
      });
    };
    $scope.spendDialog = function () {
      $scope.data = {};
      var myPopup = $ionicPopup.show({
        template: '<label class="item item-input">' +
        '<span class="input-label">Amount</span>' +
        '<input ng-model="data.amount" type="number" placeholder="0.01">' +
        '</label>' +
        '<label class="item item-input">' +
        '<span class="input-label">To address</span>' +
        '<input ng-model="data.toAddress" type="text" placeholder="0.01">' +
        '</label>' +
        '<br><div style="text-align:center"><button class="btn btn-primary" ng-click="scanQR()">Scan</button></div>',
        title: 'Spend from ' + $scope.pockets.name,
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: '<b>Send!</b>',
            type: 'button-positive'
          }
        ]
      });
      myPopup.then(function (res) {
        if (res) {
          engine.bitcoin.sendMoney({
            from: {
              name: $scope.pockets.name,
              wallet: {
                address: $scope.pockets.wallet.address,
                key: $scope.pockets.wallet.key
              }
            },
            to: {
              name: 'test',
              wallet: {
                address: $scope.data.toAddress
              }
            },
            amount: $scope.data.amount
          }).then(function (result) {
            console.log(result);
          }).error(function (err) {
            console.log(err);
          });
          console.log($scope.pockets.name, $scope.data.toAddress, $scope.data.amount);
        }
      });
    };
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
