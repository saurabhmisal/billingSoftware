app.controller('CustomersController', function($scope, $http, formFactory, customers) {

    $scope.customerEdit = {};
    $scope.editCustomer = {};
    $scope.addForm = {};
    $scope.addForm.notHasError = true;
    $scope.editForm = {};
    $scope.editForm.notHasError = true;
    $scope.forms = [
        {
            index: 0,
            id: 'add-customer-form',
            url: 'app/php/saveCustomer.php'
        }
    ];
    
    customers.list('app/json/customerDetails.json', function (data) {
        $scope.customers = data == "" ? [] : data; 
    });

    //  Insert Customer
    function getData (formId) {     
        return {
            id: $scope.newCustomer.id,
            name: $scope.newCustomer.name,
            shopName: $scope.newCustomer.shopName,
            phone: $scope.newCustomer.phone,
            email: $scope.newCustomer.email === undefined ? "" : $scope.newCustomer.email,
            city: $scope.newCustomer.city
        };
    }

    function toggleError (form, state, msg) {
        form.notHasError = state;
        form.errorMsg = msg; 
    }

    function handleInsertResponse (result, data) {
        if(result['state'] === "error"){
            
            $("#" + result['field']).closest('div').removeClass('has-success');
            $("#" + result['field']).closest('div').addClass('has-error');  
            
            // toggleError($scope.addForm, false, result['msg']);
            formFactory.showError($scope.addForm, result['msg']);
        }
        else{
            formFactory.removeError($scope.addForm);

            customers.pushNewCustomer($scope.customers, data);
            customers.cleanAddCustomerForm($scope.newCustomer);
            
            swal("Successfull", "New Customer added", 'success');
            
            // REMOVE ERROR CLASSES
            $("#add-customer-form").find('input').each(function(){
                $(this).closest('div').removeClass('has-success');
                $(this).closest('div').removeClass('has-error');
            });
        }
    }
    $scope.checkForm = function(formId){
        
        var
        left = [{'id':'email'}];

        formFactory.validateForm(formId, left, function (valid) {
            if(valid){
                formFactory.removeError($scope.addForm);

                formFactory.insert(getData(formId), $scope.forms, formId, function (result) {
                     handleInsertResponse(result, getData(formId));
                })
            }
            else{
                formFactory.showError($scope.addForm, " Please Fill all '*' marked fileds");
            }
        })
    }




    // Edit Customer
    function handleEditResponse (result, data) {
         
        if(result['state'] === "error"){
            
            if (result['field'] == 'id') { error(['edit-customer-id', 'edit-customer-email', 'edit-customer-phone']); } 
            else if (result['field'] == 'email') { error(['edit-customer-email', 'edit-customer-id', 'edit-customer-phone']);} 
            else if (result['field'] == 'phone'){ error(['edit-customer-phone', 'edit-customer-email', 'edit-customer-id']); };
            
            formFactory.showError($scope.editForm, result['msg']);
        }
        else{
            formFactory.removeError($scope.editForm);

            $("#edit-customer-modal").find('input').each(function(){
                $(this).removeClass('empty');
            });
            $('#edit-customer-modal').modal('hide');
            
            $scope.customerEdit['id'] = data['id'];
            $scope.customerEdit['name'] = data['name'];
            $scope.customerEdit['shopName'] = data['shopName'];
            $scope.customerEdit['phone'] = data['phone'];
            $scope.customerEdit['email'] = data['email'];
            $scope.customerEdit['city'] = data['city'];
        }
    }
    function error (ids) {
        for (var i = 0; i < ids.length; i++) {
            if (i==0) {
                $("#" + ids[0]).addClass('empty');
            } else{
                $("#" + ids[i]).removeClass('empty');
            };
        };
    }
    $scope.makeModel = function(customer){
        $scope.editCustomer['row'] = customer['row'];
        $scope.editCustomer['id'] = customer['id'];
        $scope.editCustomer['name'] = customer['name'];
        $scope.editCustomer['shopName'] = customer['shopName'];
        $scope.editCustomer['phone'] = parseInt( customer['phone'] );
        $scope.editCustomer['email'] = customer['email'];
        $scope.editCustomer['city'] = customer['city'];

        

        $scope.customerEdit = customer;

        $('#edit-customer-modal').modal('show');
    }
    $scope.edit = function(){

        formFactory.editContent( $scope.editCustomer, "app/php/editCustomer.php", function(result, data){
            handleEditResponse(result, data);
        });
    }



    
    // Delete Customer
    $scope.removeRequest = function  (row) {
        formFactory.findIndex( $scope.customers, 'row', row, function (index) {
            if( index != -1 ){
                data =  {};
                data['row'] = $scope.customers[index]['row'];

                formFactory.remove($scope.customers, data, 'app/php/deleteCustomer.php', index, "are you confirm to delete a customer");
            }
        });
    }

});