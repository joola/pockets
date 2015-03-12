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
          if (err) console.log(err);
        });

        $state.go('tab.pockets');
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

    engine.pockets.get({name: $scope.pocketName}).then(function (err, result) {
      if (err)
        throw err;
      $scope.pockets = result;
    }).error(function (err) {
      if (err)
        throw err;
    });

    /*
     $scope.pockets = {
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
     */

    $scope.selectPocket = function (pocketName, hasChildren) {
      if (hasChildren)
        $state.go('tab.pockets', {pocketName: pocketName});
      else
        $state.go('tab.pocket-details', {pocketName: pocketName});
    };
    $scope.addPocket = function () {
      $scope.newpocket = {};
      var myPopup = $ionicPopup.show({
        template: '<div class="list">' +
        '<label class="item item-input item-select">' +
        '<span class="input-label">Parent</span>' +
        '<select ng-model="newpocket.parent">' +
        '<option ng-repeat="(key, pocket) in pockets.pockets" value="{{pocket.name}}">{{pocket.name}}</option>' +
        '</select>' +
        '</label>' +
        '<label class="item item-input">' +
        '<span class="input-label">Pocket name</span>' +
        '<input ng-model="newpocket.name" type="text" placeholder="My new pocket">' +
        '</label>' +
        '<label class="item item-input">' +
        '<span class="input-label">Ratio</span>' +
        '<input ng-model="newpocket.ratio" type="number" placeholder="20">' +
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
        engine.pockets.create($scope.newpocket).then(function () {
          //$state.go('')
        }).error(function (err) {
          if (err)
            throw err;
        });
      });
    }
  })
  .controller('pocketDetailsCtrl', function ($scope, $state, $stateParams) {
    $

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
