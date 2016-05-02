describe('Lane Service', function() {
  var laneService, lanes;

  beforeEach(module('services'));

  beforeEach(module(function($provide) {
    lanes = [[],[],[],[],[],[],[],[]];
    $provide.service('playArea', function() {
      return {
        lanes: lanes
      }
    });
  }));

  beforeEach(inject(function(_laneService_) {
    laneService = _laneService_;
  }));

  describe('is first in lane', function() {
    
    it('should return true if card is first in lane', function() {
      var card = {};
      lanes[0] = [card];
      expect(laneService.isFirstInLane(card)).to.be.true;
    });

    it('should not return true if card is not first in lane', function() {
      var notFirst = {},
          actuallyFirst = {};
      lanes[1] = [notFirst, actuallyFirst];
      expect(laneService.isFirstInLane(notFirst)).to.be.false;
    });
  });

  describe('lane containing', function() {

    it('should return lane that contains given card', function() {
      var findCard = {};
      lanes[2] = [findCard];
      expect(laneService.laneContaining(findCard)).to.equal(lanes[2]);
    });

  });

  describe('auto association', function() {

    var _mockCard = function() {
      return {
        associate: sinon.stub().returns(true),
        disassociate: sinon.spy()
      };
    };

    it('should not attempt association on lane with only one card', function() {
      lanes[0] = [_mockCard()];
      laneService.autoAssociate(lanes);
      sinon.assert.notCalled(lanes[0][0].associate);
    });

    it('should remove any association on first card in lane', function() {
      lanes[0] = [_mockCard(), _mockCard(), _mockCard()];
      laneService.autoAssociate(lanes);
      sinon.assert.called(lanes[0][2].disassociate);
    });

    it('should attempt association on all valid lanes', function() {
      for (var i = 0; i < 8; i++) {
        lanes[i] = [_mockCard(), _mockCard()];
      }
      laneService.autoAssociate(lanes);
      for(var i = 0; i < 8; i++) {
        sinon.assert.called(lanes[i][0].associate);
      }
    });

    it('should call associate on proper card of lane', function() {
      var m_firstCard = _mockCard();
          m_secondCard = _mockCard();
      lanes[0] = [m_secondCard, m_firstCard];
      laneService.autoAssociate(lanes);
      sinon.assert.calledWith(m_secondCard.associate, m_firstCard);
    });

    it('should attempt successive associations if successful', function() {        
        var m_testCard = _mockCard(),
            m_secondAssociateCard = _mockCard(),
            m_thirdAssociateCard = _mockCard();
        lanes[0] = [m_thirdAssociateCard, m_secondAssociateCard, m_testCard];
        laneService.autoAssociate(lanes);
        sinon.assert.calledOnce(m_thirdAssociateCard.associate);
        sinon.assert.calledWith(m_thirdAssociateCard.associate, m_secondAssociateCard);
      });

  });

});