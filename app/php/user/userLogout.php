<?php

session_start();

unset($_SESSION['login']);
echo(json_encode(array('logout' => 1 )));

?>