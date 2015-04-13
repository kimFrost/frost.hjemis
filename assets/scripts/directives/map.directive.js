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
			template: '<div></div>',
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
			map.overlay  = null;
			map.infowindow = null;
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
			for (i = 0; i < 500; i++) {
				var image = {
					url: 'http://placehold.it/50x40',
					width: 50,
					height: 40
				};
				/*
				image = {
					url: 'images/icon-checked.png',
					// This marker is 20 pixels wide by 32 pixels tall.
					size: new google.maps.Size(20, 32),
					// The origin for this image is 0,0.
					origin: new google.maps.Point(0,0),
					// The anchor for this image is the base of the flagpole at 0,32.
					anchor: new google.maps.Point(0, 32)
				};
				*/
				var marker = {
					name: i.toString(),
					lat: 56 - (Math.random() * 4 - 2),
					lon: 10 - (Math.random() * 4 - 2),
					icon: image
				};

				markers.push(marker);
			}

			// create the map
			map.map = new google.maps.Map($element[0], options);
			map.infowindow = new google.maps.InfoWindow();
			map.overlay  = new google.maps.OverlayView();

			// Update Map Parameters
			var updateControl = function() {
				console.log(this);
				console.log(map.width);
				console.log($scope);

				//map.css.width = this.width;
				//map.css.height = this.height;
				updateMarkers();

			}.bind(this);

			var updateMarkers = function() {
				for (var i = 0; i < markers.length; i++) {
					var m = markers[i];
					var loc = new google.maps.LatLng(m.lat, m.lon);
					var mm = new google.maps.Marker({
						position: loc,
						map: map.map,
						title: m.name,
						icon: m.icon,
						image: 'http://placehold.it/400x300',
						customInfo: 'asdasdasdasdasd'
					});

					google.maps.event.addListener(mm , 'click', function() {
						//console.log('marker clicked', this);
						var imageUrl = this.image;
						var content = '<a href="' + imageUrl + '" target="_blank"><img src="' + imageUrl + '" /></a>';
						map.infowindow.setContent(content);
						map.infowindow.open(map.map, this);
					});

					this.currentMarkers.push(mm);
				}

				var clusterStyles = [
					{
						textColor: 'white',
						url: 'images/icon-marker.png',
						height: 44,
						width: 44
					}/*,
					{
						textColor: 'purple',
						url: 'http://placehold.it/50x50',
						height: 50,
						width: 50
					},
					{
						textColor: 'red',
						url: 'http://placehold.it/50x50',
						height: 50,
						width: 50
					}*/
				];

				var clusterOptions = {
					gridSize: 50,
					styles: clusterStyles,
					maxZoom: 15
				};

				var markerCluster = new MarkerClusterer(map.map, this.currentMarkers, clusterOptions);

			}.bind(this);


		}
	}
})();

