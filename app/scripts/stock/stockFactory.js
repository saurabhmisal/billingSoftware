app.factory('StockFactory', function($http){
	return {
		get_all_stocks: function (callback) {
			$http.post('app/json/stockDetails.json').success(function(data){
		        callback(data);
		    });
		},
		save:(products)=>{
			$http.post('app/php/stock/saveStock.php', products).success((result)=>{
				if (result.valid) {
					swal("Success", "Products added Successfully", "success");
					window.location.assign("http://localhost/crmwithmongo/#/stock");
				} else {
					swal("Error", result.error, "error");
				}
			})
		},
		save_purchase:(purchase)=>{
			$http.post('app/php/stock/savePurchaseStock.php', purchase).success((result)=>{
				if (result.valid) {
					swal("Success", "Purchase added Successfully", "success");
					window.location.assign("http://localhost/crmwithmongo/#/stock");
				} else {
					swal("Error", result.error, "error");
				}
			})
		},
		remove:(id, callback)=>{
			$http.post('app/php/stock/deleteStock.php', {id}).success((result)=>{
				if (result.valid) {
					console.log(result);
					callback(result)
				} else {
					swal("Error", result.error, "error");
				}
			})
		},
		detail: function (data, url, callback) {
			$http.post(url, data).success(function (response) {
			 	callback(response);
			});
		},
		cleanForm: function (formId, form) {
			if (formId == "add-purchase-form")
				form.row = "";
			form.id = "";
			form.name = "";
			form.price = "";
			form.quantity = "";

		},
		get_all_purchase: function (callback) {
			$http.post('app/json/stock/purchase.json').success(function(data){
		        callback(data);
		    });
		},
		get_all_sale: function (callback) {
			$http.post('app/json/stock/sale.json').success(function(data){
		        callback(data);
		    });
		},
		get_all_sale_return: function (callback) {
			$http.post('app/json/stock/saleReturn.json').success(function(data){
		        callback(data);
		    });
		},
		get_all_purchase_return: function (callback) {
			$http.post('app/json/stock/purchaseReturn.json').success(function(data){
		        callback(data);
		    });
		},
		remove_purchase:(purchase, callback)=>{
			$http.post('app/php/stock/deletePurchase.php', {purchase}).success((result)=>{
				if (result.valid) {
					console.log(result);
					callback(result)
				} else {
					swal("Error", result.error, "error");
				}
			})
		},
		remove_purchase_return:(purchaseReturn, callback)=>{
			$http.post('app/php/stock/deletePurchaseReturn.php', {purchaseReturn}).success((result)=>{
				if (result.valid) {
					console.log(result);
					callback(result)
				} else {
					swal("Error", result.error, "error");
				}
			})
		}
	};
});
