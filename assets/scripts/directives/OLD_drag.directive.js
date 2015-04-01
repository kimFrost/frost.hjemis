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

			// Update Loop
			function updateLoop() {
				// Set next update call
				window.requestAnimFrame(updateLoop);
				// Update values
				update();
			}

			// Update
			function update() {
				var metric = scope.drag.elem[0].getBoundingClientRect();
				var childMetrics = scope.drag.child.getBoundingClientRect();
				var childChrildren = scope.drag.child.children;
				var childChrildrenMetrics = childChrildren[childChrildren.length - 1].getBoundingClientRect();

				//console.log('metric', metric);
				//console.log('childMetrics', childMetrics);
				//console.log('childChrildrenMetrics', childChrildrenMetrics);
				//console.log('scope.drag.metric.translateX', scope.drag.metric.translateX);

				if (childChrildrenMetrics.right < metric.right) {

				}

				/*
				if (childMetrics.right < metric.width) {
					scope.drag.metric.translateX = metric.width - childMetrics.width;
				}
				*/
			}

			function handlePressed(e) {
				scope.drag.states.moveListen = true;
				var baseX = 0;
				var baseY = 0;
				if (event.touches !== undefined) {
					baseX = event.touches[0].clientX;
					baseY = event.touches[0].clientY;
				}
				else {
					baseX = event.clientX;
					baseY = event.clientY;
				}
				scope.drag.temp.baseTime = Date.now();
				scope.drag.temp.baseX = baseX;
				scope.drag.temp.baseY = baseY;
				scope.drag.temp.basePointX = baseX;
				scope.drag.temp.basePointY = baseY;

				scope.drag.states.noAnimate = true;
				scope.drag.states.moveListen = true;
			}

			function handleRelease(e) {
				scope.drag.states.moveListen = false;
			}

			function handleMove(e) {
				if (scope.drag.states.moveListen) {
					//e.preventDefault();
					if (scope.drag.states.moveListen) {
						var posX = 0;
						var posY = 0;
						var metric = scope.drag.elem[0].getBoundingClientRect();
						var childMetrics = scope.drag.child.getBoundingClientRect();
						if (event.touches !== undefined) {
							posX = event.touches[0].clientX;
							posY = event.touches[0].clientY;
						}
						else {
							posX = event.clientX;
							posY = event.clientY;
						}
						var distanceX = scope.drag.temp.baseX - posX;
						var distanceY = scope.drag.temp.baseY - posY;

						scope.drag.metric.translateX -= distanceX;
						scope.drag.metric.translateY -= distanceY;

						// Handle overdrag on left side
						if (scope.drag.metric.translateX > 0) {
							scope.drag.metric.translateX = 0;
						}

						// Handle overdrag on right side
						if (childMetrics.right < (metric.width - childMetrics.width)) {
							//scope.drag.metric.translateX = metric.width - childMetrics.width; // IE BUGS ??
						}

						scope.drag.temp.baseX = posX;
						scope.drag.temp.baseY = posY;

						setPos();
					}
				}
			}

			function setPos() {
				var translateX = scope.drag.metric.translateX;
				var translateXPx = translateX + 'px';
				// Js direct set style for much better performance.
				scope.drag.child.style.mozTransform = 'translate(' + translateXPx + ', 0)';
				scope.drag.child.style.msTransform = 'translate(' + translateXPx + ', 0)';
				scope.drag.child.style.webkitTransform = 'translate(' + translateXPx + ', 0)';
				scope.drag.child.style.OTransform  = 'translate(' + translateXPx + ', 0)';
				scope.drag.child.style.transform = 'translate(' + translateXPx + ', 0)';
			}

			updateLoop();

			// Bind to input events
			scope.drag.elem[0].addEventListener('touchstart', handlePressed);
			scope.drag.elem[0].addEventListener('mousedown', handlePressed);
			scope.drag.elem[0].addEventListener('touchend', handleRelease);
			scope.drag.elem[0].addEventListener('mouseup', handleRelease);
			scope.drag.elem[0].addEventListener('mouseleave', handleRelease);
			scope.drag.elem[0].addEventListener('touchmove', handleMove);
			scope.drag.elem[0].addEventListener('mousemove', handleMove);
			scope.drag.elem[0].addEventListener('dragstart', function(e) {
				e.preventDefault();
			});
		}

		// Inject dependecies to controller
		//controller.$inject = ['$element'];

		/* @ngInject */
		function controller($element) {
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
				noAnimate: false
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
		}
	}
})();

