function Card(value, suit) {
  function _notLegalAssociate(associateCard) {
    return _color(associateCard.suit) === _color(suit) || _numValue(value) - 1 !== _numValue(associateCard.value);
  }

  function _numValue(cardVal) {
    var faceCardValues = {
      A: 1,
      J: 11,
      Q: 12,
      K: 13
    };
    return faceCardValues[cardVal] || parseInt(cardVal);
  }

  function _color(suit) {
    return suit === 'S' || suit === 'C' ? 'black' : 'red';
  }

  function associate(associateCard) {
    if (!!associateCard) {
      if (_notLegalAssociate(associateCard)) {
        return false;
      }
      this.associateCard = associateCard;
      return true;
    }

    return this.associateCard;
  }

  function disassociate() {
    this.associateCard = undefined;
  }

  return {
    //Fields
    value: value,
    suit: suit,

    //Functions
    associate: associate,
    disassociate: disassociate
  };
}
Card.NULL_CARD = function() {
  return {
    suit: '',
    value: '',
    associate: function(card) {
      return !!card && !card.isNull;
    },
    isNull: true
  };
};

