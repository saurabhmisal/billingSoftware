app.controller('GalleryController', function($scope, $http){

var data = [
	{
		name:"Jamestown",
		population: 2047,
		tempratures: [-43,67,2,9]
	},
	{
		name:"Awsome town",
		population:3568,
		tempratures: [-3,4,9,12]
	},
	{
		name:"Funkey town",
		population:1000000,
		tempratures: [75,75,75,75,75]
	}
];

	function init () {
		alert('hk');
		var 
			cords =[],
			totalTemp = 0,
			avgTemp = 0;

			for (var i = 0; i < data.length; i++) {
				totalTemp = 0;

				for (var j = 0; j < data[i].tempratures.length; j++) {
					totalTemp = totalTemp + data[i].tempratures[j];
				};

				avgTemp = totalTemp / data[i].tempratures.length;

				cords.push([avgTemp, data[i].population]);
			};

		console.log(cords);
	}

	init();

});