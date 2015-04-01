(function (undefined) {
	'use strict';

	/**
	 * @ngdoc overview
	 * @name noerd.Hjemis.Web - MainController
	 * @description
	 * # noerd.Hjemis.Web
	 *
	 * Main module of the application.
	 */

	angular
		.module('noerd.Hjemis.Web')
		.controller('MainCtrl', MainCtrl);

	/* @ngInject */
	function MainCtrl($rootScope, $scope, $location, $window, $cookies, tagService, caseService, $timeout, $http, $sce) {

		$rootScope.selectedTag = '';
		$scope.acceptCookies = acceptCookies;
		$scope.cookiesAccepted = cookiesAccepted;

		var main = this;
		main.options = {
			debug: false
		};
		main.lockScrollTop = 0;
		main.overlays = {
			menu: {
				html: '',
				states: {
					show: false
				}
			},
			case: {
				html: '',
				states: {
					show: false
				}
			}
		};
		main.states = {
			pending: false,
			success: false,
			error: false,
			lockPageScroll: false
		};


		main.flowToggleOverlay = flowToggleOverlay;
		main.toggleOverlay = toggleOverlay;
		main.initIsotope = initIsotope;



		// main.initIsotope();
		// -------------------------------------------------

		function cookiesAccepted() {
			//var accepted = $cookies.get('cookiesAccepted');
			return $cookies.cookiesAccepted;
		}

		function acceptCookies() {
			$cookies.cookiesAccepted = true;
			//$scope.cookiesAccepted();
		}

		function initIsotope() {

		}

	    // -------------------------------------------------


		function flowToggleOverlay() {
			// if close all active overlays, or show first available overlay in the object holder
			var anyActive;
			var key;
			for (key in main.overlays) {
				if (main.overlays[key].states.show) {
					anyActive = true;
				}
			}
			if (anyActive) {
				closeAllOverlays();
			}
			else {
				for (key in main.overlays) {
					toggleOverlay(key, true);
					break;
				}
			}
		}

		function toggleOverlay(id, state, contentID) {
			state = (state === undefined) ? 'toggle' : state;
			contentID = (contentID === undefined) ? '' : contentID;
			contentID = contentID.toString();
			log('toggleOverlay', contentID);
			var key;
			if (main.overlays[id] === undefined) {
				var activeId;
				for (key in main.overlays) {
					if (main.overlays[key].states.show) {
						activeId = key;
					}
				}
				if (activeId === undefined) {
					return activeId;
				}
				else {
					id = activeId;
				}
			}
			if (state === 'toggle') {
				state = !main.overlays[id].states.show;
			}
			//window.snap.scrollLock = main.states.lockPageScroll;
			if (state) {
				// Get Content if contentID id defined
				if (contentID.length > 0) {
					getOverlayContent(id, contentID)
						/*
						 var content = getOverlayContent(contentID);
						 main.overlays[id].html = $sce.trustAsHtml(content);
						 */;
				}
				main.lockScrollTop = window.pageYOffset;
				for (key in main.overlays) {
					if (key !== id) {
						main.overlays[key].states.show = !state;
					}
				}
			}
			else {
				$scope.$broadcast('wave:stopaudio', {}); // Sound sound playing in wavesurfer
				main.overlays[id].html = ''; // unload overlay dynamic content
				setTimeout(function () {
					window.scrollTo(0, main.lockScrollTop);
				}, 50);
			}
			main.overlays[id].states.show = state;
			main.states.lockPageScroll = state;
		}

		function closeAllOverlays(event) {
			$scope.$broadcast('wave:stopaudio', {}); // Sound sound playing in wavesurfer
			for (var key in main.overlays) {
				main.overlays[key].states.show = false;
				main.overlays[key].html = ''; // unload overlay dynamic content
			}
			main.states.lockPageScroll = false;
			setTimeout(function () {


			    //window.scrollTo(0, main.lockScrollTop);
			    //window.scrollTo(0, main.lockScrollTop);
			}, 50);
		}

		function getOverlayContent(id, contentID) {
			var html = '';
			if (id !== undefined) {
				var casePromise = caseService.getCase(contentID);
				casePromise.then(function (response) {
					log(response);

					html = generateOverlayHtml(response.data);

					//html += '<div>Test ' + contentID + '</div>';
					//html += '<div data-wave="/media/acdc.mp3" data-wave-auto-play="false"></div>';
					//html += '<audio controls data-wavesurfer>';
					//html += '<source src="https://ia902508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3" type="audio/mpeg">';
					//html += '</audio>';


					main.overlays[id].html = $sce.trustAsHtml(html);
					//return html;
				});
			}
		}

		function generateOverlayHtml(data) {
			var html = '';
			var i;

			/*
			html += '<div class="container__inner">';
			html += '<div class="rte rte--narrow">';
			html += '<h1 class="rte__headline rte__headline--theta">Madhouse <b>Collection</b></h1>';
			html += '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>';
			html += '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>';
			html += '</div>';
			html += '</div>';

			html += '<div class="container__inner">';
			html += '<div class="wavesurfer" data-wave="/media/acdc.mp3" data-wave-auto-play="false"></div>';
			html += '</div>';

			html += '<div class="container__inner">';
			html += '<div class="vimeo">';
			html += '<iframe src="https://player.vimeo.com/video/120725892" width="1500" height="650" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
			html += '</div>';
			html += '</div>';

			html += '<div class="container__inner">';
			html += '<div class="gallery" data-drag>';
			html += '<div class="gallery__list">';
			html += '<div class="gallery__image"><img src="http://placehold.it/490x700"></div>';
			html += '<div class="gallery__image"><img src="http://placehold.it/490x700"></div>';
			html += '<div class="gallery__image"><img src="http://placehold.it/490x700"></div>';
			html += '<div class="gallery__image"><img src="http://placehold.it/490x700"></div>';
			html += '<div class="gallery__image"><img src="http://placehold.it/490x700"></div>';
			html += '<div class="gallery__image"><img src="http://placehold.it/490x700"></div>';
			html += '<div class="gallery__image"><img src="http://placehold.it/490x700"></div>';
			html += '<div class="gallery__image"><img src="http://placehold.it/490x700"></div>';
			html += '<div class="gallery__image"><img src="http://placehold.it/490x700"></div>';
			html += '<div class="gallery__image"><img src="http://placehold.it/490x700"></div>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			*/


			// CaseImage {} .Url

			// Categories


			// Title ''
			// Description '<>'
			if ((data.Description !== null && data.Description !== undefined) || (data.Title !== null && data.Title !== undefined)) {
				html += '<div class="container__inner">';
				html += '<div class="rte rte--narrow">';
				if (data.Title !== null) {
					// Parse [] to <b></b>
					var title = data.Title;
					title = title.replace('[', '<b>');
					title = title.replace(']', '</b>');
					html += '<h1 class="rte__headline rte__headline--theta">' + title + '</b></h1>';
				}
				if (data.Description !== null) {
					html += data.Description;
				}
				html += '</div>';
				html += '</div>';
			}

			// Sounds [] // Disabled until minification is fixed
			if (data.Sounds !== undefined) {
				for (i = 0; i < data.Sounds.length; i++) {
					html += '<div class="container__inner">';
					html += '<div class="wavesurfer" data-wave="' + data.Sounds[i].Url +'" data-wave-auto-play="false" title="' + data.Sounds[i].Title + '"></div>';
					html += '</div>';
				}
			}

			// Video
			if (data.Video !== null && data.Video !== undefined && data.Video !== '') {
				html += '<div class="container__inner">';
				html += '<div class="vimeo">';
				html += '<iframe src="' + data.Video + '" width="1500" height="650" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
				html += '</div>';
				html += '</div>';
			}

			// Videos ''
			if (data.Videos !== null && data.Videos !== undefined) {
				for (i = 0; i < data.Videos.length; i++) {
					html += '<div class="container__inner">';
					html += '<div class="vimeo">';
					html += '<iframe src="' + data.Videos.Url + '" width="1500" height="650" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
					html += '</div>';
					html += '</div>';
				}
			}

			// Images [{}] .Url
			if (data.Images !== undefined && data.Images.length > 0) {
				html += '<div class="container__inner">';
				html += '<div class="gallery" data-drag>';
				html += '<div class="gallery__scrollhandler">';
				html += '<div class="gallery__list">';
				for (i = 0; i < data.Images.length; i++) {
					//html += '<div class="gallery__image"><img src="' + data.Images[i].Url + '" title="' + data.Images[i].Title + '" /></div>';
					html += '<div class="gallery__image"><img src="' + data.Images[i].Url + '" /></div>';
				}
				html += '</div>';
				html += '</div>';
				html += '<div class="gallery__arrow" data-ng-mouseenter="drag.startMove(-1)" data-ng-mouseleave="drag.stopMove()"><div class="icomoon--arrow"></div></div>';
				html += '<div class="gallery__arrow gallery__arrow--right" data-ng-mouseenter="drag.startMove(1)" data-ng-mouseleave="drag.stopMove()"><div class="icomoon--arrow"></div></div>';
				html += '</div>';
				html += '</div>';
			}

			return html;
		}


		// Debug log
		function log(msg1, msg2) {
			msg1 = (msg1 === undefined) ? null : msg1;
			msg2 = (msg2 === undefined) ? null : msg2;
			if (main.options.debug) {
				if (msg2 !== null) {
					try {
						console.log(msg1, msg2);
					}
					catch (err) {

					}
				}
				else {
					try {
						console.log(msg1);
					}
					catch (err) {

					}
				}
			}
		}

	}
})();
