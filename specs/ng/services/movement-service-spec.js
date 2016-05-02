describe('Movement Service', function() {
  var movementService,
      cardService,
      laneService,
      _mockCard,
      m_cardToAssociateWith,
      m_card;

  _mockCard = function(){
    return {
      associate: sinon.stub()
    }
  }

  beforeEach(module('services'));

  beforeEach(module(function($provide) {
    $provide.service('cardService', function() {
      this.selectedCard = sinon.stub();
    });
    $provide.service('laneService', function() {
      this.isFirstInLane = sinon.stub();
      this.laneContaining = sinon.stub();
    });
  }));
  
  beforeEach(inject(function(_movementService_, _cardService_, _laneService_) {
    movementService = _movementService_;
    cardService = _cardService_;
    laneService = _laneService_;
  }));

  beforeEach(function() {
    m_card = _mockCard();
    m_cardToAssociateWith = _mockCard();
    m_cardToAssociateWith.associate.returns(false);
    laneService.isFirstInLane.returns(true);
    cardService.selectedCard.returns(m_card);
  });

  describe('legal move', function() {
    it('should return false if a card is not already selected', function() {
      cardService.selectedCard.returns(undefined);
      expect(movementService.isLegalMove(m_card)).to.be.false;
    });

    it('should return false if passed card is not first in the lane', function() {
      laneService.isFirstInLane.returns(false);
      expect(movementService.isLegalMove(m_cardToAssociateWith)).to.be.false;
    });

    it('should return false if a card is selected but passed card already has associates', function() {
      m_cardToAssociateWith.associate.returns(true);
      expect(movementService.isLegalMove(m_cardToAssociateWith)).to.be.false;
    });

    it('should return true if card is selected and passed card does not have associates passed card is first in lane and association succeeds', function() {
      m_cardToAssociateWith.associate.returns(false);
      laneService.isFirstInLane.returns(true);
      cardService.selectedCard.returns(m_card);
      expect(movementService.isLegalMove(m_cardToAssociateWith)).to.be.true;
    });

  });

  describe('move to associate', function() {
    var m_removalLane, m_additionLane;

    beforeEach(function() {
      m_removalLane = [m_card];
      m_additionLane = [m_cardToAssociateWith];
      cardService.selectedCard.returns(m_card);
      laneService.laneContaining.withArgs(m_card).returns(m_removalLane);
      laneService.laneContaining.withArgs(m_cardToAssociateWith).returns(m_additionLane);
    });

    it('should return a function', function() {
      expect(typeof movementService.moveToAssociate(m_cardToAssociateWith)).to.equal('function');
    });

    describe('returned function', function(){
      var returnedFunction;
      
      beforeEach(function() {
        returnedFunction = movementService.moveToAssociate(m_cardToAssociateWith);
      });

      it('should remove previoulsy selected card from its current lane', function() {
        returnedFunction(m_card);
        expect(m_removalLane[0]).to.be.undefined;
      });

      it('should add previously selected card to new lane', function() {
        returnedFunction(m_card);
        expect(m_additionLane[1]).to.equal(m_card);
      });
    });

  });

});