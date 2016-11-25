<?php
require('conn.inc.php');
require('customer.class.php');

$conn = new DbConnection();
$conn = $conn->getDbConn();


$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

function objectToArray($d) {
	if (is_object($d)) {
		$d = get_object_vars($d);
	}
	
	if (is_array($d)) {
		return array_map(__FUNCTION__, $d);
	}
	else {
		// Return array
		return $d;
	}
}


$orderId = objectToArray($request->orderId);


$customer = new Customer($conn);
$customer->fetchOrder($orderId);	

?>