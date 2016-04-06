'use strict';

angular.module('stairmaster.datetimepicker', [])

.directive('datetimepicker', function() {
    return {
        require: 'ngModel',
        restrict: 'AE',
        scope: {
            useCurrent: '@'
        },
        link: function(scope, elem, attrs, ngModel) {
            elem.datetimepicker({
                format: 'll',
                keepOpen: false,
                minDate: moment().subtract(1, 'years'),
                maxDate: moment().add(1, 'years'),
                useCurrent: scope.useCurrent
            });

            elem.on('dp.change', function(e) {
                scope.$apply(function() {
                    console.log(e.date);
                    ngModel.$setViewValue(e.date);
                });
            });
        }
    };
});
