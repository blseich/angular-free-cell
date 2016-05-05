describe('Play Area', function() {

  function _mockCard() {
    return {
      'selected': false,
      'associate': function() {}
    };
  }   

  beforeEach(module('factories'));

  beforeEach(function() {
    
    mockDeck = {
        shuffle: function () {},
        deck: []
    };

    for (var i = 0; i < 52; i++) {
      var mockCard = _mockCard();
      sinon.spy(mockCard, 'associate');
      mockDeck.deck.push(mockCard);
    }

    sinon.spy(mockDeck, "shuffle");

    module(function ($provide) {
        $provide.value('deck', mockDeck);
    });
  });

  it ('should have 8 lanes', inject(function(playArea) {
    expect(playArea.lanes).to.have.length(8);
  }));

  it ('should have 4 free cells', inject(function(playArea) {
    expect(playArea.freeCells).to.have.length(4);
  }));

  it ('should have 4 finished', inject(function(playArea) {
    expect(playArea.finished).to.have.length(4);
  }));

  it ('should shuffle deck', inject(function(playArea) {
    sinon.assert.calledOnce(mockDeck.shuffle);
  }));

  it ('should deal 7 cards to the first four lanes', inject(function(playArea) {
    expect(playArea.lanes[0]).to.have.length(7);
    expect(playArea.lanes[1]).to.have.length(7);
    expect(playArea.lanes[2]).to.have.length(7);
    expect(playArea.lanes[3]).to.have.length(7);
  }));

  it ('should deal 6 cards to the last four lanes', inject(function(playArea) {
    expect(playArea.lanes[4]).to.have.length(6);
    expect(playArea.lanes[5]).to.have.length(6);
    expect(playArea.lanes[6]).to.have.length(6);
    expect(playArea.lanes[7]).to.have.length(6);
  }));

});