angular.module('FreeCell')
  .directive('card', function($compile) {

    return {
      scope: {
        value: '=value',
        suit: '=suit',
        selected: '=selected'
      },
      restrict: 'E',
      templateUrl: 'card/card.html',
      link: function(scope, el, attr) {}
    };

  });
