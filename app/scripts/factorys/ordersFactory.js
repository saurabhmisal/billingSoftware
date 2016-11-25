app.factory('orders', function($http){
	return{
		list: function (url, callback) {
			$http.post('app/json/orderDetails.json').success(function(result){
				callback(result);
		    });
		},
		getOrderdetail: function (data, url, callback) {
			$http.post(url, data).success(function (result) {
				callback(result);
			});
		}
	};
});