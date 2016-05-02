angular.module('services')
  .service('movementService', ['cardService', 'laneService', function(cardService, laneService) {
    this.isLegalMove = function(card) {
      return !!cardService.selectedCard() && laneService.isFirstInLane(card) 
        && !card.associate() && card.associate(cardService.selectedCard());
    }
  }]);