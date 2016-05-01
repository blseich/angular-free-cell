angular.module('services', ['factories'])
  .service('cardService', ['laneService', function(laneService) {
    var selected;
    this.selectCard = function(newCard) {
      _deselect = function(card) {card.selected = false;};
      _select = function(card) {card.selected = true;};
      if (laneService.isFirstInLane(newCard) || newCard.associate()) {
        this.forEachAssociate(selected, _deselect);
        this.forEachAssociate(newCard, _select);
        selected = newCard;
      }
      return selected;
    };

    this.forEachAssociate = function(card, func) {
      while(!!card) {
        func(card);
        card = card.associate();
      }
    }
  }])
  .service('laneService', ['playArea', function(playArea) {
    var lanes = playArea.lanes;

    this.isFirstInLane = function(card) {
      var laneContainingCard = lanes.find(function(lane) {
        return lane.includes(card);
      });
      return !!laneContainingCard && 
        laneContainingCard.indexOf(card) === laneContainingCard.length - 1;
    };

    this.laneContaining = function(card) {
      return lanes.find(function(lane) {
        return !!lane.find(function(checkCard) {
          return checkCard === card;
        });
      });
    };

    this.autoAssociate = function(newLanes) {
      newLanes.forEach(function(lane) {
        var cardsLeftInLane = lane.length,
            card = lane[cardsLeftInLane - 1],
            nextCard = lane[cardsLeftInLane - 2];
        while (cardsLeftInLane > 1 && nextCard.associate(card)) {
          cardsLeftInLane--;
          card = nextCard;
          nextCard = lane[cardsLeftInLane - 2];
        }
      });
      
    };

  }]);