describe('Factories', function() {

  function _mockCard() {
    return {
      'selected': false,
      'associate': function() {}
    };
  }   

  beforeEach(module('factories'));

  describe('Deck', function () {

    it('should have 52 cards', inject(function(deck) {
      expect(deck.deck).to.have.length(52);
    }));

    it('should shuffle', inject(function(deck) {
      var orderedDeck = JSON.stringify(deck.deck),
          shuffledDeck = (deck.shuffle(), JSON.stringify(deck.deck));
      expect(shuffledDeck).not.to.equal(orderedDeck);
    }));

  });

  describe('Play Area', function() {

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

    it ('should have 4 stores', inject(function(playArea) {
      expect(playArea.stores).to.have.length(4);
    }));

    it ('should have 4 finished', inject(function(playArea) {
      expect(playArea.finished).to.have.length(4);
    }));

    it ('should shuffle deck', inject(function(playArea) {
      expect(mockDeck.shuffle.calledOnce).to.equal(true);
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

  describe('Play Area Functions Factory', function() {
    
    beforeEach(function() {
      module(function ($provide) {
          $provide.value('playArea', mockplayArea);
      });
    });

    describe('First In Lane', function() {
      var firstCardInLane, 
        notFirstCardInLane,
        firstCardInDiffLane,
        notFirstCardInDiffLane;

      beforeEach(function() {
        firstCardInLane = _mockCard();
        notFirstInLane = _mockCard();
        firstCardInDiffLane = _mockCard();
        notFirstCardInDiffLane = _mockCard();

        mockplayArea = {
          lanes: [[notFirstInLane, firstCardInLane],[],[],[notFirstCardInDiffLane, firstCardInDiffLane]]
        };
      });


      it('should determine if card is first in first lane', inject(function(indexFunctions) {
        expect(indexFunctions.isFirstInLane(firstCardInLane)).to.be.true;
      }));

      it('should determine if card is not first in first lane', inject(function(indexFunctions) {
        expect(indexFunctions.isFirstInLane(notFirstInLane)).to.be.false;
      }));

      it('should determine if card is first in different lane', inject(function(indexFunctions) {
        expect(indexFunctions.isFirstInLane(firstCardInDiffLane)).to.be.true;
      }));

      it('should determine if card is not first in different lane', inject(function(indexFunctions) {
        expect(indexFunctions.isFirstInLane(notFirstCardInDiffLane)).to.be.false;
      }));
    });

  });

});