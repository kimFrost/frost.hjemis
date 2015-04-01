(function () {
    'use strict';

    angular
        .module('noerd.KlapFilm.Web')
        .directive('tagslist', tagsList);

    /* @ngInject */
    function tagsList(tagService) {
        var directive = {
            restrict: 'A',
            scope: true,
            controller: controller
        };

        return directive;

        /* @ngInject */
        function controller($scope, $element, $attrs, $parse, $location) {

            // -------------------------------------------------------------------------
            // Scope
            // -------------------------------------------------------------------------

            $scope.setTag = setTag;
            $scope.selectedTag = '';


            // -------------------------------------------------------------------------
            // Watch
            // -------------------------------------------------------------------------

            $scope.$watch(
        	    function () {
        	        return tagService.selectedTag;
        	    },
        	    function (newValue, oldValue) {
        	        $scope.selectedTag = newValue;


        	    });

            // -------------------------------------------------------------------------
            // Functions
            // -------------------------------------------------------------------------

            function removeCurrentClass() {
                $element.find('a').removeClass('btn--active');
            }

            function setTag(event, tag) {
                var hash = 'cases/' + tag;
                tagService.selectedTag = tag;
                $location.url(hash);
                removeCurrentClass();
               
                //console.log(event.currentTarget);
                angular.element(event.currentTarget).addClass('btn--active');
            }
        }
    }
})();