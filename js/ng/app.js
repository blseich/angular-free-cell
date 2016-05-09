angular.module('FreeCell', ['factories', 'services'])
  .controller('FreeCellController', 
    [ '$scope',
      'playArea',
      'cardService',
      'locationService',
      'movementService',
      'upkeepService',
      function($scope, playArea, cardService, locationService, movementService, upkeepService) {

        $scope.$watch('lanes', function(newValue, oldValue) {
          upkeepService.autoAssociate(newValue);
          upkeepService.emptyLaneCleanup(newValue);
        }, true);

        $scope.$watch('freeCells', function(newValue, oldValue) {
          upkeepService.emptyLaneCleanup(newValue);
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

        $scope.freeCellAction = function(card) {
          var previouslySelectedCard = cardService.selectedCard();
          if(card.isNull && !!previouslySelectedCard && !previouslySelectedCard.associate()) {
            cardService.forEachAssociate(previouslySelectedCard, movementService.moveToAssociate(card));
            cardService.clearSelected(previouslySelectedCard);
          } else if(!card.isNull) {
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
    };

  });
