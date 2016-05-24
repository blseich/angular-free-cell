describe('Upkeep Service', function() {
  var upkeepService,
      homeCellService,
      movementService,
      lanes = [];

  beforeEach(module('services'));
  beforeEach(module(function($provide){
    $provide.service('homeCellService', function() {
      this.availableCell = sinon.stub();
    });
    $provide.service('movementService', function() {
      this.moveToAssociate = sinon.stub();
    });
  }));

  beforeEach(inject(function(_upkeepService_, _homeCellService_, _movementService_){
    upkeepService = _upkeepService_;
    homeCellService = _homeCellService_;
    movementService = _movementService_;
  }));

  describe('auto association', function() {

    var _mockCard = function() {
      return {
        associate: sinon.stub().returns(true),
        disassociate: sinon.spy()
      };
    };

    it('should not attempt association on lane with only one card', function() {
      lanes[0] = [_mockCard()];
      upkeepService.autoAssociate(lanes);
      sinon.assert.notCalled(lanes[0][0].associate);
    });

    it('should remove any association on first card in lane', function() {
      lanes[0] = [_mockCard(), _mockCard(), _mockCard()];
      upkeepService.autoAssociate(lanes);
      sinon.assert.called(lanes[0][2].disassociate);
    });

    it('should attempt association on all valid lanes', function() {
      for (var i = 0; i < 8; i++) {
        lanes[i] = [_mockCard(), _mockCard()];
      }
      upkeepService.autoAssociate(lanes);
      for(var i = 0; i < 8; i++) {
        sinon.assert.called(lanes[i][0].associate);
      }
    });

    it('should call associate on proper card of lane', function() {
      var m_firstCard = _mockCard();
          m_secondCard = _mockCard();
      lanes[0] = [m_secondCard, m_firstCard];
      upkeepService.autoAssociate(lanes);
      sinon.assert.calledWith(m_secondCard.associate, m_firstCard);
    });

    it('should attempt successive associations if successful', function() {        
        var m_testCard = _mockCard(),
            m_secondAssociateCard = _mockCard(),
            m_thirdAssociateCard = _mockCard();
        lanes[0] = [m_thirdAssociateCard, m_secondAssociateCard, m_testCard];
        upkeepService.autoAssociate(lanes);
        sinon.assert.calledOnce(m_thirdAssociateCard.associate);
        sinon.assert.calledWith(m_thirdAssociateCard.associate, m_secondAssociateCard);
    });

    describe('null card', function() {
      it('should not call disassocaite on a null card', function() {
        var m_nullCard = {
          isNull: true,
          disassociate: sinon.stub()
        }
        lanes[0] = [m_nullCard];
        upkeepService.autoAssociate(lanes);
        sinon.assert.notCalled(m_nullCard.disassociate);
      });
    });

  });

  describe('Empty Lane Cleanup', function() {
    var nullCard = {
          suit: '',
          value: '',
          isNull: true
        },
        nonNullCard = {};

    sinon.stub(Card, 'NULL_CARD').returns(nullCard);

    it('should add a \'null\' card to any empty lane', function() {
      lanes[0] = [];
      upkeepService.emptyLaneCleanup(lanes);
      expect(lanes[0][0]).to.equal(nullCard);
    });

    it('should not remove null card if another card is not present', function() {
      lanes[0] = [nullCard];
      upkeepService.emptyLaneCleanup(lanes);
      expect(lanes[0][0]).to.equal(nullCard);
    });

    it('should remove \'null\' card from any lane that now contains cards', function() {
      lanes[0] = [nullCard, nonNullCard];
      upkeepService.emptyLaneCleanup(lanes);
      expect(lanes[0][0]).to.equal(nonNullCard);
    });
  });

  describe('move to finished', function() {
      it('should attempt to find available free cell for first card of lane', function() {
        var testCard = {};
            lanes = [[testCard], [],[],[],[],[],[],[]];
        upkeepService.moveToFinished(lanes);
        sinon.assert.calledWith(homeCellService.availableCell, testCard);
      });

      it('should attempt to find available free cell for first card of each lane', function() {
        upkeepService.moveToFinished(lanes);
        sinon.assert.callCount(homeCellService.availableCell, 8);
      });

      describe('there is an available cell', function() {
        var finishedCard,
          cardToMove,
          availableHomeCell,
          movementStub;

        beforeEach(function() {
          finishedCard = {'foo': 'bar'};
          cardToMove = {};
          availableHomeCell = [finishedCard];
          lanes = [[{}, cardToMove], [],[],[],[],[],[],[],[]];
          movementStub = sinon.stub();

          homeCellService.availableCell.withArgs(cardToMove).returns(availableHomeCell);
          movementService.moveToAssociate.withArgs(finishedCard, cardToMove).returns(movementStub);
        });

        it('should move first card of lane to found available cell', function() {
          upkeepService.moveToFinished(lanes);
          sinon.assert.calledWith(movementStub, cardToMove);
        });
      });

      describe('there is not an available cell', function() {
        var cardToMove;

        beforeEach(function() {
          cardToMove = {};
          lanes = [[{}, cardToMove], [],[],[],[],[],[],[],[]];
        });

        it('should not call move', function() {
          upkeepService.moveToFinished(lanes);
          sinon.assert.notCalled(movementService.moveToAssociate);
        });
      });
  });

});