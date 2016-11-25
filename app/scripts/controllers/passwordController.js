app.controller('PasswordController', function ($scope, $location, userFactory) {
    $scope.changePassword = {};
    $scope.changePassword.notHasError = true;

    $scope.changePassword = function () {
    	userFactory.changePassword($scope.edit); 
    }
});
