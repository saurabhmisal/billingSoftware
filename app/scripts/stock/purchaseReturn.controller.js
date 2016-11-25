app.controller('PurchaseReturnController', function($scope, $http, $filter, StockFactory, FunctionFactory, SupplierFactory){
    let
    vm = this,
    fn = FunctionFactory;

    vm.form ={error : false, msg:null, processing:false}
    vm.purchaseReturn = {
      date:   $filter("date")(Date.now(), 'dd-MM-yyyy'),
      items:  fn.get_100_rows(),
      returnProducts: "",
      totalQty:0,
      netAmount:0
    }

    SupplierFactory.getAll(list=>{ vm.suppliers=list })
    StockFactory.get_all_stocks((list)=>{
      vm.stocks = list
      show_page()
    })

    vm.find_net_amount = (targetObj)=>{
        targetObj['total'] = fn.multiply(targetObj['quantity'], targetObj['rate'])
        vm.total_amount()
    }
    vm.total_amount = ()=>{
      let
      processed = fn.pluck_filled_row(vm.purchaseReturn.items, 5),
      quantity  = [],
      amount    = []

      processed.map((item)=>{
        quantity.push(item.quantity)
        amount.push(item.total)
      })
      vm.purchaseReturn.returnProducts = processed;
      vm.purchaseReturn.totalQty =          fn.array_total(quantity, 0)
      vm.purchaseReturn.netAmount =         fn.array_total(amount, 0)

      // console.log(processed);
    }

    vm.save_purchase_return = ()=>{
      let purchaseReturn = fn.clone_object(vm.purchaseReturn);

      if($scope.form.$valid && purchaseReturn.date && purchaseReturn.netAmount && purchaseReturn.totalQty){
        let returnProducts = purchaseReturn.returnProducts.map((item)=>{
          item.productId = item.product.productId;
          delete item.product
          delete item.id
          return fn.to_json(item)
        })

        delete purchaseReturn.items
        delete purchaseReturn.returnProducts
        // purchaseReturn.voucherNumber = 02;
        purchaseReturn.returnProducts = returnProducts
        // console.log(purchaseReturn);
        $http.post('app/php/stock/purchaseReturn.php', purchaseReturn).success((result)=>{
          if (result.valid) {
            window.location.assign("http://localhost/crmwithmongo/#/stock");
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

    function show_page() {
      var page = angular.element( document.querySelector( '#page' ) );
      var loader = angular.element( document.querySelector( '#loader' ) );
      page.removeClass('hide');
      loader.addClass('hide');
    }


});
