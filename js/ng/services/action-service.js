angular.module('services')
  .service('actionService', ['movementService', 'cardService', function(movementService, cardService) {
    
    this.playAreaCardAction = function(card) {
      var previouslySelected = cardService.selectedCard();
          
      if (movementService.isLegalMove(card) && card.associate(previouslySelected)) {
        cardService.forEachAssociate(previouslySelected, movementService.moveToAssociate(card));
        cardService.clearSelected(previouslySelected);
      } else {
        cardService.selectCard(card);
      }
    };

    this.freeCellCardAction = function(card) {
      var previouslySelectedCard = cardService.selectedCard();
      if(card.isNull && !!previouslySelectedCard && !previouslySelectedCard.associate()) {
        cardService.forEachAssociate(previouslySelectedCard, movementService.moveToAssociate(card));
        cardService.clearSelected(previouslySelectedCard);
      } else if(!card.isNull) {
        cardService.selectCard(card);
      }
    };

  }]);