<?php
require('../conn.class.php');
require('../error.class.php');
require('user.class.php');

$conn = new DbConnection();
$conn = $conn->getDbConn();

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);


$user = new User($conn);
$user->login($request->username, $request->password);
// $user->login();

?>
