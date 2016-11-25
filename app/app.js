var app = angular.module('customersApp', ['ngRoute', 'ngMessages', 'ui.select', 'ngSanitize', 'directivesModule']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/changePassword',
            {
                controller: 'PasswordController',
                templateUrl: 'app/views/changePasswordView.html'
            })
        .when('/customers',
            {
                controller: 'CustomersController',
                templateUrl: 'app/views/customerView.html'
            })
        .when('/sellers',
            {
                controller: 'SellersController',
                templateUrl: 'app/views/sellerView.html'
            })
        .when('/bill',
            {
                controller: 'BillController',
                templateUrl: 'app/views/bill/billView.html'
            })
        .when('/report',
            {
                controller: 'BillController',
                templateUrl: 'app/views/bill/report.html'
            })
        .when('/billList',
            {
                controller: 'BillController',
                templateUrl: 'app/views/bill/billList.html'
            })
        .when('/saleReturn',
            {
                controller: 'SaleReturnController',
                templateUrl: 'app/views/bill/saleReturn.html'
            })
        .when('/stock',
            {
                controller: 'StockController',
                templateUrl: 'app/views/stock/stockView.html'
            })
        .when('/addNewProducts',
            {
                controller: 'StockController',
                templateUrl: 'app/views/stock/addNewStock.html'
            })
        .when('/addPurchase',
            {
                controller: 'StockController',
                templateUrl: 'app/views/stock/addPurchase.html'
            })
        .when('/addPurchaseReturn',
            {
                controller: 'PurchaseReturnController',
                templateUrl: 'app/views/stock/addPurchaseReturn.html'
            })
        .when('/stockItems/:sId',
            {
                controller: 'StockController',
                templateUrl: 'app/views/stock/stockItems.html'
            })
        .when('/customerorders/:customerID',
            {
                controller: 'CustomerOrdersController',
                templateUrl: 'app/views/orderView.html'
            })
        .when('/sellerorders/:sellerID',
            {
                controller: 'SellerOrdersController',
                templateUrl: 'app/partials/sellerOrders.html'
            })
        //Define a route that has a route parameter in it (:customerID)
        .when('/orders',
            {
                controller: 'OrdersController',
                templateUrl: 'app/views/orders.html'
            })
        .when('/stock/:stockID',
            {
                controller: 'stockHistoryController',
                templateUrl: 'app/views/stockHistoryView.html'
            })
        .when('/suppliers',
            {
                controller: 'SupplierController',
                templateUrl: 'app/views/supplier/supplierView.html'
            })
        .when('/addNewSupplier',
            {
                controller: 'SupplierController',
                templateUrl: 'app/views/supplier/addNewSupplier.html'
            })
        .when('/supplier_details/:supplierId',
            {
                controller: 'SupplierController',
                templateUrl: 'app/views/supplier/supplierDetails.html'
            })

        // .when('/login',
        //     {
        //         controller: 'loginController',
        //         templateUrl: 'login.html'
        //     })
        .otherwise({ redirectTo: '/stock' });
});
