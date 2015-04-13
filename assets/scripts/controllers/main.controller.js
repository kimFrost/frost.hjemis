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
		main.steps =[
			{
				id: 0,
				name: "Step 1",
				require: [],
				states: {
					active: true,
					valid: false,
					locked: false,
					initialized: false
				}
			},
			{
				id: 1,
				name: "Step 2",
				require: [0],
				states: {
					active: false,
					valid: false,
					locked: true,
					showchoice: false,
					initialized: false
				}
			},
			{
				id: 2,
				name: "Step 3",
				require: [0, 1],
				states: {
					active: false,
					valid: false,
					locked: true,
					showchoice: false,
					initialized: false,
					showchoiceBasket: true,
					showchoiceFiles: false
				}
			}
		];
		main.states = {
			pending: false,
			success: false,
			error: false,
			cookiesAccepted: cookiesAccepted()
		};


		main.postForm = postForm;
		main.switchstep = switchstep;



		// Step functions
		function getStates(id) {
			for (var i = 0; i < main.steps.length; i++) {
				var step = main.steps[i];
				if (step.id === id) {
					return step.states;
				}
			}
		}
		function checklock(id) {
			return getStates(id).locked;
		}
		function checkvalid(id) {
			return getStates(id).valid;
		}

		function switchstep(id) {
			log('switchStep', id);
			if (id !== undefined) {
				updateLocks(); // Update lock states
				var locked = checklock(id);
				if (!locked) {
					for (var i = 0; i< main.steps.length; i++) {
						var step = main.steps[i];
						if (step.id === id && !step.states.initialized) {
							step.states.initialized = true;
							step.states.active = true;
						}
					}
				}
			}
		}
		function updateLocks() {
			var steps = main.steps;
			for (var i = 0; i < steps.length; i++) {
				var step = steps[i];
				var anyNotValid = false;
				if (step.require !== undefined && step.require.length > 0) {
					// Find step required step and check their valid state
					for (var ii=0; ii < step.require.length; ii++) {
						var requiredStep = step.require[ii];
						if (!steps[requiredStep].states.valid) {
							anyNotValid = true;
						}
					}
					step.states.locked = anyNotValid;
				}
				else {
					step.states.locked = anyNotValid;
				}
				if (!step.states.locked && !step.states.completed) {

				}
			}
		}


		// Form functions
		function postForm(formdata, id, callback) {
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
					//callback();
				})
				.error(function (data, status, headers, config) {
					log('error', data);
					log('status', status);
					formdata.pending = false;
					formdata.success = false;
					formdata.error = true;
					//callback();
				});
		}


		// Cookie functions
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
