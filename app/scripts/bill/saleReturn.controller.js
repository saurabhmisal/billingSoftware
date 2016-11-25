app.controller('SaleReturnController', function($scope, $http, $filter, customers, FunctionFactory, StockFactory, BillFactory){
  console.log("SaleReturnController");
    let vm = this,
    fn = FunctionFactory
    $scope.purchasingCustomer ={};
    $scope.addForm = {notHasError:true};

    vm.saleReturn = {
      date:   $filter("date")(Date.now(), 'dd-MM-yyyy'),
      items:  fn.get_100_rows(),
      returnProducts: "",
      totalQty:0,
      netAmount:0,
      vchNo:null
    }
    StockFactory.get_all_stocks((list)=>{vm.stocks = list})
    customers.list((list)=>{vm.customers = list})


    vm.find_net_amount = (targetObj)=>{
        targetObj['total'] = fn.multiply(targetObj['rQuantity'], targetObj['product']['price'])
        vm.total_amount()
    }
    vm.total_amount = ()=>{
      let
      processed = fn.pluck_filled_row(vm.saleReturn.items, 5),
      quantity  = [],
      amount    = []

      processed.map((item)=>{
        quantity.push(item.rQuantity)
        amount.push(item.total)
      })
      vm.saleReturn.returnProducts = processed;
      vm.saleReturn.totalQty =          fn.array_total(quantity, 0)
      vm.saleReturn.netAmount =         fn.array_total(amount, 0)

      // console.log(processed);
    }

    vm.save_sale_return = ()=>{
      let saleReturn = fn.clone_object(vm.saleReturn);

      if($scope.form.$valid && saleReturn.date && saleReturn.netAmount && saleReturn.totalQty){
        let returnProducts = saleReturn.returnProducts.map((item)=>{
          item.productId = item.product.productId;
          delete item.product
          delete item.id
          return item
        })

        delete saleReturn.items
        delete saleReturn.returnProducts
        // saleReturn.voucherNumber = 02;
        saleReturn.returnProducts = returnProducts
        // console.log(saleReturn);
        $http.post('app/php/stock/saleReturn.php', saleReturn).success((result)=>{
          if (result.valid) {

          }
          else{
            fn.error(result.error)
          }
        })
      }
      else {
        fn.error("Fill details correctly");
      }
    }




});
