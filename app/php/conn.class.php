<?php

error_reporting(-1);
ini_set('display_errors', 'On');

class DbConnection{
  private $db_conn;

  public function getDbConn(){
      // if ($_SERVER['SERVER_NAME'] != "localhost") {
      //   $m = new MongoClient("mongodb://139.59.183.156");
      // }
      // else {
      //   $m = new MongoClient();
      // }
      $m = new MongoClient();
      $db_conn = $m->crm;
      return($db_conn);
  }
}
?>
