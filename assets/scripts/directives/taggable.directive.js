(function () {
    'use strict';

    angular
        .module('noerd.KlapFilm.Web')
        .directive('taggable', taggable);

    /* @ngInject */
    function taggable(tagService, $rootScope) {
        var directive = {
            restrict: 'A',
            scope: true,
            link: link,
            controller: controller
        };
        return directive;

        // -------------------------------------------------------------------------

        function controller($scope) {
        }

        // -------------------------------------------------------------------------

        function link(scope, element, attrs) {
            var tags = attrs.taggable.split(',');

            $rootScope.$on('$locationChangeSuccess', function () {

                element.removeClass('tiles__tile--hidden');
               
                var selectedTag = tagService.selectedTag;
                if (selectedTag !== '' && tags.indexOf(selectedTag) === -1) {
                    
                    element.addClass('tiles__tile--hidden');
                  
                }
            });

        }

    }
})();