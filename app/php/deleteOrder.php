<?php

	require('conn.inc.php');
	require('customer.class.php');


	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);

	$conn = new DbConnection();
	$conn = $conn->getDbConn();

	$customer = new Customer($conn);
	$customer->deleteOrder($request->orderId);

?>