<?php
date_default_timezone_set("Asia/Kolkata");
require('../conn.class.php');
require('../error.class.php');
require('stock.class.php');

$conn = new DbConnection();
$conn = $conn->getDbConn();


$_POST = json_decode(file_get_contents('php://input'), true);
// print_r($_POST);
// $arr = date_parse( $_POST['stockDetails']['date'] ) ;
// $_POST['stockDetails']['date'] = date_format(date_create( ($arr['day'] + 1) . "-".$arr['month']."-".$arr['year'] ), "d-m-Y") ;
//
// $newStock = [];
// $newStock['sId'] = $_POST['stockDetails']['id'];
// $newStock['name'] = $_POST['stockDetails']['name'];
// $newStock['date'] = $_POST['stockDetails']['date'];
//
// $newStock['supplier'] = [];
// $newStock['supplier']['id'] = $_POST['stockDetails']['supplier']['id'];
// $newStock['supplier']['firmName'] = $_POST['stockDetails']['supplier']['firmName'];
//
//
// if (isset($_POST['stockDetails']['description'])) {
//   $newStock['desc'] = $_POST['stockDetails']['description'];
// }
// $newStock['items'] = [];
// // print_r($newStock);
// foreach ($_POST['stockItems'] as $key => $value) {
//   $value['totalQty'] = $value['qty'];
//
//   $value['history'] = [];
//   array_push($value['history'], array("date"=>$newStock['date'], 'qty'=>$value['qty']));
//   unset($value['qty']);
//   array_push($newStock['items'], $value);
// }
//
$stock = new Stock($conn);
$stock->insert($_POST);
// // print_r($newStock);
//
//
?>
