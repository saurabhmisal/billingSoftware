app
  .controller('SupplierController', SupplierController)

function SupplierController($scope, $http, SupplierFactory, $routeParams, FunctionFactory){
  let vm = this,
  fn = FunctionFactory;
  console.log("Supplier controller is running");
  // console.log($scope);

  vm.suppliers = {
    list:[],
    new: {}
  }
  vm.forms = {
    addSupplier:{notHasError:true, errorMsg:""}
  }
  get_all_suppliers(()=>{})

  // insert new supplier
  function insert_supplier(callback) {
    if ($scope.form.$valid) {
      SupplierFactory.insert(vm.suppliers.new, function(result) {
        console.log(result);
        if (result.valid) {
          vm.suppliers.new = {}
          get_all_suppliers(set_new_supplier_id)
          $scope.form.$setPristine();
          callback()
        }
        else {
          vm.forms.addSupplier.notHasError=false
          vm.forms.addSupplier.errorMsg=result.error
        }
      })
    }
    else {
      fn.error("Fill all * marked filleds");
    }
  }
  vm.insert = ()=>{
    insert_supplier(()=>{
      redirect_to_stock_page();
    })
  }
  vm.insert_and_new = ()=>{
    insert_supplier(()=>{})
  }

  // delete supplier
  vm.remove_supplier=(supplier)=>{
    SupplierFactory.remove(supplier.id, ()=>{
      get_all_suppliers(()=>{});
    })
  }

  // update supplier
  vm.update = ()=>{
    if($scope.form.$valid){
      SupplierFactory.update(vm.supplier, ()=>{
        redirect_to_stock_page()
      })
    }
    else {
      swal("Error", "Please correct errors in form", "error");
    }
  }


  if(Object.keys( $routeParams ).length){
    get_all_suppliers(()=>{
        let arr = fn.fetch_object(vm.suppliers.list, 'id', $routeParams.supplierId)
        vm.supplier = arr[0]
        // console.log(vm.suppliersDetails);
    })
  }

  function redirect_to_stock_page() {
    window.location.assign("http://localhost/crmwithmongo/#/suppliers");
  }
  function get_all_suppliers(callback) {
    // console.log("fetching suppliers list");
    SupplierFactory.getAll((list)=>{
      vm.suppliers.list = list
      // console.log("suppliers list fetched");
      if (vm.suppliers.list.length >= 1) {
        callback()
      }
      else{
        vm.suppliers.new.id = "su-101"
      }
    })
  }
  function set_new_supplier_id() {
    let arr = vm.suppliers.list[vm.suppliers.list.length-1]['id'].split('-')
    let num = parseInt(arr[arr.length-1])+1
    vm.suppliers.new.id = "su-"+num.toString()
  }

}
