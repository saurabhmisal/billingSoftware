app.controller('NavbarController', function ($scope, $location, userFactory) {
    $scope.getClass = function (path) {
        if ($location.path().substr(0, path.length) == path) {
            return true
        } else {
            return false;
        }
    }

    $scope.logout = function () {
    	userFactory.logout();
    }

    $scope.changePassword = function () {
    	console.log($scope.edit); 
    }
});
