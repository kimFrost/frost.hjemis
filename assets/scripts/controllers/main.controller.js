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
	function MainCtrl($rootScope, $scope, $location, $cookies, $timeout, $http, $sce) {

		$scope.acceptCookies = acceptCookies;
		$scope.cookiesAccepted = cookiesAccepted;

		var main = this;
		main.options = {
			debug: true
		};
		main.steps = [
			{
				id: 0
			},
			{
				id: 1
			},
			{
				id: 2
			}
		];
		main.states = {
			pending: false,
			success: false,
			error: false,
			cookiesAccepted: cookiesAccepted()
		};


		main.postCard = postForm;


		function postForm(formdata) {
			log('data', formdata);
			formdata.pending = true;
			formdata.success = false;
			formdata.error = false;

			var req = {
				method: 'POST',
				url: '/api/addcard',
				data: formdata
			};

			$http(req)
				.success(function (data, status, headers, config) {
					log('success', data);
					log('status', status);
					formdata.pending = false;
					formdata.success = true;
					formdata.error = false;
				})
				.error(function (data, status, headers, config) {
					log('error', data);
					log('status', status);
					formdata.pending = false;
					formdata.success = false;
					formdata.error = true;
				});

			// try .bind(data) -> this -> data // Not in a angular object
		}

		function cookiesAccepted() {
			return $cookies.cookiesAccepted;
		}

		function acceptCookies() {
			$cookies.cookiesAccepted = true;
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
