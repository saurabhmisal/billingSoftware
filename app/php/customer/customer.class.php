<?php


	class Customer
	{
		private $conn;
		private $attr;
		function __construct($c)
		{
			$this->conn = $c;
		}



		/* CUSTOMER MODULE RELATED FUNCTIONS */
		
			function insert($attr, $id, $name, $shopName, $phone, $email, $city){

				$this->attr = $attr;
				$success = 1;

				if($this->attr->exist("SELECT * FROM customer_details WHERE id = ?", array($id))){
					$error = array('state' => "error", 'field' => "id", 'msg' => "UCN number should be unique.");
					$success = 0;
				}
				elseif ($email != ""){
					if($this->attr->exist("SELECT * FROM customer_details WHERE email = ?", array($email))) {
						$error = array('state' => "error", 'field' => "email", 'msg' => "Customer email Should be unique");
						$success = 0;
					}
				}
				elseif ($this->attr->exist("SELECT * FROM customer_details WHERE phone = ?", array($phone))) {
					$error = array('state' => "error", 'field' => "phone", 'msg' => "This Phone Number is already exist.");
					$success = 0;
				}
				if(!$success)
					echo(json_encode($error));
				else{
					$p = $this->conn->prepare(
						"INSERT INTO customer_details(name, shopName, email, phone, city, id) VALUES (?,?,?,?,?,?)");
					$p->execute(array($name, $shopName, $email, $phone, $city, $id));
					$this->writeJsonData();
				}
			}
			
			function edit($attr, $row, $id, $name, $shopName, $phone, $email, $city){
				$phone = strval($phone);
				$success = 1;
				$error = array('state' => "none", 'field' => "none", 'msg' => "none");
				
				$query = $this->conn->query("SELECT * FROM customer_details");
				$customers = $query->fetchAll(PDO::FETCH_OBJ);

				foreach ($customers as $customer) {
					if ($customer->id == $id && $customer->row != $row) {
						$error = array('state' => "error", 'field' => "id", 'msg' => "Customer id Should be unique");
						$success = 0;
						break;
					}
				}
				if($error['state'] != "error"){
					foreach ($customers as $customer) {
						if ($email != ""){
							if($customer->email == $email && $customer->row != $row) {
								$error = array('state' => "error", 'field' => "email", 'msg' => "Customer email Should be unique");
								$success = 0;
								break;
							}
						}
					}
				}
				if($error['state'] != "error"){
					foreach ($customers as $customer) {
						if ($customer->phone == $phone && $customer->row != $row) {
							$error = array('state' => "error", 'field' => "phone", 'msg' => "This Phone Number is already exist.");
							$success = 0;
							break;
						}
					}
				}



				if ($success) {
					$prepare = $this->conn->prepare("UPDATE customer_details SET 
						name=?, 
						shopName=?,
						email=?,
						phone=?,
						city=?,
						id=? WHERE row=? ");

					$prepare->execute(array($name, $shopName, $email, $phone, $city, $id, $row));
					$this->writeJsonData();	
				}
				else{
					echo(json_encode($error));
				}
			}

			function delete($row){

				$prep = $this->conn->prepare("DELETE FROM customer_details WHERE row = ?");
				$prep->execute(array($row));

				$this->writeJsonData();
			}

			private function writeJsonData()
			{
				$data = [];
				$query = $this->conn->query("SELECT * FROM customer_details");
				$rows = $query->fetchAll(PDO::FETCH_ASSOC);
				// print_r($rows);
				foreach ($rows as $row) {
					$row['date'] = date('d-m-Y', strtotime($row['date']));
					// print_r($row);
					array_push($data, $row);
				}
				file_put_contents("../json/customerDetails.json", json_encode($data));
			}

			public function fetchCustomerOrders($id)
			{
				$p = $this->conn->prepare("SELECT order_id FROM order_details WHERE customer_id =?");
				$p->execute(array($id));

				$orders = $p->fetchAll(PDO::FETCH_ASSOC);
				$orders_detail = [];
				// print_r($orders);

				foreach ($orders as $order) {
					$query = 
					"SELECT T2.stock_id as id, T2.name, T2.price, T1.quantity
					 FROM customer_purchase as T1 INNER JOIN stock_history as T2
					 WHERE T1.stockId = T2.stock_row AND orderId = ?";
					$p = $this->conn->prepare($query);
					$p->execute(array_values($order));

					$detail = $p->fetchAll(PDO::FETCH_ASSOC);
					array_push($orders_detail, $detail);
				}
				// print_r($orders_detail);
				echo json_encode($orders_detail);
			}

			public function fetchCustomer($id)
			{
				$p = $this->conn->prepare("SELECT * FROM customer_details WHERE row=?");
				$p->execute(array($id));

				$customer = $p->fetch(PDO::FETCH_ASSOC);
				echo json_encode($customer);
			}
		
		/* CUSTOMER MODULE END */




		/* ORDER MODULE RELATED FUNCTIONS */
			public function fetchOrder($orderId)
			{
				$q = "SELECT T2.stock_id as id, T2.name, T2.price, T1.quantity
					 FROM customer_purchase as T1 INNER JOIN stock_history as T2
					 WHERE T1.stockId = T2.stock_row AND orderId = ? ";
				$p = $this->conn->prepare($q);
				$p->execute(array($orderId));

				$order = $p->fetchAll(PDO::FETCH_ASSOC);
				//print_r($order);
				echo json_encode($order);
			}

			public function deleteOrder($orderId)
			{
				$this->runQuery("DELETE FROM order_details WHERE order_id = ?", array($orderId));
				$this->runQuery("DELETE FROM customer_purchase WHERE orderId = ?", array($orderId));
				$this->writeOrders();
			}
		/* ORDER MODULE END */





		/* BILL MODULE RELATED FUNCTIONS */
		
			private function makeQuery($query, $arr, $v)
			{
				
				$insertArr = [];
				for ($i=0; $i < sizeof($arr); $i++) { 
					array_push($insertArr, $v);
				}
				
				$query = $query . implode(',', $insertArr);
				return $query;
			}

			public function purchase($customer_id, $purchasedItems)
			{

				$p = $this->conn->prepare("INSERT INTO order_details(customer_id) VALUES(?)");
				$p->execute(array($customer_id));

				$orderId = $this->conn->lastInsertId();



				$query = $this->makeQuery("INSERT INTO customer_purchase(orderId, stockId, price, quantity) VALUES", $purchasedItems, "(?,?,?,?)");
				$valuesArr = [];
				foreach ($purchasedItems as $item) {
					array_unshift($item, $orderId);
					array_push($valuesArr, $item);
				}

				$s = [];
				foreach ($valuesArr as $item) {
					array_push($s, implode(',', $item));
				}
				$values = implode(',', $s);

				$p = $this->conn->prepare($query);
				$p->execute(explode(',', $values));

				$this->writeOrders();
			}

			private function writeOrders()
			{
				$q = 
				"SELECT T1.order_id as orderId, T2.id as customer_id, T2.name, T1.date 
				FROM order_details as T1 INNER JOIN customer_details as T2 
				ON T1.customer_id = T2.row";

				$query = $this->conn->query($q);
				$rows = $query->fetchAll(PDO::FETCH_ASSOC);

				$data = [];
				foreach ($rows as $row) {
					$row['date'] = date('d-m-Y', strtotime($row['date']));
					array_push($data, $row);
				}
				file_put_contents("../json/orderDetails.json", json_encode($data));
			}
		
		/* BILL MODULE END */


		/* GENERAL PURPOSE */
		private function runQuery($q, $arr)
		{
			$prep = $this->conn->prepare($q);
			$prep->execute($arr);
		}
	}

?>