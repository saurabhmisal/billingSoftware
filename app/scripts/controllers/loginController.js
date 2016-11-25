app.controller('loginController', function($scope, $http, userFactory){
    let vm = this;
    vm.loginForm = {
      notHasError:true,
      errorMsg:''
    };
    vm.loginForm.notHasError = true;

    vm.login = function (data) {
      if ($scope.form.$valid) {
        $http.post('app/php/user/userLogin.php', data).success(function (result) {
            if(result.valid){
                window.location.assign("http://localhost/crmwithmongo/");
            }
            else{
              swal("Error", result.error, "error")
            }
        });
      } else {
        swal("Error", "Login fields are required", "error")
      }
    }
});
