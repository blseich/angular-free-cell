describe('Deck', function () {

  function _mockCard() {
    return {
      'selected': false,
      'associate': function() {}
    };
  }   

  beforeEach(module('factories'));



  it('should have 52 cards', inject(function(deck) {
    expect(deck.deck).to.have.length(52);
  }));

  it('should shuffle', inject(function(deck) {
    var orderedDeck = JSON.stringify(deck.deck),
        shuffledDeck = (deck.shuffle(), JSON.stringify(deck.deck));
    expect(shuffledDeck).not.to.equal(orderedDeck);
  }));

});