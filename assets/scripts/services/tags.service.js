(function () {
    'use strict';

    angular
        .module('noerd.KlapFilm.Web')
        .service('tagService', tagService);

    /* @ngInject */
    function tagService() {

        // -------------------------------------------------------------------------
        // Public Method & Variables
        // -------------------------------------------------------------------------

        /*jshint validthis:true */
        this.selectedTag = '';

    }
})();