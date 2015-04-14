(function (undefiend) {
	'use strict';

	angular
		.module('noerd.Hjemis.Web')
		.directive('validfile', [validfile]);

	function validfile() {
		var directive = {
			replace: false,
			link: link,
			require:'ngModel',
			scope: false,
			restrict: 'A',
			controller: controller,
			controllerAs: 'validfile',
			bindToController: true
		};
		return directive;

		function link(scope, element, attrs, ngModel) {
			element.bind('change',function(){
				scope.$apply(function(){
					ngModel.$setViewValue(element.val());
					ngModel.$render();
				});
			});
		}

		/* @ngInject */
		function controller($scope, $element, $attrs) {
		    /*jshint validthis: true */
			var validfile = this;


		}
	}
})();
