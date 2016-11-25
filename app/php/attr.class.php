<?php
class Attr{
  
  function __construct($c){
    $this->conn = $c;
  }
  function exist($q, $a){
    $this->prepare = $this->conn->prepare($q);
    $this->prepare->execute($a);
    return($this->prepare->rowCount());
  }
  //function count_attr(){}
}
?>