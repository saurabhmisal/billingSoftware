<?php

class Error 
{
	protected $result = [];
	
	protected function error($error)
	{
		$this->result['valid'] = false;
		$this->result['error'] = $error;

		echo json_encode($this->result);
	}
	protected function success()
	{
		$this->result['valid'] = true;
		$this->result['error'] = "";

		echo json_encode($this->result);
	}
}

?>