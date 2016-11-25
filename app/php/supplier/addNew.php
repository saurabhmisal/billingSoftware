<?php
require('../conn.class.php');
require('../error.class.php');
require('supplier.class.php');

$conn = new DbConnection();
$conn = $conn->getDbConn();

$_POST = json_decode(file_get_contents('php://input'), true);


$supplier = new Supplier($conn);
$supplier->insert($_POST);

?>
