app.controller('stockHistoryController', function($scope, userFactory, $http, $routeParams, formFactory, stocks){
	let data = {id:$routeParams.stockID};
	let fn = userFactory


	$scope.edit = {};
	stocks.detail(data, 'app/php/fetchStockHistory.php', function (data) {
		console.log(data)
		let stockDetail = Object.assign({}, data[0]);
		$scope.stock = {};
		$scope.stock.stock_row = stockDetail.stock_row;
		$scope.stock.purchase_row = stockDetail.purchase_row;
		$scope.stock.id = stockDetail.stock_id;
		$scope.stock.name = stockDetail.name;
		$scope.stock.price = stockDetail.price;
		$scope.stock.ph = data
		// .map(function (s) {
		// 	// console.log(s)
		// 	// s.date = new Date(s.date)
		// })
	});


	
    $scope.remove_stock_purchase_history = function (sh) {
    	let result =  fn.propIndexInObjectArray($scope.stock.ph, 'purchase_row', sh.purchase_row)
    	console.log(result)
    	if (result.valid) {
	    	let data = JSON.parse(angular.toJson(sh));
	    	fn.remove($scope.stock.ph, data, 'app/php/deleteStockHistoryItem.php', result.index, "Do you want to delete this purchase history")
	    }
	    else{
	    	swal("Error", "Error:- Press F5 and try again ", "error")
	    };
    }


});
