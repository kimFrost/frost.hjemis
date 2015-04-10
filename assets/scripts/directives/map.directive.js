(function (undefiend) {
	'use strict';

	angular
		.module('noerd.Hjemis.Web')
		.directive('map', [map]);

	function map() {
		var directive = {
			replace: true,
			link: link,
			scope: {
				width: '@width',
				height: '@height'
			},
			template: '<div>Google Map</div>',
			restrict: 'A',
			controller: controller,
			controllerAs: 'map',
			bindToController: true
		};
		return directive;

		function link(scope, element, attrs) {}

		/* @ngInject */
		function controller($scope, $element, $attrs) {
		    /*jshint validthis: true */
			var map = this;
			map.options = {

			};
			map.width = '200';
			map.height = '200';
			map.map = null;
			map.currentMarkers = [];
			//map.css = {};
			map.states = {
        loaded: false
      };


			// Listen to changes in scope variables and update the control
			var arr = ['this.width', 'this.height'];
			for (var i = 0, cnt = arr.length; i < arr.length; i++) {
				watchValue(arr[i]);
			}
			function watchValue(prop) {
				$scope.$watch(function () {
					return prop;
				}.bind(this), function(newVal) {
					if (newVal) {
						updateControl();
					}
				}.bind(this));
			}

			var options =
			{
				center: new google.maps.LatLng(56.1, 10.277710),
				zoom: 7,
				mapTypeId: 'roadmap'
			};

			var markers = [];
			for (i = 0; i < 1000; i++) {
				var marker = {
					name: i,
					lat: 50,
					lon: 10
				};
				markers.push(marker);
			}

			// create the map
			map.map = new google.maps.Map($element[0], options);

			// Update Map Parameters
			var updateControl = function() {
				console.log(this);
				console.log(map.width);
				console.log($scope);

				//map.css.width = this.width;
				//map.css.height = this.height;


			}.bind(this);

			var updateMarkers = function() {



			}.bind(this);


		}
	}
})();

