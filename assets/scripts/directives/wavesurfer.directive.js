(function () {
	'use strict';


	angular
		.module('noerd.KlapFilm.Web')
		.directive('wave', wavedir);

	/* @ngInject */
	function wavedir() {

		var directive = {
			restrict: 'A',
			template: '<div class="wavesurfer__pending" data-ng-show="states.pending"></div><div class="wavesurfer__play" data-ng-show="!states.playing && !states.pending" data-ng-click="play()"></div><div class="wavesurfer__pause" data-ng-show="states.playing" data-ng-click="pause()"></div><div id="wave"></div>',
			scope: {
				wave: '@',
				waveAutoPlay: '@'
			},
			controller: controller
		};

		return directive;


		/* @ngInject */
		function controller($scope) {

			$scope.states = {
				pending: true,
				playing: false
			};

			var wavesurfer = Object.create(WaveSurfer);
			wavesurfer.init({
				container: '#wave',
				waveColor: '#4f4f51',
				progressColor: 'white'
			});

			wavesurfer.load($scope.wave);
			wavesurfer.on('ready', function () {
				$scope.$apply(function() {
					$scope.states.pending = false;
					if ($scope.waveAutoPlay === 'true') {
						$scope.play();
					}
				});
			});

			//'wave:killsound'

			// Force redraw
			window.addEventListener('resize', function() {
				wavesurfer.drawBuffer();
			});

			$scope.play = function () {
				if (!$scope.states.pending) {
					wavesurfer.play();
					$scope.states.playing = true;
				}
			};

			$scope.pause = function () {
				wavesurfer.pause();
				$scope.states.playing = false;
			};

			$scope.$on('wave:stopaudio', function (e, obj) {
				$scope.pause();
			});

		}
	}
})();
