angular.module('services')
  .service('movementService', ['cardService', 'locationService', function(cardService, locationService) {
    this.isLegalMove = function(card) {
      return !!cardService.selectedCard() && locationService.isSelectable(card) 
        && !card.associate();// && card.associate(cardService.selectedCard());
    }

    this.moveToAssociate = function(card) {
      var cardToMove = cardService.selectedCard(),
          removeFrom, addTo;
      removeFrom = locationService.laneContaining(cardToMove),
      addTo = locationService.laneContaining(card);
      return function(card) {
        addTo.push(card);
        removeFrom.pop();
      }
    };

  }]);