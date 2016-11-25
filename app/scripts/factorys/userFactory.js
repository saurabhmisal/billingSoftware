app.factory('userFactory', UserFactory);

function UserFactory($http){
	var
	result = '',
	valid = true,
	form;

	let findUndefinedProp = (obj) =>{
		for(let prop in obj){
			console.log(prop, obj[prop])
			if(obj[prop] === undefined){
				return true
			}
		}
		return false
	}

	let objUndefined = (obj) => {
		if(obj === undefined){
			return true;
		}
		return false
	}

	function validateReturn(form) {
		var result = { error_msg: '', valid: true }

		if(!objUndefined(form.data) && !findUndefinedProp(form.data)){
			removeError(form, result.error_msg)
        }
    	else{
    		result.error_msg = "Fill all the fields"
    		result.valid = false
        	showError(form, result.error_msg);
    	}

        return result;

	}

	function showError (form, msg) {
        form.errorMsg = msg;
        form.error = 'show';
        console.log(form, msg)
    }

    function removeError (form, msg) {
        form.errorMsg = msg;
        form.error = 'hide';
    }

	function propIndexInObjectArray(arr, prop, value){
        if(arr.length == 0)
	        return {index:-1, valid:false}
		else if(arr[arr.length-1][prop] == value)
	        return {index:arr.length-1, valid:true}
		else
	        return propIndexInObjectArray(arr.slice(0, arr.length-1), prop, value)
	}

	function indexInNumericArray(arr, value){
        console.log(arr, value)
        if(!Array.isArray(arr)){
            return {index:0, valid:true}
        }

		if(arr.length == 0)
	        return {index:-1, valid:false}
		else if(arr[arr.length-1] == value)
	        return {index:arr.length-1, valid:true}
		else
	        return indexInNumericArray(arr.slice(0, arr.length-1), value)
	}

    function remove(alertMsg, data, url, arr, index, deleteFunc) {
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
        },deleteFunc);
    }


    function sendFormDtatToServer(url, data, form, callback) {
		var returnData = {error: false, result: ''};

		$http.post(url, data).then(function (response) {
			var result = response.data;
			if(result['error']){
				showError(form, result['error']);
				returnData.error = true;
			}
			else
				returnData.error = false;

			returnData.result = result;
		});

		callback(returnData);
	}

	return{
		postFormData: sendFormDtatToServer,
		showErr: showError,
        removeErr: removeError,
        propIndexInObjectArray: propIndexInObjectArray,
        indexInNumericArray: indexInNumericArray,
        remove : (arr, data, url, index, alertMsg)=>{
        	remove(alertMsg, data, url, arr, index, ()=>{
        		$http.post(url, data).success((result)=>{
        			if(result.valid){
                        if(!Array.isArray(arr)){
                            console.log('not an array', arr)
                        }
        				arr.splice(index,1)
        				swal("Success", "Deleted successfully", "success")
        			}
        			else{
        				swal("Error", result.error, "error")
        			}

        		});
        	});
        },
        getItem: (data, url, callback)=>{
        	$http.post(url, data)
        		.success(item=>{callback(item)})

        },
		logout: function () {
			$http.post('app/php/userLogout.php').then(function (obj) {
				var data = obj.data;
				if(data['logout'])
					window.location.assign("http://localhost/customerManagement/login.php");
			})
		},
		changePassword: function (data) {
			$http.post('app/php/changePassword.php', data).then(function (obj) {
                var data = obj.data;
                if(data['error'])
                    swal("Error", data['errorMsg'], 'error');
                else
                    window.location.assign("http://localhost/customerManagement/login.php");
            });
		}
	};
}
