angular.module('app', []).controller('main', function ($scope) {
    $scope.taskRow = 0;
    $scope.row = -1;
    $scope.col = -1;

    $scope.highlightCard = function () {
        angular.forEach($scope.lanes, function (l, key, obj) {
            angular.forEach(l.cards, function (c, key, obj) {
                c['highlighted'] = false;
            })
        });
        var card = $scope.currentCard();
        if (card)
            card.highlighted = true;
    };
    $scope.lanes = [
        { cards: [
            { id: 1, title: "Card 1",
                tasks: {
                    visible: false,
                    items: [
                        {id: 1, description: 'pick nose' },
                        {id: 2, description: 'flick boogers' }
                    ]
                }
            },
            { id: 2, title: "Card 2" }
        ] },
        { cards: [
            { id: 3, title: "Card 3" },
            { id: 4, title: "Card 4" },
            { id: 5, title: "Card 5" },
            { id: 6, title: "Card 6" }
        ]}
    ];
    $scope.currentCard = function () {
        if ($scope.row == -1 || $scope.col == -1) return undefined;

        var nrows = $scope.lanes[$scope.col]['cards'].length;
        var clampedRow = $scope.row;
        if ($scope.row >= nrows)
            clampedRow = nrows - 1;

        return $scope.lanes[$scope.col]['cards'][clampedRow];
    };

    $scope.$on("escape", function () {
        var card = $scope.currentCard();
        if (card && card.tasks && card.tasks.visible)
            $scope.toggleTasks();
        else {
            $scope.$apply(function () {
                $scope.row = -1;
                $scope.col = -1;
                $scope.highlightCard();
            });
        }
    });

    $scope.toggleTasks = function () {
        var card = $scope.currentCard();
        if (!card) return;

        $scope.$apply(function () {
            $scope.taskRow = 0;
            if (!card.tasks)
                card.tasks = {};
            card.tasks.visible = !card.tasks.visible;
        });
    };
    $scope.$on("toggle-tasks", function () {
        $scope.toggleTasks();
    });
    $scope.downCard = function () {
        if ($scope.col == -1) $scope.col = 0;
        var nrows = $scope.lanes[$scope.col]['cards'].length;
        console.log(nrows);
        if ($scope.row < nrows - 1)
            $scope.row++;
        $scope.$apply(function () {
            $scope.highlightCard();
        });
    };

    $scope.upTask = function () {
        var card = $scope.currentCard();
        if (!card) return;
        var todo = card.tasks.items;
        if ($scope.taskRow > 0)
            $scope.$apply(function () {
                $scope.taskRow--;
            });
    };

    $scope.downTask = function () {
        var card = $scope.currentCard();
        if (!card) return;
        var todo = card.tasks.items;
        var nitems = todo.length;
        if ($scope.taskRow < nitems - 1)
            $scope.$apply(function () {
                $scope.taskRow++;
            });
    };

    $scope.$on("down", function () {
        var card = $scope.currentCard();
        if (card && card.tasks && card.tasks.visible)
            $scope.downTask();
        else
            $scope.downCard();
    });
    $scope.$on("mark", function () {
        var card = $scope.currentCard();
        if (card && card.tasks && card.tasks.visible) {
            $scope.$apply(function () {
                card.tasks.items[$scope.taskRow].complete = !card.tasks.items[$scope.taskRow].complete;
            });
        }
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
    $scope.upCard = function () {
        if ($scope.col == -1) $scope.col = 0;
        if ($scope.row > 0)
            $scope.row--;
        var nrows = $scope.lanes[$scope.col]['cards'].length;
        if ($scope.row >= nrows - 1)
            $scope.row = nrows - 2;
        $scope.$apply(function () {
            $scope.highlightCard();
        });
    }

    $scope.$on("up", function () {
        var card = $scope.currentCard();
        if (card && card.tasks && card.tasks.visible)
            $scope.upTask();
        else
            $scope.upCard();
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
                else if (String.fromCharCode(event.charCode) == 't')
                    scope.$emit("toggle-tasks");
                else if (String.fromCharCode(event.charCode) == 'x')
                    scope.$emit("mark");
                else console.log(event.charCode);
            });
            jQuery(element).keyup(function (event) {
                if (event.keyCode == 27)
                    scope.$emit("escape");
            });

        }
    };
});
