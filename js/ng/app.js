angular.module('FreeCell')
.controller('FreeCellController', 
    [ '$scope',
      'playArea',
      'cardService',
      'movementService',
      'upkeepService',
      function($scope, playArea, cardService, movementService, upkeepService) {

        $scope.$watch('lanes', function(newValue, oldValue) {
          for(lane in newValue) {
            var card = newValue[lane][6] || Card.NULL_CARD();
            for(homeCell in $scope.homeCells) {
              if($scope.homeCells[homeCell].length === 0) {
                $scope.homeCells[homeCell].push(card);
                break;
              }
            }
            
          }
          // $scope.homeCells[0].push(newValue[0][6]);
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