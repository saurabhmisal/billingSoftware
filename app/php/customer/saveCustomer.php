<?php
require('conn.inc.php');
require('attr.class.php');
require('customer.class.php');

$conn = new DbConnection();
$conn = $conn->getDbConn();

$attr = new Attr($conn);


$postdata = file_get_contents("php://input");
$request = json_decode($postdata);



$id = $request->id;
$name = $request->name;
$shopName = $request->shopName;
$phone = $request->phone;
$email = $request->email;
$city = $request->city;


$customer = new Customer($conn);
$customer->insert($attr, $id, $name, $shopName, $phone, $email, $city);	

?>