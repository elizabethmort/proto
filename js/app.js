angular.module('app', []).controller('main', function ($scope) {
    $scope.row = -1;
    $scope.col = -1;

    $scope.highlightCard = function () {
        if ($scope.col != -1 && $scope.row != -1) {
            angular.forEach($scope.lanes, function (l, key, obj) {
                angular.forEach(l.cards, function (c, key, obj) {
                    console.log(c);
                    c['highlighted'] = false;
                })
            });
            var nrows = $scope.lanes[$scope.col]['cards'].length;
            var clampedRow = $scope.row;
            if($scope.row >= nrows)
              clampedRow = nrows-1;

            $scope.lanes[$scope.col]['cards'][clampedRow].highlighted = true;
            console.log("Highlighting ", $scope.row, $scope.col);
        }
    }
    $scope.lanes = [
        { cards: [
            { id: 1, title: "Card 1" },
            { id: 2, title: "Card 2" }
        ] },
        { cards: [
            { id: 3, title: "Card 3" },
            { id: 4, title: "Card 4" },
            { id: 5, title: "Card 5" },
            { id: 6, title: "Card 6" }
        ]}
    ];
    $scope.$on("down", function () {
        if ($scope.col == -1) $scope.col = 0;
        var nrows = $scope.lanes[$scope.col]['cards'].length;
        console.log(nrows);
        if ($scope.row < nrows-1)
            $scope.row++;
        $scope.$apply(function () {
            $scope.highlightCard();
        });
    });
    $scope.$on("left", function () {
        if ($scope.row == -1) $scope.row = 0;
        if ($scope.col >= 0)
            $scope.col--;
        $scope.$apply(function () {
            $scope.highlightCard();
        });
    });
    $scope.$on("right", function () {
        if ($scope.row == -1) $scope.row = 0;
        if ($scope.col < $scope.lanes.length - 1)
            $scope.col++;
        $scope.$apply(function () {
            $scope.highlightCard();
        });
    });
    $scope.$on("up", function () {
        if ($scope.col == -1) $scope.col = 0;
        if ($scope.row > 0)
            $scope.row--;
        var nrows = $scope.lanes[$scope.col]['cards'].length;
        if($scope.row >= nrows-1)
          $scope.row = nrows-2;
        $scope.$apply(function () {
            $scope.highlightCard();
        });
    });
}).directive('tkFocus', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            jQuery(element).keypress(function (event) {
                if (String.fromCharCode(event.charCode) == 'j')
                    scope.$emit("down");
                else if (String.fromCharCode(event.charCode) == 'k')
                    scope.$emit("up");
                else if (String.fromCharCode(event.charCode) == 'h')
                    scope.$emit("left");
                else if (String.fromCharCode(event.charCode) == 'l')
                    scope.$emit("right");
            });

        }
    };
});