<?php
require('conn.inc.php');
require('customer.class.php');

$conn = new DbConnection();
$conn = $conn->getDbConn();


$postdata = file_get_contents("php://input");
$request = json_decode($postdata);



$id = $request->cid;


$customer = new Customer($conn);
$customer->fetchCustomerOrders($id);	

?>