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
          hard_ratio: 0.8,
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
          hard_ratio: 0.2,
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
        }
      }
    };
    $scope.choosePersona = function (persona) {
      if (persona === 'student') {
        engine.pockets.create(student, function (err) {
          if (err)
            throw err;
          $state.go('tab.pockets');
        });
      }
    };
  })

  .controller('pocketsCtrl', function ($scope, $state, $stateParams) {
    $scope.pocketName = $stateParams.pocketName;
    if ($stateParams.pocketName === '')
      $scope.pocketName = 'root';
    engine.pockets.get({name: $scope.pocketName}, function (err, result) {
      if (err)
        throw err;
      $scope.pockets = result;
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
