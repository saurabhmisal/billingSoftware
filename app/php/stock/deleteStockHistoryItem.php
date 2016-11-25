<?php
date_default_timezone_set("Asia/Kolkata");
require('conn.inc.php');
require('stock.class.php');

$conn = new DbConnection();
$conn = $conn->getDbConn();

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$stockRowId = $request->stock_row;
$purchaseRowId = $request->purchase_row;

$stock = new Stock($conn);
$stock->delete_stock_history_item($stockRowId, $purchaseRowId);	
// print_r($request);

?>