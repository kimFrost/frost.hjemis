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
					valid: true,
					locked: false,
					initialized: false
				}
			},
			{
				id: 1,
				name: "Step 2",
				require: [0],
				states: {
					active: true,
					valid: false,
					locked: true,
					initialized: false,
					showchoice: false
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
					initialized: false,
					showchoice: false
				}
			}
		];
		main.geocoder = new google.maps.Geocoder();
		main.searchResults = [];
		main.states = {
			pending: false,
			success: false,
			error: false,
			cookiesAccepted: cookiesAccepted()
		};


		$scope.acceptCookies = acceptCookies;
		$scope.cookiesAccepted = cookiesAccepted;


		// Public functions
		main.postForm = postForm;
		main.postXtraForm = postXtraForm;
		main.validateForm = validateForm;
		main.switchstep = switchstep;
		main.getCoordinates = getCoordinates;



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

		function switchstep(id, force) {
			force = (force === undefined) ? false : force;
			log('switchStep', id);
			if (id !== undefined) {
				updateLocks(); // Update lock states
				var locked = checklock(id);
				if (!locked || force) {
					for (var i = 0; i< main.steps.length; i++) {
						var step = main.steps[i];
						if (step.id === id && !step.states.initialized) {
							step.states.initialized = true;
							step.states.active = true;
						}
						else if (step.id !== id) {
							step.states.active = false;
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
		function validateForm(formData) {
			var valid = false;
			// Make it dirty
			if (formData.$error.required !== undefined) {
				for (var i = 0; i < formData.$error.required.length; i++) {
					var required = formData.$error.required[i];
					required.$setViewValue(required.$viewValue);
					required.$setDirty();
				}
			}
			// Is it valid
			if (formData.$valid) {
				valid = formData.$valid;
			}
			return valid;
		}
		function resetForm(formData) {
			formData = {}; // Not really the way to do it. Loop through the field instead, and reset the values
			formData.$setPristine();
		}
		function postForm(formData, id, callback) {
			log('data', formData);
			formData.pending = true;
			formData.success = false;
			formData.error = false;

			var req = {
				method: 'POST',
				url: '/api/postform',
				data: formData
			};

			$http(req)
				.success(function (data, status, headers, config) {
					log('success', data);
					log('status', status);
					formData.pending = false;
					formData.success = true;
					formData.error = false;
					//callback();
				})
				.error(function (data, status, headers, config) {
					log('error', data);
					log('status', status);
					formData.pending = false;
					formData.success = false;
					formData.error = true;
					//callback();
				});
		}
		function postXtraForm(formData) {
			log('data', formData);
			formData.pending = true;
			formData.success = false;
			formData.error = false;
		}


		// Coordinates functions
		function getCoordinates(address, promise) {
			if (address !== undefined && main.geocoder !== undefined && main.geocoder !== null) {
				var coords = {};

				main.geocoder.geocode({'address': address}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						log('results', results);
						$scope.$apply(function() {
							main.searchResults = results;
						});

						/*
						if (results.length > 0) {
							log('results', results);
						}
						if (promise !== undefined) {

						}
						*/
					}
					else {
						log("Geocoder failed due to: " + status);
						if (promise !== undefined) {

						}
					}
				});


			}
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
