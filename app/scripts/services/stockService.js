app.service('stockService', function(){
	this.insertStock = function(id, name, price, totalUnit){
		stocks.push({
			id:id,
			name: name,
			price: price,
			totalUnit: totalUnit
		});
	};
});