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
        $scope.freeCells = playArea.freeCells;

        $scope.takeAction = function(card) {
          var previouslySelected = cardService.selectedCard();
          if (movementService.isLegalMove(card) && card.associate(previouslySelected)) {
            cardService.forEachAssociate(previouslySelected, movementService.moveToAssociate(card));
            cardService.clearSelected(previouslySelected);
          } else {
            cardService.selectCard(card);
          }
        };

        $scope.freeCellAction = function(cell) {
          if(cell.length === 0) {
            var  previouslySelected = cardService.selectedCard();
            cell.push(previouslySelected);
            cardService.clearSelected(previouslySelected);
            laneService.laneContaining(previouslySelected).pop();
          } else {
            $scope.takeAction(cell.pop());
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
    };

  });
