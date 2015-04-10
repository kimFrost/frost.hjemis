(function (undefiend) {
	'use strict';

	angular
		.module('noerd.BrugSkallen')
		.directive('lazybg', [lazybg]);

	function lazybg() {
		var directive = {
			replace: false,
			link: link,
			scope: {
        url: '@lazybg',
        id: '@lazybgId'
      },
			restrict: 'A',
			controller: controller,
			controllerAs: 'lazybg',
			bindToController: true
		};
		return directive;

		function link(scope, element, attrs) {

		}

		// Inject dependecies to controller
		//controller.$inject = ['$element'];

		/* @ngInject */
		function controller($scope, $element, $attrs) {
		    /*jshint validthis: true */
			var lazybg = this;
      lazybg.options = {};
      lazybg.elem = $element;
      lazybg.states = {
				loaded: false
			};

      if (lazybg.id === undefiend) {
        lazybg.id = lazybg.url;
      }

      $scope.$on('lazybg:load', function (e, id) {
        if (!lazybg.states.loaded) {
          id = id.toString();
          if (id === lazybg.id) {
            $element[0].style.backgroundImage = 'url(' + lazybg.url + ')';
            //$element.attr('src', lazybg.url);
            lazybg.states.loaded = true;
          }
        }
      });

		}
	}
})();

