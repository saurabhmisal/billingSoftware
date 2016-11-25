<?php

class Supplier extends Error
{
	private $conn;
	private $suppliers;

	function __construct($c)
	{
		$this->conn = $c;
		$this->suppliers = $this->conn->suppliers;
	}

  public function insert($post)
  {
    // print_r($post);
    $this->suppliers->insert($post);
		$this->writeJsonData();
		$this->success();
  }

	public function update($post)
	{
		$id = $post['id'];
		if ($this->supplier_exist($id)) {
			unset($post['_id']);
			$this->suppliers->update(
				array('id'=>$id),
				array('$set' => $post)
			);
			$this->writeJsonData();
			$this->success();
		}
	}
	public function remove($post)
	{
		$id = $post['supplierId'];
		if($this->supplier_exist($id)){
			$result = $this->suppliers->remove(array("id"=>$id));
			if ($result['ok']) {
				$this->writeJsonData();
				$this->success();
			} else {
				$this->error($result['errmsg']);
			}

		}
	}

  private function supplier_exist($id)
  {
		if($this->suppliers->count(array("id"=>$id))){
			return true;
		}
		$this->error("Supplier not exist");
  }

	private function writeJsonData()
	{

		$documents = [];
		$cursor = $this->suppliers->find();
		foreach ($cursor as $doc) {
			array_push($documents, $doc);
		}
		file_put_contents("../../json/supplier/suppliers.json", json_encode($documents));
	}
}

?>
