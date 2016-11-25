app.controller('StockController', function($scope, $http, formFactory, StockFactory, $routeParams, FunctionFactory, SupplierFactory){
    let
    vm = this,
    fn = FunctionFactory;

    $scope.newProduct = {
      productId:""
    }
    $scope.purchaseProduct = {
      quantity:0,
      rate:0,
      tax:0,
      total:0
    }
    vm.products = {
      new:[$scope.newProduct],
      list:[]
    }
    vm.purchase = {
      new:[$scope.purchaseProduct],
      list:[]
    }

    $scope.items = [{}];
    vm.newStockItem = {};
    $scope.stockForEdit = {};
    $scope.stockModal = {};
    $scope.stockPurchase = {};
    $scope.newStock = {
      supplier:{}
    }


    let arr =window.location.href.split('/'),
		page = arr[arr.length-1],
    callback = ()=>{};

    console.log(page);
    if (page == "stock") {
      get_all_stocks_list(callback);
    }
    else if(page === "addNewProducts"){
      get_all_stocks_list(set_new_product_id);
    }
    else if (page === "addPurchase") {
      get_all_stocks_list(()=>{
        for (var i = 0; i < 100; i++) {
          vm.purchase.new.push($scope.purchaseProduct);
          var items = angular.toJson(vm.purchase.new);
          items = JSON.parse(items);
          var id = 0;

          items = items.map(function (item) {
              id = id +1;
              item.id = id;
              // console.log(item);
              return item;
          });
          vm.purchase.new = items;
          get_all_supplier(show_page)
        }
      });
    }
    else {
      vm.purchaseReturn = {};
      get_all_stocks_list(()=>{
        StockFactory.get_all_purchase(totalPurchase=>{
          get_all_supplier(()=>{
            let productPurchase = fn.fetch_object(totalPurchase, 'productId', $routeParams.sId),
            x = ""
            // console.log(productPurchase, suppliers);
            let arr = productPurchase.map(p=>{
              x = fn.fetch_object(vm.suppliers, 'id', p.supplierId),
              x = x[0];
              p.firmName = x.firmName
              return p
            })
            vm.purchase.list = arr;
            console.log(vm.purchase.list);
          })
        });
        StockFactory.get_all_purchase_return(list=>{
          get_all_supplier(()=>{
            let purchaseReturn = fn.fetch_object(list, 'productId', $routeParams.sId),
            x = ""
            // console.log(purchaseReturn, suppliers);
            let arr = purchaseReturn.map(p=>{
              x = fn.fetch_object(vm.suppliers, 'id', p.supplierId),
              x = x[0];
              p.firmName = x.firmName
              return p
            })
            vm.purchaseReturn.list = arr;
            console.log(vm.purchaseReturn.list);
          })
        });
      });
    }


    $scope.addForm ={notHasError : true}
    $scope.purchaseForm = {notHasError : true}


    function get_all_supplier(callback){
        SupplierFactory.getAll(list=>{
          vm.suppliers=list
          callback()
        })
    }



    // Insert Stock
    vm.save_stock = (stockDetails, callback)=>{
      let arr = fn.pluck_filled_row(vm.products.new, 6);
      // if (vm.products.date != "") {
      if(arr.length != 0){
        StockFactory.save(arr);
      }
      else {
        swal("Error", "Enter at least one product details", "error")
      }
    }

    vm.addItem = ()=>{
        $scope.items.push({});
        var items = angular.toJson($scope.items);
        items = JSON.parse(items);
        var id = 0;

        items = items.map(function (item) {
            id = id +1;
            item.id = id;
            // console.log(item);
            return item;
        });
        $scope.items = items;
        // console.log($scope.items);
    }


    // Purchase Stock
    vm.save_purchase = ()=>{
      let arr = fn.pluck_filled_row(vm.purchase.new, 7),
      purchase = {};

      // console.log(arr);
      // console.log(vm.purchase.supplier , $scope.purchaseStock.$valid , arr.length);
      if(vm.purchase.supplier && $scope.purchaseStock.$valid && arr.length != 0){
        purchase.date =       vm.purchase.date
        purchase.products =   products = arr.map((p)=>{
                                p.productId = p.product.productId
                                delete p.id
                                delete p.product

                                p.supplierId = vm.purchase.supplier.id
                                p.invoice = vm.purchase.invoice
                                return fn.to_json(p);
                              })
        console.log(purchase);
        StockFactory.save_purchase(purchase);
      }
      else {
        swal("Error", "fill all details", "error")
      }

    }

    // Delete Stock
    $scope.remove_product = function  (id) {
        StockFactory.remove(id, (result)=>{
          swal("Success","Product deleted Successfully","success")
          get_all_stocks_list(()=>{})
        })
    }


    // Edit Stock
    $scope.saveEdit = ()=>{
      setTimeout(()=>{
        update_stock()
      },1000)
  	}
    vm.add_new_stock_item = ()=>{
      if($scope.addNewStockItemForm.$valid){
        if(fn.verify_date(vm.newStockItem.date) &&
           fn.verify_number('Price', vm.newStockItem.price) &&
           fn.verify_number('Quantity', vm.newStockItem.totalQty)
          ){

          let flag = true;
          if (vm.newStockItem.discount != undefined) {
            flag = fn.verify_number('Discount', vm.newStockItem.discount)
          }
          if (flag) {
            vm.newStockItem.id = vm.stock.items.length + 1;
            vm.newStockItem.history = [];

            let obj ={
              date:vm.newStockItem.date,
              qty:vm.newStockItem.totalQty
            }
            vm.newStockItem.history.push(obj)
            delete vm.newStockItem.date
            vm.stock.items.push(vm.newStockItem)
            vm.newStockItem = {}
            update_stock()
          }
        }
      }
      else {
        fn.error("All * mareked fields are mandatory")
      }
    }

    // delete stock item
    vm.remove_stock_item = (index)=>{
      fn.remove_array_element(vm.stock.items, index)
      update_stock()
    }

    // stock history
    vm.show_item_history = (item)=>{ // show item history
      vm.item = item;
      console.log(item);
      $('#items-purchase-history').modal('show')
    }
    vm.update_stock_date = (index)=>{ // update stock history date
      let result = fn.verify_date(vm.item.history[index]['date'])
      if(result){
        update_stock()
      }
    }
    vm.update_total_stock = ()=>{ // update total stock quantity
      let total = find_total_stock();
      vm.item.totalQty = total;
      update_stock()
    }
    vm.remove_purchase_history = (purchase)=>{
      var index =-1;
      for (var i = 0; i < vm.purchase.list.length; i++) {
          if (vm.purchase.list[i]['_id']['$id'] == purchase['_id']['$id']) {
              index = i;
              break;
          }
      };
      StockFactory.remove_purchase(purchase, ()=>{
        fn.remove_array_element(vm.purchase.list, index);
        vm.stock.quantity = find_total_stock();
      })
      // update_stock()
    }

    vm.remove_purchase_return_history = (purchaseReturn)=>{
      var index =-1;
      for (var i = 0; i < vm.purchaseReturn.list.length; i++) {
          if (vm.purchaseReturn.list[i]['_id']['$id'] == purchaseReturn['_id']['$id']) {
              index = i;
              break;
          }
      };
      StockFactory.remove_purchase(purchaseReturn, ()=>{
        fn.remove_array_element(vm.purchaseReturn.list, index);
        vm.stock.quantity = find_total_stock();
      })
      // update_stock()
    }
    function update_stock(){
      $http.post('app/php/stock/updateStock.php', {stock:vm.stock})
    }

    function find_total_stock(){
      let
      qtyArr = fn.pluck(vm.purchase.list, 'quantity'),
      qtyRtrArr = fn.pluck(vm.purchaseReturn.list, 'quantity'),
      total = fn.array_total(qtyArr, 0) - fn.array_total(qtyRtrArr, 0);

      return total
    }


    function parameterSet() {
      let stock = vm.products.list.filter(s=>{
        return s.productId == $routeParams.sId
      })
      stock = stock[0];
      if(stock.history == undefined){
        stock.history = []
      }
      vm.stock = stock;
    }
    function show_page() {
      var page = angular.element( document.querySelector( '#page' ) );
      var loader = angular.element( document.querySelector( '#loader' ) );
      page.removeClass('hide');
      loader.addClass('hide');
    }
    function get_all_stocks_list(callback) {
      StockFactory.get_all_stocks(list=>{
          vm.products.list = list == "" ? [] : list;
          if(Object.keys( $routeParams ).length){
            parameterSet()
          }
          callback();
      });
    }
    function set_new_product_id(){
      let products = vm.products.list,
      id = "";
      if(products.length > 0){
        let lastProduct = products[products.length-1];
        id = lastProduct.productId
      }
      else{
        id = "pr-100"
      }
      $scope.newProduct.productId = id;

      // arr, obj,
      for (var i = 0; i < 100; i++) {
        vm.products.new.push($scope.newProduct);
        var items = angular.toJson(vm.products.new);
        items = JSON.parse(items);
        let arr = $scope.newProduct.productId.split('-'),
        count = parseInt(arr[arr.length-1])
        // console.log(arr);

        items = items.map(function (item) {
          // console.log(id);
            count = count +1;
            item.productId = "pr-" + count;
            // console.log(item);
            return item;
        });
        // console.log(items);
        vm.products.new = items;
      }
      show_page();
    }

});
