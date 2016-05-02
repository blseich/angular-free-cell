angular.module('FreeCell', ['factories', 'services'])
  .controller('FreeCellController', 
    [ '$scope',
      'playArea',
      'cardService',
      'laneService',
      'movementService',
      function($scope, playArea, cardService, laneService, movementService) {

        $scope.$watch('lanes', function(newValue, oldValue) {
          laneService.autoAssociate(newValue);
        }, true);
        
        $scope.lanes = playArea.lanes;
        $scope.takeAction = function(card) {
          var previouslySelected = cardService.selectedCard();
          if (movementService.isLegalMove(card) && card.associate(previouslySelected)) {
            cardService.forEachAssociate(previouslySelected, movementService.moveToAssociate(card));
            cardService.clearSelected(previouslySelected);
          } else {
            cardService.selectCard(card);
          }
        };
      }])
  .directive('card', function($compile) {

    return {
      scope: {
        value: '=value',
        suit: '=suit',
        selected: '=selected'
      },
      restrict: 'E',
      templateUrl: 'card/card.html',
      link: function(scope, el, attr) {}
    }

  });
