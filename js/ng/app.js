angular.module('FreeCell')
.controller('FreeCellController', 
    [ '$scope',
      'playArea',
      'cardService',
      'movementService',
      'upkeepService',
      'homeCellService',
      function($scope, playArea, cardService, movementService, upkeepService, homeCellService) {

        $scope.$watch('lanes', function(newValue, oldValue) {
          newValue.forEach(function(lane){ 
            var cardToExamine = lane[lane.length - 1],
              availableHomeCell = homeCellService.availableCell(cardToExamine);

            if (!!availableHomeCell) {
              movementService.moveToAssociate(availableHomeCell[0], cardToExamine)(cardToExamine);
            }

          });
          upkeepService.autoAssociate(newValue);
          upkeepService.emptyLaneCleanup(newValue);
        }, true);

        $scope.$watch('freeCells', function(newValue, oldValue) {
          upkeepService.emptyLaneCleanup(newValue);
        }, true);


        
        $scope.lanes = playArea.lanes;
        $scope.freeCells = playArea.freeCells;
        $scope.homeCells = playArea.homeCells;

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

      }]);