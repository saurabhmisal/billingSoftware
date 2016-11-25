<?php
date_default_timezone_set("Asia/Kolkata");
require('../conn.class.php');
require('../error.class.php');
require('stock.class.php');

$conn = new DbConnection();
$conn = $conn->getDbConn();


$_POST = json_decode(file_get_contents('php://input'), true);

$arr = date_parse( $_POST['date'] ) ;
$_POST['date'] = date_format(date_create( ($arr['day'] + 1) . "-".$arr['month']."-".$arr['year'] ), "d-m-Y") ;

$stock = new Stock($conn);
$stock->purchased($_POST);
// print_r($_POST);

?>
