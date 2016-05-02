angular.module('FreeCell', ['factories', 'services'])
  .controller('FreeCellController', 
    [ '$scope',
      'playArea',
      'cardService',
      'laneService',
      function($scope, playArea, cardService, laneService) {

        var cardAlreadySelected;

        function _moveToAssociate(card) {
          var tempCard = cardAlreadySelected,
              addTo = laneService.laneContaining(card),
              removeFrom = laneService.laneContaining(cardAlreadySelected);
          while(!!tempCard) {
            addTo.push(tempCard);
            removeFrom.pop();
            tempCard = tempCard.associate();
          }
        }

        function _isLegalMove(card) {
          return cardAlreadySelected && !card.associate() && card.associate(cardAlreadySelected);
        }

        $scope.$watch('lanes', function(newValue, oldValue) {
          laneService.autoAssociate(newValue);
        }, true);

        $scope.lanes = playArea.lanes;
        $scope.takeAction = function(card) {
          if (_isLegalMove(card)) {
            _moveToAssociate(card);
            cardService.clearSelected(cardAlreadySelected);
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
        selected: '=selected'
        //action: '&ngClick'
      },
      restrict: 'E',
      templateUrl: 'card/card.html',
      link: function(scope, el, attr) {
        // el.bind('click', function() {
        //   scope.action();
        // });
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

