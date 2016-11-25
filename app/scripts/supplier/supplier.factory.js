app.factory('SupplierFactory', SupplierFactory);

function SupplierFactory($http) {
  return{
    getAll:(callback)=>{ $http.post('app/json/supplier/suppliers.json').success((list)=>callback(list)) },
    insert:(newSupplier, callback)=>{
      $http.post('app/php/supplier/addNew.php', newSupplier).success((result)=>{
        if (result.valid) {
          swal("Success","New Supplier added", "success")
        }
        callback(result)
      })
    },
    remove:(supplierId, callback)=>{
      swal({
          title: "Are you sure?",
          text: "You want to delete this Supplier",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel plx!",
          closeOnConfirm: true,
          closeOnCancel: true
      },function() {
        $http.post('app/php/supplier/remove.php', {supplierId}).success((result)=>{
          if (result.valid) {
            callback()
          } else {
            swal("Error", result.error, "error");
          }
        })
      });
    },
    update:(data, callback)=>{
      $http.post('app/php/supplier/update.php', data).success((result)=>{
        if (result.valid) {
          callback()
          swal("Success", "Supplier details updated", "success")
        } else {
          swal("Error", result.error, "error");
        }
      })
    }
  }
}
