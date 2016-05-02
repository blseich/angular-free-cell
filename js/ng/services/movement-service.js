angular.module('services')
  .service('movementService', ['cardService', 'laneService', function(cardService, laneService) {
    this.isLegalMove = function(card) {
      return !!cardService.selectedCard() && laneService.isFirstInLane(card) 
        && !card.associate();// && card.associate(cardService.selectedCard());
    }

    this.moveToAssociate = function(card) {
      var cardToMove = cardService.selectedCard(),
          removeFrom, addTo;
      removeFrom = laneService.laneContaining(cardToMove),
      addTo = laneService.laneContaining(card);
      return function(card) {
        addTo.push(card);
        removeFrom.pop();
      }
    };

  }]);