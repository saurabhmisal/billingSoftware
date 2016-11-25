directives.directive('inputText', function(){
	// Runs during compile
	return {
		scope: {
			label: '@label',
			value: '@value',
			required: '@required',
			min: '@min',
			max: '@max',
			type: '@type',
			disabled: '@disabled',
			property: '='
		},
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment

		templateUrl: 'app/views/directive-templates/inputText.html',

		transclude: true
	};
});
