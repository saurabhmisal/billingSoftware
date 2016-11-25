app.controller('OrdersController', function($scope, $http, orders, formFactory) {
	
	orders.list('app/json/orderDetails.json', function (data) {
		 $scope.orders = data == "" ? [] : data;
	});

	
    $scope.showOrderDetail = function(order) {
    	var data = {orderId: order.orderId};
    	orders.getOrderdetail(data, 'app/php/fetchOrderDetails.php', function (result) {
    		$scope.orderDetail = result.map(function (item) {
				item['total'] = parseInt(item['price']) * parseInt(item['quantity']);
				return item;
    		});
    	});
    	$("#order-detail-modal").modal('show');
    }
    $scope.removeRequest = function (order) {
        var data = {orderId: order.orderId},
        index = -1;
        formFactory.findIndex($scope.orders, 'orderId', order.orderId, function (index) {
           if(index!=-1){
                formFactory.remove($scope.orders, data, 'app/php/deleteOrder.php', index, "are you confirm to delete this order");                
           } 
        });
    }

});