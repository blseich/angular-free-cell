describe('Card Service', function() {
  var cardService, laneService;

  function _mockCard(associate) {
    return {
      associate: function() {
        return associate;
      }
    }
  };

  laneService = {
    isFirstInLane: sinon.stub()
  };

  beforeEach(module('services'));

  beforeEach(module(function($provide) {
    $provide.service('laneService', function() {
      this.isFirstInLane = laneService.isFirstInLane;
    });
  }));

  beforeEach(inject(function(_cardService_) {
    cardService = _cardService_;
  }));
   
  describe('selection', function() {
    var m_card, m_cardWithAssociate,
        m_preselectedCard, m_preselectedCardWithAssociate,
        isFirstInLaneStub;

    
    beforeEach(function() {
      m_card = _mockCard();
      m_preselectedCard = _mockCard();
      m_cardWithAssociate = _mockCard(m_card);
      m_preselectedCardWithAssociate = _mockCard(m_preselectedCard);
      laneService.isFirstInLane.returns(true);
    });

    it('should not select card if not first in lane and has no associates', function() {
      laneService.isFirstInLane.returns(false);
      cardService.selectCard(m_card);
      expect(m_card.selected).to.be.falsey;
    });

    it('should select card if not first in lane but has card has associates', function() {
      laneService.isFirstInLane.returns(false);
      cardService.selectCard(m_cardWithAssociate);
      expect(m_cardWithAssociate.selected).to.be.true;
    });

    it('should select card if first in lane but has no associates', function() {
      cardService.selectCard(m_card);
      expect(m_card.selected).to.be.true;
    });

    it('should deselect card if card is already selected', function() {
      cardService.selectCard(m_preselectedCard);
      cardService.selectCard(m_card);
      expect(m_preselectedCard.selected).to.be.false;
    });

    it('should select associate cards', function() {
      cardService.selectCard(m_cardWithAssociate);
      expect(m_card.selected).to.be.true;
    });

    it('should deselect all associate cards', function() {
      cardService.selectCard(m_preselectedCardWithAssociate);
      cardService.selectCard(m_card);
      expect(m_preselectedCard.selected).to.be.false;
    });
  });

  describe('for each associate', function() {
    it('should call provided function for each associate of a card', function() {
      var card = _mockCard(_mockCard(_mockCard())),//Card with two associates
          func = sinon.spy();

      cardService.forEachAssociate(card, func);
      expect(func.callCount).to.equal(3);

    });
  });

  describe('clear selected', function() {
    it('should set selected to false on passed card', function() {
      var card = _mockCard();
      card.selected = true;
      cardService.clearSelected(card);
      expect(card.selected).to.equal(false);
    });
    it('should deselect all associates', function() {
      var card = _mockCard(),
          higherCard = _mockCard(card),
          highestCard = _mockCard(higherCard);
      highestCard.selected = higherCard.selected = card.selected = true;
      cardService.clearSelected(highestCard);
      expect(card.selected && higherCard.selected && highestCard.selected).to.equal(false);
    });
  });

});