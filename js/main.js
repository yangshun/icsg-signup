(function () {
    var HEADERS = ['name', 'roomNumber', 'contactNumber', 'category'];

    function saveData (data) {
        localStorage.setItem('data', JSON.stringify(data));
    }

    function arrayToCSV (twoDiArray, fileName) {
        //  http://stackoverflow.com/questions/17836273/export-javascript-data
        //  -to-csv-file-without-server-interaction
        var csvRows = [];
        for (var i = 0; i < twoDiArray.length; ++i) {
            for (var j = 0; j < twoDiArray[i].length; ++j) {
                twoDiArray[i][j] = '\"' + twoDiArray[i][j] + '\"';
            }
            csvRows.push(twoDiArray[i].join(','));
        }

        var csvString = csvRows.join('\r\n');
        var $a = $('<a></a>', {
                href: 'data:attachment/csv;charset=utf-8,' + escape(csvString),
                target: '_blank',
                download: fileName + '.csv'
            });

        $('body').append($a[0]);
        $a.get(0).click();
        $a.remove();
    }

    angular.module('IcsgSignup', [])
        .controller('signupController', function ($scope) {
            $scope.submitted = false;
            $scope.submitHandler = function () {
                var data = JSON.parse(localStorage.getItem('data'));
                data.push($scope.student);
                saveData(data);
                $scope.student = {};
                $scope.submitted = true;
            };

            function init () {
                var data = localStorage.getItem('data');
                if (!data) {
                    // No data found, we initialize a new array and save to localStorage;
                    data = [];
                    saveData(data);
                }
            }

            init();
        })
        .controller('adminController', function ($scope) {
            $scope.data = JSON.parse(localStorage.getItem('data'));

            $scope.deleteRow = function (index) {
                if (confirm('Delete the row?')) {
                    $scope.data.splice(index, 1);
                    saveData($scope.data);
                }
            };

            $scope.exportData = function () {
                var data = [];
                data.push(HEADERS.slice());
                $scope.data.forEach(function (student) {
                    data.push(HEADERS.map(function (key) {
                        return student[key];
                    }));
                });
                console.log(data);
                arrayToCSV(data, 'icsg-signup');
            };
        });
})();
