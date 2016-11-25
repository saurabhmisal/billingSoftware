<?php

class Stock extends Error
{
	private $conn;
	private $attr;
	private $stocks;
	private $purchase;
	private $purchaseReturn;
	private $sale;
	private $saleReturn;

	function __construct($c)
	{
		$this->conn = $c;
		$this->stocks = $this->conn->stocks;
		$this->purchase = $this->conn->purchase;
		$this->purchaseReturn = $this->conn->purchaseReturn;
		$this->sale = $this->conn->sale;
		$this->saleReturn = $this->conn->saleReturn;
	}


	/* BILL MODULE RELATED FUNCTIONS */
		public function save_bill($post)
		{
			$this->sale->insert($post);
			foreach ($post['purchasedProducts'] as $item) {
				$this->decrease_stock_quantity($item['productId'], $item['pQuantity']);
			}
			$this->writeSaleData();
			$this->writeJsonData();
		}
		public function sale_return($post)
		{
			$vchNo = $post['vchNo'];
			if($this->sale->count(array("vchNo"=>(int)$vchNo))){
				$this->saleReturn->insert($post);
				foreach ($post['returnProducts'] as $item) {
					$this->increase_stock_quantity($item['productId'], $item['rQuantity']);
				}
				$this->writeSaleReturnData();
				$this->writeJsonData();
			}
			else{
				$this->error("Refrence bill not found");
			}
		}
		public function purchase_return($post)
		{
			// print_r($post);
			$invoice = $post['invoice'];
			if($this->purchase->count(array("invoice"=>$invoice))){
				foreach ($post['returnProducts'] as $item) {
					$this->decrease_stock_quantity($item['productId'], $item['quantity']);
					$item['invoice'] = $invoice;
					$item['supplierId'] = $post['supplier']['id'];
					$item['date'] = $post['date'];
					$this->purchaseReturn->insert($item);
				}
				$this->writePurchaseReturnData();
				$this->writeJsonData();
				$this->success();
			}
			else{
				$this->error("Refrence Invoce not found");
			}
		}
	/* BILL MODULE END */


	/* STOCK MODULE RELATED FUNCTIONS */
		public function update_stock($post)
		{
			$stock 	= $post['stock'];
			$sId 		= $stock['productId'];
			$doc 		= $this->select_stock($sId);

			if ($doc) {
				unset($stock['_id']);
				$this->update_stock_doc($sId, $stock);
				$this->success();
				$this->writeJsonData();
			}
		}

		function edit($post)
		{
			$arr = array("sId"=>$post['sId']);
			if($this->stocks->count($arr)){
				$itemFound = false;
				$oldValue = "";
				$doc = $this->stocks->findOne($arr);


				// if edit element is stock name or description
				if( $post['prop'] == "name" || $post['prop'] == "desc" ){

					if (isset($doc[$post['prop']])) {// check if property already exist in document
						$oldValue = $doc[$post['prop']]; // saveing old value
					}

					if (isset($post['value'])) { // check if value set
						$doc[$post['prop']] = $post['value']; // adding new value
						$itemFound = true; // setting flag true
					}
				}

				// if edit element is one of the stock variety
				if( $post['prop'] != "name" && $post['prop'] != "desc" ){
					$items = $doc['items'];

					foreach ($items as $key => $value) { // finding element
						if ($post['itemId'] == $value['id']) { // if element found

							if (isset($doc['items'][$key][$post['prop']])) { // check if property already exist in document
								$oldValue = $doc['items'][$key][$post['prop']]; // saveing old value
							}

							if (isset($post['value'])) { // check if value set
								$doc['items'][$key][$post['prop']] = $post['value']; // adding new value
								$itemFound = true; // setting flag true
							}
							break;
						}
					}
				}

				if ($itemFound) {
					unset($doc['_id']);
					$this->stocks->update($arr, $doc);
					$this->success();
					$this->writeJsonData();
				}
				else {
					echo json_encode(array("valid"=>false, "data"=>$oldValue));
				}
			}
			else {
				$this->error("Stock not found");
			}
		}

		function insert($post)
		{
			for ($i=0; $i < count($post) ; $i++) {
				$post[$i]['quantity'] = 0;
				$this->stocks->insert($post[$i]);
			}

				$this->success();
				$this->writeJsonData();

		}

		public function purchased($post)
		{
			$arr = $post['products'];

			foreach ($arr as $p) {
				$pId = $p['productId'];

				$this->increase_stock_quantity($p['productId'], $p['quantity']);
				// print_r($doc);
				$p['date'] = $post['date'];
				$this->purchase->insert($p);
				// print_r($p);
			}
			$this->writeJsonData();
			$this->writePurchaseData();

			$this->success();
		}

		public function delete_purchase($post)
		{
			$purchase = $post['purchase'];
			$obj = $post['purchase']['_id'];
			$arr = array('_id'=> new MongoId($obj['$id']));

			if($this->purchase->count($arr)){

				$this->decrease_stock_quantity($purchase['productId'], $purchase['quantity']);
				$this->purchase->remove($arr);

				$this->writeJsonData();
				$this->writePurchaseData();

				$this->success();
			}
		}

		function delete($post)
		{
			// print_r($post);
			$id = $post['id'];
			if ($this->stock_exist($id)) {
				$this->stocks->remove(array('productId'=>$id));
				$this->writeJsonData();
				$this->success();
			}
		}

		private function writeJsonData()
		{

			$documents = [];
			$cursor = $this->stocks->find();
			foreach ($cursor as $doc) {
				array_push($documents, $doc);
			}
			file_put_contents("../../json/stockDetails.json", json_encode($documents));
		}
		private function writePurchaseData()
		{

			$documents = [];
			$cursor = $this->purchase->find();
			foreach ($cursor as $doc) {
				array_push($documents, $doc);
			}
			file_put_contents("../../json/stock/purchase.json", json_encode($documents));
		}
		private function writePurchaseReturnData()
		{

			$documents = [];
			$cursor = $this->purchaseReturn->find();
			foreach ($cursor as $doc) {
				array_push($documents, $doc);
			}
			file_put_contents("../../json/stock/purchaseReturn.json", json_encode($documents));
		}
		private function writeSaleData()
		{

			$documents = [];
			$cursor = $this->sale->find();
			foreach ($cursor as $doc) {
				array_push($documents, $doc);
			}
			file_put_contents("../../json/stock/sale.json", json_encode($documents));
		}
		private function writeSaleReturnData()
		{

			$documents = [];
			$cursor = $this->saleReturn->find();
			foreach ($cursor as $doc) {
				array_push($documents, $doc);
			}
			file_put_contents("../../json/stock/saleReturn.json", json_encode($documents));
		}

		private function totalPurchase($stock_id)
		{
			$p = $this->conn->prepare("SELECT purchasedQuantity FROM purchased_stock WHERE stockId = ?");
			$p->execute(array($stock_id));
			$qs= $p->fetchAll(PDO::FETCH_OBJ);

			$totalPurchase = 0;
			foreach ($qs as $q) {
				$totalPurchase = $totalPurchase + intval($q->purchasedQuantity);
			}

			return $totalPurchase;
		}

		private function totalSale($stock_id)
		{
			$p = $this->conn->prepare(" SELECT quantity FROM customer_purchase WHERE stockId = ?  ");
			$p->execute(array($stock_id));
			$qs = $p->fetchAll(PDO::FETCH_OBJ);

			$totalSale = 0;
			foreach($qs as $q){
				$totalSale = $totalSale + $q->quantity;
			}

			return $totalSale;
		}

		private function stock_exist($id)
		{
			if ($this->stocks->count(array('productId'=>$id))) {
				return true;
			}
			else {
				$this->error("Stock not found");
			}
		}

		private function increase_stock_quantity($pId, $val)
		{
			$doc = $this->select_stock($pId);
			$doc['quantity'] = (int)$doc['quantity'] + (int)$val;
			unset($doc['_id']);
			$this->update_stock_doc($pId, $doc);
		}
		private function decrease_stock_quantity($pId, $val)
		{
			$doc = $this->select_stock($pId);
			$doc['quantity'] = (int)$doc['quantity'] - (int)$val;
			unset($doc['_id']);
			$this->update_stock_doc($pId, $doc);
		}
		private function select_stock($sId)
		{
			$arr = array('productId' => $sId);
			if ($this->stocks->count($arr)) {
				return $this->stocks->findOne($arr);
			}
			else {
				$this->error("Stock not found");
				return null;
			}
		}
		private function update_stock_doc($sId, $doc)
		{
			$this->stocks->update(
				array("productId"=>$sId),
				array('$set' => $doc)
			);
		}
	/* STOCK MODULE END */
}

?>
