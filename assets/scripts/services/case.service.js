(function () {
	'use strict';

	angular
        .module('noerd.KlapFilm.Web')
        .service('caseService', caseService);

	/* @ngInject */
	function caseService($http) {

		// -------------------------------------------------------------------------
		// Public Method & Variables
		// -------------------------------------------------------------------------

		/*jshint validthis:true */
		this.getCase = getCase;

		function getCase(caseId) {

			return $http({
				url: '/api/cases/getcase/' + caseId,
				method: 'GET'
			});
		}

	}
})();