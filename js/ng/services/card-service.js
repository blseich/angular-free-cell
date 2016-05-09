angular.module('services')
  .service('cardService', ['locationService', function(locationService) {
    var selected;
    this.selectCard = function(newCard) {
      _select = function(card) {card.selected = true;};
      this.clearSelected(selected);
      if (locationService.isSelectable(newCard) || newCard.associate()) {
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
    };

    this.clearSelected = function(card) {
      _deselect = function(card) {card.selected = false;};
      this.forEachAssociate(card, _deselect);
      selected = undefined;
    };

    this.selectedCard = function() {
      return selected;
    };

  }])