angular.module('services')
  .service('cardService', ['locationService', function(locationService) {
    var selected,
        numberOfCardsSelected = 0;

    function _select(card) {
      card.selected = true;
      numberOfCardsSelected = numberOfCardsSelected + 1;
    }

    function _deselect(card) {
      card.selected = false;
      numberOfCardsSelected = numberOfCardsSelected - 1;
    }

    this.selectCard = function(newCard) {
      this.clearSelected(selected);
      if (locationService.isSelectable(newCard) || newCard.associate()) {
        this.forEachAssociate(newCard, _select);
        selected = newCard;
      }
      if (numberOfCardsSelected > locationService.selectionLimit()) {
        this.clearSelected(selected);
      }
      return selected;
    };

    this.forEachAssociate = function(card, func) {
      while (!!card) {
        func(card);
        card = card.associate();
      }
    };

    this.clearSelected = function(card) {
      this.forEachAssociate(card, _deselect);
      selected = undefined;
    };

    this.selectedCard = function() {
      return selected;
    };

  }]);
