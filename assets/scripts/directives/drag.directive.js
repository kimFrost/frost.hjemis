(function (undefiend) {
	'use strict';

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
		};
})();

	angular
		.module('noerd.KlapFilm.Web')
		.directive('drag', [drag]);

	function drag() {
		var directive = {
			replace: false,
			link: link,
			scope: false,
			restrict: 'A',
			controller: controller,
			controllerAs: 'drag',
			bindToController: true
		};
		return directive;

		function link(scope, element, attrs) {

			scope.drag.elem = element;

			scope.drag.startMove = startMove;
			scope.drag.stopMove = stopMove;
			scope.drag.fixedUpdate = fixedUpdate;

			// Update Loop
			function updateLoop() {
				// Set next update call
				window.requestAnimFrame(updateLoop);
				// Update values
				update();
			}

			// Update
			function update() {
				if (scope.drag.states.moving) {
					var scrollHandler = element[0].children[0];
					scrollHandler.scrollLeft = scrollHandler.scrollLeft + (scope.drag.moveDirection * 5);
				}
			}

			function fixedUpdate() {
				if (scope.drag.states.moving) {
					var scrollHandler = element[0].children[0];
					scrollHandler.scrollLeft = scrollHandler.scrollLeft + (scope.drag.moveDirection * 3);
				}
			}

			function startMove(direction) {
				direction = (direction === undefiend) ? 1 : direction;
				scope.drag.states.moving = true;
				scope.drag.moveDirection = direction;
			}

			function stopMove() {
				scope.drag.states.moving = false;
			}


			updateLoop();
		}

		// Inject dependecies to controller
		//controller.$inject = ['$element'];

		/* @ngInject */
		function controller($element, $interval) {
		    /*jshint validthis: true */
			var drag = this;
			drag.options = {};
			drag.metric = {
				width: null,
				translateX: 0
			};
			drag.elem = $element;
			drag.child = $element[0].children[0];
			drag.states = {
				moveListen: false,
				noAnimate: false,
				moving: false
			};
			drag.temp = {
				baseTime: null,
				basePointX: null,
				basePointY: null,
				baseX: null,
				baseY: null,
				allowClick: true,
				lastTouchClientX: null,
				lastTouchClientY: null
			};
			drag.css = {};

			// Directive functions
			drag.getMetric = function() {
				return this.metric;
			};

			$interval(function() {
				drag.fixedUpdate();
			}, 1000 / 60);
		}
	}
})();

