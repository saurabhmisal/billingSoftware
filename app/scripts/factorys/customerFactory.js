app.factory('customers', function($http){

	function fetchDetails (data, url, callback) {
		$http.post(url, data).success(function (result) {
			callback(result);
		})
	}

	function getCurDate () {
        var date = new Date();
        return ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear();
    }

	return {
		list: function (callback) {
			$http.post('app/json/customerDetails.json').success(function(data){
				callback(data);
			});
		},
		orderDetails: function (data, url, callback) {
			 fetchDetails(data, url, callback);
		},
		customerDetails: function (data, url, callback) {
			 fetchDetails(data, url, callback);
		},
		pushNewCustomer: function (customers, newCustomer) {
			newCustomer.date = getCurDate();
	        customers.unshift(newCustomer);
		},
		cleanAddCustomerForm: function (newCustomer) {
			newCustomer.id = "";
			newCustomer.name = "";
			newCustomer.shopName = "";
			newCustomer.phone = "";
			newCustomer.email = "";
			newCustomer.city = "";
		},
		getCustomer: function (pushNewCustomer) {
			 /* body... */
		}
	};
})
