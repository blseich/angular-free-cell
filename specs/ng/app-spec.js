describe('Controller', function() {
  var $scope,
      $controller,
      upkeepService,
      m_card, m_cardToAssociateWith;

  beforeEach(module('FreeCell'));

  beforeEach(module(function($provide) {

    $provide.service('upkeepService', function() {
      this.autoAssociate = sinon.spy();
      this.emptyLaneCleanup = sinon.spy();
      this.moveToFinished = sinon.spy();
    });
  }));

  beforeEach(inject(function($rootScope, _$controller_, _upkeepService_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $scope = $rootScope.$new();
    upkeepService = _upkeepService_;
    $controller('FreeCellController', {$scope: $scope});

    //setup stubbed objects
    m_card = {associate: sinon.stub()};
    m_cardToAssociateWith = {associate: sinon.stub()};
  }));

  describe('Watchers', function() {

    describe('lanes', function() {
      var newLanesVal = [[],[],[],[],[],[],[],[]];


      beforeEach(function() {
        $scope.lanes = newLanesVal;
      });

      it('should auto associate when lanes have changed', function() {
        $scope.$digest();
        sinon.assert.calledWith(upkeepService.autoAssociate, newLanesVal);
      });

      it('should clean-up empty lanes when lanes have changed', function() {
        $scope.$digest();
        sinon.assert.calledWith(upkeepService.emptyLaneCleanup, newLanesVal);
      });
    });

    describe('free-cells', function() {
      var newFreeCellsVal;
      beforeEach(function() {
        $scope.freeCells = newFreeCellsVal;
      });
      it('should clean-up empty free-cells when cells have changed', function() {
        $scope.$digest();
        sinon.assert.calledWith(upkeepService.emptyLaneCleanup, newFreeCellsVal);
      });

      afterEach(function() {
        $scope.newFreeCellsVal = undefined;
      });

    });

    describe('home-cells', function() {

      var newLanesVal = [[],[],[],[],[],[],[],[]],
          newFreeCellsVal = [[],[],[],[]];

      beforeEach(function() {
        $scope.lanes = newLanesVal;
        $scope.freeCells = newFreeCellsVal;
      });

      it('should move all cards that can be finished from the new lanes', function() {
        $scope.$digest();
        sinon.assert.calledWith(upkeepService.moveToFinished, newLanesVal);
      });

      it('should move all cards that can be finished from the free cells', function() {
        $scope.$digest();
        sinon.assert.calledWith(upkeepService.moveToFinished, newFreeCellsVal);
      });

    });

  });

});