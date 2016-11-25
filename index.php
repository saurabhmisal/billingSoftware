<?php
// session_start();
// if (!isset( $_SESSION['login'])) {
//     header('Location: login.php');
// }
//

?>

<!DOCTYPE html>
<html>
<head>
    <title>Customer Manager</title>
    <!-- <script language=JavaScript> var message="Function Disabled!"; function clickIE4(){ if (event.button==2){  return false; } } function clickNS4(e){ if (document.layers||document.getElementById&&!document.all){ if (e.which==2||e.which==3){  return false; } } } if (document.layers){ document.captureEvents(Event.MOUSEDOWN); document.onmousedown=clickNS4; } else if (document.all&&!document.getElementById){ document.onmousedown=clickIE4; } document.oncontextmenu=new Function("return false") </script> -->
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
    <script src="app/scripts/stock/purchaseReturn.controller.js"></script>

    <!-- bill -->
    <script src="app/scripts/bill/billController.js"></script>
    <script src="app/scripts/bill/saleReturn.controller.js"></script>
    <script src="app/scripts/bill/bill.factory.js"></script>


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

    <script type="text/javascript">
    // $(document).ready(()=>{
    //   $('.search_test').SumoSelect({search: true, searchText: 'Enter here.'});
    // })
      Mousetrap.bind('esc', function(e) {
        e = e || window.event; // support  for IE8 and lower
        e.preventDefault(); // stop browser from doing native logic
        window.history.back();
      });
    </script>
</head>
<body data-ng-app="customersApp">
    <nav class="navbar" style='border-radius:0px;'>
        <div class="container-fluid">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
              <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
              <a class="navbar-brand" href="#/"> <div><img style='position:absolute; top:0px;' src="assets/img/people.png" alt="logo"> <div styl id='logo-app-name'>Customer Manager</div></div> </a>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1" data-ng-controller="NavbarController">

                <ul class="nav custom-nav pull-left">
                    <li><a href="#/customers">Customers</a></li>
                    <li><a href="#/suppliers">Suppliers</a></li>
                    <li><a href="#/orders">Orders</a></li>
                    <li><a href="#/bill">Bill</a></li>
                    <li><a href="#/stock">Stock</a></li>
                    <li><a href="#/report">Report</a></li>
                </ul>
                <div class="dropdown pull-right">
                    <button class="btn dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" style="
                    background: none;
                    line-height: 2;
                    margin-right: 20px;
                    color: #fff;
                ">
                        <span class="glyphicon glyphicon-cog"></span>
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                        <li><a href="#/changePassword">Change Password</a></li>
                        <li><a ng-click='logout()' href="#">Log out</a></li>
                    </ul>
                </div>
            </div><!-- /.navbar-collapse -->
        </div><!-- /.container-fluid -->
    </nav>
    <!-- Note that AngularJS 1.2+ now has a built-in ng-animation direction. Left in animated-view to show a
         custom directive -->
    <div animated-view></div>

</body>
</html>
