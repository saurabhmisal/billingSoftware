app.controller('CustomerOrdersController', function($scope, $http, $routeParams, customers){
	var data = {cid: $routeParams.customerID};
	customers.customerDetails(data, 'app/php/fetchCustomerDetail.php', function (result) {
		 // console.log(result);
		 $scope.customer = result;
	});

	customers.orderDetails(data, 'app/php/fetchCustomerOrders.php', function (result) {
		// console.log(result);

		 $scope.orders = result.map(function (order) {
		 	// console.log(order);
			return order.map(function (item) {
				item['total'] = parseInt(item['price']) * parseInt(item['quantity']);
				return item;
			});
		 });
		
		
		 //console.log($scope.orders);
	});

	$scope.doSum = function (order) {
		sum = 0;
		for (item of order) {
			sum = sum + item.total;
		}
		order.push({sum: sum});
		console.log(order);
	}

	$scope.setSumZero = function () {
		 $scope.sum = 0; 
		 // console.log('set to zero');
	}


});