<?php
require('conn.inc.php');
require('stock.class.php');

$conn = new DbConnection();
$conn = $conn->getDbConn();


$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$stockRow = $request->id;

$stock = new Stock($conn);
$stock->purchaseHistory($stockRow);

?>