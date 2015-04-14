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
				height: '@height',
				type: '@type'
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
		function controller($scope, $element, $attrs, $http) {
		    /*jshint validthis: true */
			var map = this;
			map.options = {

			};
			map.width = map.width || '200';
			map.height = map.height || '200';
			map.type = map.type || 'overview';
			map.map = null;
			map.overlay  = null;
			map.infowindow = null;
			map.markerCluster = null;
			map.markers = [];
			map.currentMarkers = [];
			//map.css = {};
			map.states = {
        loaded: false,
				pendingImage: false
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


			/** FUNCTIONS */
			// Update Map Parameters
			var updateControl = function() {
				updateMarkers();
			}.bind(this);

			var updateMarkers = function() {
				console.log('updateMarkers1', map.markers.length);
				var i;
				// Remove all markers
				for (i = 0; i < this.currentMarkers.length; i++) {
					this.currentMarkers[i].setMap(null);
				}
				this.currentMarkers = [];

				for (i = 0; i < map.markers.length; i++) {
					var m = map.markers[i];
					var mm = new google.maps.Marker(m);

					mm.setMap(map.map);

					if (this.type === 'overview') {
						google.maps.event.addListener(mm , 'click', function() {
							//console.log('marker clicked', this);
							var imageUrl = this.image;
							var content = '<a href="' + imageUrl + '" target="_blank"><img src="' + imageUrl + '" style="width:100%;" /></a>';
							map.infowindow.setContent(content);
							map.infowindow.open(map.map, this);
							//map.map.setCenter(this.getPosition());
						});
					}
					else if (this.type === 'picker') {
						google.maps.event.addListener(mm , 'dragend', function() {
							console.log('this', this.getPosition());
						});
					}

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
				// At lease over 20 markers for clustering to be used
				if (this.currentMarkers.length > 20) {
					map.markerCluster = new MarkerClusterer(map.map, this.currentMarkers, clusterOptions);
				}
			}.bind(this);



			/** INITIATE */
			var options = {};
			var image = {};
			var marker = {};

			if (map.type === 'picker') {
				options = {
					center: new google.maps.LatLng(56.1, 10.277710),
					zoom: 7,
					mapTypeId: 'roadmap'
				};
				image = {
					url: 'http://placehold.it/100x80',
					width: 100,
					height: 80
				};
				marker = {
					name: 'Your image',
					position: new google.maps.LatLng(56.1, 10.277710),
					icon: image,
					image: 'http://placehold.it/600x450',
					draggable: true
				};
				map.markers.push(marker);
			}
			else if (map.type === 'overview') {
				options = {
					center: new google.maps.LatLng(56.1, 10.277710),
					zoom: 7,
					mapTypeId: 'roadmap'
				};
				// Set markers
				for (i = 0; i < 500; i++) {
					image = {
						url: 'http://placehold.it/50x40',
						width: 50,
						height: 40
					};
					marker = {
						name: i.toString(),
						position: new google.maps.LatLng(56 - (Math.random() * 4 - 2), 10 - (Math.random() * 4 - 2)),
						icon: image,
						image: 'http://placehold.it/600x450'
					};
					map.markers.push(marker);
				}
			}

			// create the map
			map.map = new google.maps.Map($element[0], options);
			map.infowindow = new google.maps.InfoWindow({
				maxWidth: 350
				//maxHeight: 250
			});

			// Draw markders
			updateControl();

		}
	}
})();

