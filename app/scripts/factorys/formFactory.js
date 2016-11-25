app.factory('formFactory', function($http){

	var result;

    function checkForExceptionInput (arr, property, value) {
        var index = -1;
        if(arr.length){
            if ($(this).attr('id')) {
                index = searchIndex (arr, property, value);
            };
        }
        return index;
    }

	function validateInput (formId, left) {
        var 
        valid = true,
        index = -1,
        left = left === [] ? [] : left;

        $("#"+ formId).find('input').each(function(){

            index = checkForExceptionInput(left, 'id', $(this).attr('id'));

            if (index == -1 && $(this).val() === "") {
                valid = false;
                $(this).closest('div').addClass('has-error');
            }
            else{
                $(this).closest('div').removeClass('has-error');
            }

        });

        return valid;
    }


    function getUrl (arr, property, value) {

        var o = arr.filter(function(item){
            	return item[property] ===  value;
        	});
        return o[0].url;
    }

    function searchIndex (arr, property, value) {
        var index =-1;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][property] == value) {
                index = i;
                break;
            }
        }; 
        return index;
    }

	return{
        validateForm: function (formId, left, callback) {
            callback(validateInput(formId, left));
        },
		insert : function  (data, forms, formId, callback) {
            $http.post(getUrl(forms, 'id', formId), data).success(function(response){
                callback(response);
            });
	    },
        editContent : function (data, url, callback) {
            $http.post(url, data).success(function(response){
                result = response;
                callback(result, data);
            });
        },
        findIndex : function (arr, property, value, callback) {
            var 
            index=-1;

            index = searchIndex(arr, property, value);

            callback(index);
        },
        remove : function (arr, data, url, index, alertMsg) {
            swal({
                title: "Are you sure?",   
                text: alertMsg,   
                type: "warning",   
                showCancelButton: true,   
                confirmButtonColor: "#DD6B55",   
                confirmButtonText: "Yes, delete it!",   
                cancelButtonText: "No, cancel plx!",   
                closeOnConfirm: true,   
                closeOnCancel: true 
            }, 
            function(){ 
                $http.post(url, data).success(function(result){
                    arr.splice(index,1);
                });
            });
        },
        showError: function (form, msg) {
            form.notHasError = false;
            form.errorMsg = msg; 
        },
        removeError: function (form) {
            form.notHasError = true;
            form.errorMsg = ""; 
        }

	}
});