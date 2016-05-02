describe('Movement Service', function() {
  var movementService,
      m_cardService,
      m_laneService,
      _mockCard,
      m_cardToAssociateWith,
      m_card;

  m_cardService = {
    selectedCard: sinon.stub()
  }

  m_laneService = {
    isFirstInLane: sinon.stub()
  }

  _mockCard = function(){
    return {
      associate: sinon.stub()
    }
  }

  beforeEach(module('services'));

  beforeEach(module(function($provide) {
    $provide.service('cardService', function() {
      this.selectedCard = m_cardService.selectedCard;
    });
    $provide.service('laneService', function() {
      this.isFirstInLane = m_laneService.isFirstInLane;
    });
  }));
  
  beforeEach(inject(function(_movementService_) {
    movementService = _movementService_;
  }));

  beforeEach(function() {
    m_card = _mockCard();
    m_cardToAssociateWith = _mockCard();
    m_cardToAssociateWith.associate.returns(false);
    m_laneService.isFirstInLane.returns(true);
    m_cardService.selectedCard.returns(m_card);
  });

  describe('legal move', function() {
    it('should return false if a card is not already selected', function() {
      m_cardService.selectedCard.returns(undefined);
      expect(movementService.isLegalMove(m_card)).to.be.false;
    });

    it('should return false if passed card is not first in the lane', function() {
      m_laneService.isFirstInLane.returns(false);
      expect(movementService.isLegalMove(m_cardToAssociateWith)).to.be.false;
    });

    it('should return false if a card is selected but passed card already has associates', function() {
      m_cardToAssociateWith.associate.returns(true);
      expect(movementService.isLegalMove(m_cardToAssociateWith)).to.be.false;
    });

    it('should return false if passed card doesn\'t have associates and there is a card selected but association fails', function() {
      expect(movementService.isLegalMove(m_cardToAssociateWith)).to.be.false;
    });

    it('should check for associates before attempting to associate', function() {
      movementService.isLegalMove(m_cardToAssociateWith);
      sinon.assert.callOrder(m_cardToAssociateWith.associate.withArgs(), m_cardToAssociateWith.associate.withArgs(m_card));
    });

    it('should return true if card is selected and passed card does not have associates passed card is first in lane and association succeeds', function() {
      m_cardToAssociateWith.associate.onFirstCall().returns(false);
      m_cardToAssociateWith.associate.onSecondCall().returns(true);
      m_laneService.isFirstInLane.returns(true);
      m_cardService.selectedCard.returns(m_card);
      expect(movementService.isLegalMove(m_cardToAssociateWith)).to.be.true;
    });

  });
});