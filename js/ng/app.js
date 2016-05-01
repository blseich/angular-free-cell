angular.module('FreeCell', ['factories', 'services'])
  .controller('FreeCellController', 
    [ '$scope',
      'playArea',
      'indexFunctions',
      'cardService',
      'laneService',
      function($scope, playArea, indexFunctions) {

        var cardAlreadySelected;

        function _moveToAssociate(card) {
          if(card.associate(cardAlreadySelected)) {
            addTo = laneService.laneContaining(card);
            removeFrom = laneService.laneContaining(cardAlreadySelected);
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

        $scope.$watch('lanes', function(newValue, oldValue) {
          laneService.autoAssociate(newValue);
        }, true);

        $scope.lanes = playArea.lanes;
        $scope.takeAction = function(card) {
          //cardService.clearSelected();
          if (_isLegalMove(card)) {
            _moveToAssociate(card);
            cardAlreadySelected = undefined;
          } else {
            cardAlreadySelected = card;
            cardService.selectCard(card);
          }
          return true;
        };
      }])
  .directive('card', function($compile) {

    return {
      scope: {
        value: '=value',
        suit: '=suit',
        action: '&ngClick'
      },
      restrict: 'E',
      templateUrl: 'card/card.html',
      link: function(scope, el, attr) {
        scope.selected = false;
        el.bind('click', function() {
          scope.selected = true;
          scope.action();
        });
      }
    }

  });


  
function _toggleSelected(card) {
  var toggleCard = card;
  while(toggleCard) {
    toggleCard.selected = !toggleCard.selected;
    toggleCard = toggleCard.associate();
  }
}

