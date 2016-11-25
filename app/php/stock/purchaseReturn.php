<?php
date_default_timezone_set("Asia/Kolkata");
require('../conn.class.php');
require('../error.class.php');
require('stock.class.php');

$conn = new DbConnection();
$conn = $conn->getDbConn();


$_POST = json_decode(file_get_contents('php://input'), true);

// print_r($_POST);
// $customer = new Customer($conn);
// $customer->purchase($cid, $data);
//
$stock = new Stock($conn);
$stock->purchase_return($_POST);

?>
