<!DOCTYPE html>
<html data-ng-app="customersApp">
<head>
    <title>Customer Manager</title>
    <link href="assets/bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet
    " />
    <link href="assets/bower_components/sweetalert/dist/sweetalert.css" rel="stylesheet"/>
    <link href="assets/bower_components/angular-ui-select/dist/select.css" rel="stylesheet"/>
    <link href="assets/bower_components/sumoselect/sumoselect.css" rel="stylesheet"/>
    <link href="app/css/style.css" rel="stylesheet"/>
    <link href="app/css/input-type-search.css" rel="stylesheet"/>

    <!-- Vendor Libs: jQuery only used for Bootstrap functionality -->
    <script src="assets/bower_components/angular/angular.js"></script>
    <script src="assets/bower_components/angular-sanitize/angular-sanitize.js"></script>
    <script src="assets/bower_components/angular-route/angular-route.js"></script>
    <script src="assets/bower_components/angular-messages/angular-messages.js"></script>
    <script type="text/javascript" src='assets/bower_components/angular-ui-select/dist/select.min.js'>

    </script>
    <script src="assets/bower_components/jquery/dist/jquery.min.js"></script>

    <!-- UI Libs -->
    <script src="assets/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="assets/bower_components/sweetalert/dist/sweetalert.min.js"></script>
    <script src="assets/bower_components/mousetrap/mousetrap.min.js"></script>
    <script src="assets/bower_components/sumoselect/jquery.sumoselect.min.js"></script>

    <!-- App libs -->
    <script src="app/app.js"></script>
    <script src="app/scripts/directives/animatedView.js"></script>


    <!-- Stock -->
    <script src="app/scripts/stock/stockController.js"></script>
    <script src="app/scripts/stock/stockHistoryController.js"></script>
    <script src="app/scripts/stock/stockFactory.js"></script>

    <!-- bill -->
    <script src="app/scripts/bill/billController.js"></script>

    <!-- Controllers -->
    <script src="app/scripts/controllers/navbarController.js"></script>
    <script src="app/scripts/controllers/customerController.js"></script>
    <script src="app/scripts/controllers/customerOrdersController.js"></script>
    <script src="app/scripts/controllers/galleryController.js"></script>
    <script src="app/scripts/controllers/orderController.js"></script>
    <script src="app/scripts/controllers/loginController.js"></script>
    <script src="app/scripts/controllers/passwordController.js"></script>

    <!-- Service -->
    <script src="app/scripts/services/stockService.js"></script>
    <script src="app/scripts/services/tabService.js"></script>

    <!-- Factory -->
    <script src="app/scripts/factorys/formFactory.js"></script>
    <script src="app/scripts/factorys/customerFactory.js"></script>
    <script src="app/scripts/factorys/ordersFactory.js"></script>
    <script src="app/scripts/factorys/userFactory.js"></script>
    <script src="app/scripts/factorys/function.factory.js"></script>

    <!-- directives -->
    <script src='app/scripts/directives/directive.module.js'></script>
    <script src='app/scripts/directives/inputText.directive.js'></script>

    <!-- Supplier -->
    <script src="app/scripts/supplier/supplier.controller.js"></script>
    <script src="app/scripts/supplier/supplier.factory.js"></script>
</head>
<body>

    <div class="container-fluid" ng-controller='loginController as ctrl' ng-cloak>
        <div class="error" ng-class=" {'hide': ctrl.loginForm.notHasError} ">
            <p class="error-text"> {{ctrl.loginForm.errorMsg}} </p>
        </div>

        <form novalidate id='login' name='form' ng-submit='ctrl.login(data)'>
            <h4 id='login-text'>Login</h4>
            <div class="form-group" ng-class="{true: 'has-error'}[submitted && form.username.$invalid]">
                <label class="control-label" for="username">Username</label>
                <input type="text" name="username" class='form-control' data-ng-model="data.username" required />
            </div>
            <div class="form-group" ng-class="{true: 'has-error'}[submitted && form.password.$invalid]">
                <label class="control-label" for="password">Password</label>
                <input type="password" name="password" class='form-control' data-ng-model="data.password" required />
            </div>
            <button type="submit" class="btn btn-primary btn-large" ng-click="submitted=true">Submit</button>
        </form>
    </div>

</body>
</html>
