<?php
require('../conn.class.php');
require('../error.class.php');
require('stock.class.php');

$_POST = json_decode(file_get_contents('php://input'), true);

$conn = new DbConnection();
$conn = $conn->getDbConn();

$stock = new Stock($conn);
$stock->delete_purchase($_POST);

?>
