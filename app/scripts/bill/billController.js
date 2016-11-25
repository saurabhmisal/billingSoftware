app.controller('BillController', BillController);


function BillController($scope, $http, $filter, FunctionFactory, customers, StockFactory, BillFactory){
    console.log("BillController");
    let vm = this,
    fn = FunctionFactory
    $scope.items = [{}];
    $scope.purchasingCustomer ={};
    $scope.addForm = {notHasError:true};
    vm.report = {}
    vm.bill = {
      date:   $filter("date")(Date.now(), 'dd-MM-yyyy'),
      items:  fn.get_100_rows(),
      purchasedProducts: "",
      totalQty:0,
      netAmount:0
    }
    StockFactory.get_all_stocks((list)=>{vm.stocks = list})
    customers.list((list)=>{vm.customers = list})


    let arr =window.location.href.split('/'),
		page = arr[arr.length-1];
    console.log(page);

    let callback = ()=>{}
    if (page == "bill") {
      callback = set_vch_id
    }
    get_all_bills(callback);
        
    

    vm.find_net_amount = (targetObj)=>{
      if(parseInt(targetObj['pQuantity']) <= parseInt(targetObj['product']['quantity'])){
        $scope.addForm.notHasError = true;
        let
        q = targetObj['pQuantity'] || 0,
        p = targetObj['product']['price'] || 0,
        d = targetObj['product']['discount'] || 0;
        let
        total = fn.multiply(q, p),
        discount = fn.multiply(q, d);
        targetObj['total'] = total
        vm.total_amount()
      }
      else{
        $scope.addForm.notHasError = false;
        $scope.addForm.errorMsg = "Purchase Quantity cannot be greater then '"+targetObj['product']['quantity']+"'";
      }
    }
    vm.total_amount = ()=>{
      let
      processed = fn.pluck_filled_row(vm.bill.items, 5),
      quantity  = [],
      amount    = []

      processed.map((item)=>{
        quantity.push(item.pQuantity)
        amount.push(item.total)
      })
      vm.bill.purchasedProducts = processed;
      vm.bill.totalQty =          fn.array_total(quantity, 0)
      vm.bill.netAmount =         fn.array_total(amount, 0)

      // console.log(processed);
    }


    vm.save = ()=>{
      save_bill(()=>{})
    }
    // vm.save = ()=>{
    //
    // }

    vm.show_bill_details = (vNumber)=>{
      let bill = vm.bills.filter((b)=>{
        return b.vchNo == vNumber
      })
      bill = bill[0]
      console.log(bill);
      let sale = bill.purchasedProducts.map((pu)=>{
        let p = fn.fetch_object(vm.stocks, 'productId', pu.productId);
        p = p[0]
        pu.product = p;
        // console.log(p);
        return pu;
      });
      bill.purchase = sale;
      console.log(bill);
      vm.selectedBill = bill
      $('#bill-detail').modal('show');
    }
    // gerenerate order report
    vm.generate_report = ()=>{
      let
      firstDate = $filter('date')(vm.report.from, "dd-MM-yyyy"),
      lastDate = $filter('date')(vm.report.to, "dd-MM-yyyy"),
      firstDateObj = new Date(vm.report.from),
      orders = [],
      arr = '';

      // console.log(firstDate, lastDate)
      arr = vm.bills.filter(function(order) { 
        // console.log(order)
        return order.date == firstDate });
      // console.log(vm.bills.filter(function(order) { return order.date == firstDate }));
      orders = copy_array(arr, []);
      // console.log(orders);

      while (firstDate != lastDate) {
        let nextDateObj = firstDateObj.setDate(firstDateObj.getDate()+1);
        firstDate = $filter('date')(nextDateObj, "dd-MM-yyyy"); // format date
        firstDateObj = new Date(nextDateObj)

        let arr = vm.bills.filter(function(order) { return order.date == firstDate })
        orders = copy_array(arr, orders)
      }
      // console.log(orders);
      
      if (orders.length ==0) {
        swal("Error", "No orders found between given dates", "error")
      }


      // generating array of all product sold between given dates
      let arrP = orders.map(function(order) {
        return object_to_array(order.purchasedProducts)
      })
      // console.log("Array of products: ",arrP);


      let allOrderdProductsArr = [];
      for (elem of arrP) {
        allOrderdProductsArr = copy_array(elem, allOrderdProductsArr)
      }
      // console.log("All products: ",allOrderdProductsArr);


      // generating associative array
      // key = product id
      // value = array of product sale
      let list = []
      let productListArr = []
      for (product of allOrderdProductsArr) {
          pId = product.productId
          if(list.indexOf(pId)== -1){
              list.push(pId)
              productListArr[pId] = allOrderdProductsArr.filter(function (p) {
                return p.productId == pId
              })
          }
      }
      // console.log(productListArr);

      // calculating total quantity sold of a product
      // generating array of object with product id, name, total quantity
      let productList = []
      for (var pId in productListArr) {
          let totalQty = 0;
          for (var i = 0; i < productListArr[pId].length; i++) {
            totalQty = totalQty + parseInt(productListArr[pId][i]['pQuantity'])
          }
          
          let product = vm.stocks.filter((p)=>{ return p.productId == pId })[0]
          // console.log(product);
          productList.push({
            productId: pId,
            name: product.description,
            qty: totalQty,
            unit: product.unit
          });
      }
      // console.log(productList);
      // console.log(orders);
      // calculating total sale
      let totalSale = 0
      for(let order of orders){
        totalSale = totalSale + order.netAmount
      }

      vm.report = {
        sale: totalSale,
        orders: orders.length,
        soldProducts : productList,
      }
      // console.log(vm.report)
    }

    function get_all_bills (callback) {
      BillFactory.get_bills((list)=>{
        vm.bills = list
        callback(list)
      });
    }
    function set_vch_id(list){
      let lastBill = list[list.length-1];
      vm.bill.vchNo = parseInt(lastBill.vchNo) + 1
    }
    function save_bill(callback) {
      let bill = fn.clone_object(vm.bill);

      if($scope.billForm.$valid && bill.date && bill.netAmount && bill.totalQty && $scope.addForm.notHasError){
        let purchasedProducts = bill.purchasedProducts.map((item)=>{
          item.productId = item.product.productId;
          delete item.product
          delete item.id
          return item
        })

        delete bill.items
        delete bill.purchasedProducts
        // bill.voucherNumber = 02;
        bill.purchasedProducts = purchasedProducts
        // console.log(bill);
        $http.post('app/php/bill/saveBill.php', bill).success((result)=>{callback()})
      }
      else {
        fn.error("Fill details correctly");
      }
    }
    function copy_array(target, main) {
      if (target.length) {
          for (elem of target) {
              main.push(elem);
          }
      }
      return main
    }
    function object_to_array(obj){
      let arr = []
      for(var i in obj){
          arr.push( obj[i] )
      }

      return arr;
    }
}
