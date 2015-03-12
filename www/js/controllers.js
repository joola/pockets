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
        pockets.create(student, function(err) {
          if (err)
            throw err;
          $state.go('tab.pockets');
        })
      }
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
