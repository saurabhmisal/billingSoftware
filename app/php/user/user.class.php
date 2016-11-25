<?php

error_reporting(-1);
ini_set('display_errors', 'On');

if(!isset($_SESSION))
{
    session_start();
}

class User extends Error
{

	private $conn;
	private $users;

	function __construct($conn)
	{
		$this->conn = $conn;
		$this->users = $this->conn->users;
	}


	public function login($email, $pass)
	{
      $arr = array('email' => $email, 'password' => $pass);
			if(	$this->users->count(array('email' => $email, 'password' => $pass))){
				$user = $this->users->findOne(array('email' => $email, 'password' => $pass));

				$_SESSION['login'] = true;
				$this->success();
			}
			else{
				$this->error('Email and Password does not match');
			}
	}

	public function logout()
	{
		session_destroy();
	}
}
?>
