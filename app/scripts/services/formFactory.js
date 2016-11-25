app.factory('formFactory', function($http){

	var result;

	function validateInput (formId) {
        var valid = true;

        $("#"+ formId).find('input').each(function(){
            
            if ($(this).val() === "") {
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

    function sendToServer(data, url, callback){
    	// console.log(data);
    	// console.log(url);
    	
        $http.post(url, data).success(function(response){
        	result = response;
        	callback(result);
        });

    };

	return{
		handleForm : function  (formId, data, forms, callback) {
	    	
	    	if(validateInput(formId)){
	    		result = sendToServer(  data, getUrl(forms, 'id', formId), callback  );

	    	}

	    }

	}
});