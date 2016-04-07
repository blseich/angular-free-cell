angular.module('FreeCell', ['factories'])
  .controller('FreeCellController', 
    [ '$scope',
      'playArea',
      'indexFunctions',
      function($scope, playArea, indexFunctions) {

        var cardAlreadySelected;

        function _getCardLane(card) {
          var cardIndex, laneIndex;
          laneIndex = $scope.lanes.findIndex(function(lane) {
            return !!lane.find(function(checkCard) {
              return checkCard === card;
            });
          });
          return laneIndex;
        }

        function _moveToAssociate(card) {
          if(card.associate(cardAlreadySelected)) {
            addTo = $scope.lanes[_getCardLane(card)];
            removeFrom = $scope.lanes[_getCardLane(cardAlreadySelected)];
            while(!!cardAlreadySelected) {
              addTo.push(cardAlreadySelected);
              removeFrom.pop();
              cardAlreadySelected = cardAlreadySelected.associate();
            }
          }
        }

        function _isLegalMove(card) {
          return cardAlreadySelected && !card.associate();
        }

        function _isIllegalSelection(card) {
          return !indexFunctions.isFirstInLane(card) && !card.associate();
        }

        $scope.$watch('lanes', function(newValue, oldValue) {
          for (var i = 0; i < 8; i++) {
            if (newValue[i].length > 0) {
              newValue[i][newValue[i].length - 1].disassociate();
            }
            if(newValue[i].length > 1) {
              var currentCard = newValue[i].length - 2,
                cardToAssociate = newValue[i].length - 1;
              while(!!newValue[i][currentCard] && newValue[i][currentCard].associate(newValue[i][cardToAssociate])) {
                currentCard--;
                cardToAssociate--;
              }
            }
          }
        }, true);

        $scope.lanes = playArea.lanes;
        $scope.takeAction = function(card) {
          if(_isIllegalSelection(card)) {
            return false;
          }
          _toggleSelected(cardAlreadySelected);
          if (_isLegalMove(card)) {
            _moveToAssociate(card);
            cardAlreadySelected = undefined;
          } else {
            cardAlreadySelected = card;
            _toggleSelected(card);
          }
          return true;
        };
      }]);


  
function _toggleSelected(card, selected) {
  var toggleCard = card;
  while(toggleCard) {
    toggleCard.selected = !toggleCard.selected;
    toggleCard = toggleCard.associate();
  }
}

