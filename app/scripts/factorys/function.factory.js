app.factory('FunctionFactory', FunctionFactory);

function FunctionFactory() {
  function remove_array_element(arr, index) {
		arr.splice(index,1)
		return arr;
	}
  function pluck_filled_row(arr, objKeyLength) {
    return arr.filter((item)=>{
      return Object.keys(item).length >= objKeyLength
    })
  }

	function get_array_item(prop) {
		return (item)=>{
			return item[prop];
		}
	}
  function get_array_item_with_val(prop, value) {
		return (item)=>{
			return item[prop] == value;
		}
	}

	function pluck(arr, prop) {
		return arr.map(get_array_item(prop));
	}

  function fetch_object(arr, prop, value) {
    return arr.filter(get_array_item_with_val(prop, value))
  }


  function add(a,b) {
    return parseInt(a) + parseInt(b)
  }

  function multiply(a,b) {
    return parseInt(a) * parseInt(b)
  }

  function array_total(arr, total){
    total = total || 0;
    total = add(total, arr[0])

    arr = remove_array_element(arr, 0)

    if(arr.length === 0){
      return total
    }
    else{
      return array_total(arr, total)
    }
  }

  function verify_date(date) {
    let result = date.match(/^\d{2}[-]\d{2}[-]\d{4}$/)
    if (result) {
      return result
    }
    else {
      swal("Error", "Invalid date format, format should be: dd-mm-yyyy", "error");
    }
  }

  function verify_mobile_number(num){
    if(num>0){
      let result = num.match(/^\d{10}$/)
      if(result) {
        return result;
      }
      return false;
    }
  }
  function verify_number(field, val) {
    if(val<0){
      error(field + " cannot be Negative")
      return false;
    }
    else {
      return true;
    }
  }

  function to_json(data) {
		return JSON.parse(angular.toJson(data));
	}

	function clone_object(obj) {
		return Object.assign({}, obj)
	}

  function is_obj_empty(obj) {
    if (Object.keys(obj).length === 0) {
      return true;
    }
    return false;
  }

  function success(msg) {
    swal("Success", msg, "success")
  }
  function error(msg) {
    swal("Error", msg, "error")
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
  function _100_rows() {
    let arr = [{}]
    for (var i = 0; i < 100; i++) {
      arr.push({});
      var items = angular.toJson(arr);
      items = JSON.parse(items);
      var id = 0;

      items = items.map(function (item) {
          id = id +1;
          item.id = id;
          // console.log(item);
          return item;
      });
      arr = items;
    }
    return arr
  }

  return {
    pluck:pluck,
    get_array_item:get_array_item,
    remove_array_element:remove_array_element,
    array_total:array_total,
    verify_date:verify_date,
    error:error,
    verify_number:verify_number,
    to_json:to_json,
    clone_object:clone_object,
    multiply:multiply,
    is_obj_empty:is_obj_empty,
    fetch_object:fetch_object,
    pluck_filled_row:pluck_filled_row,
    findIndex:searchIndex,
    get_100_rows:_100_rows
  }
}
