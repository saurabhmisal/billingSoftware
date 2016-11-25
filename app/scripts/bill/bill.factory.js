app.factory('BillFactory', BillFactory);

function BillFactory($http){
  // function getAllCustomers() {
  //   $http.post('app/json/customerDetails.json').success(function(data){
  //
  //       if(data == "") $scope.customers = [];
  //       else $scope.customers = data;
  //
  //   });
  // }

  // function getAllStocks() {
  //   $http.post('app/json/stockDetails.json').success(function(data){
  //
  //       if(data == "") vm.stocks = [];
  //       else vm.stocks = data;
  //       console.log(vm.stocks);
  //
  //   });
  // }

  return{
    get_bills:function(callback) {
      $http.post('app/json/stock/sale.json').success(list=>{
        callback(list)
      })
    }
  }
}
