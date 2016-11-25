<?php
require('conn.inc.php');
require('user.class.php');

$conn = new DbConnection();
$conn = $conn->getDbConn();

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);


$user = new User($conn);
$user->changePassword($request->pass, $request->repass);
?>