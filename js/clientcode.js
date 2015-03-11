var API_URL_PREFIX = "http://127.0.0.1:8081/";
var methodseparator="?"

//var API_URL_PREFIX = "http://127.0.0.1:8080/api.php?rquest=";
//var API_URL_PREFIX = "http://127.0.0.1:8081/api.php?rquest=";
//var methodseparator="&"

var paramseparator="&"

function MainController($scope, $http){

	angular.element(document).ready(function(){
		// get the list of specialities
		var taxonomyTags = new Array();
		$http.get(API_URL_PREFIX+"taxonomy")
			.then(function(response){			
			for (var i=0; i<response.data.length; i++)			
				taxonomyTags.push(response.data[i].Classification);

			// the only dependency on the view
			$("#specialty").autocomplete({source: taxonomyTags});
		});
	});

	//visibility of the different divs
	$scope.ProvidersListVisibility=false;
	$scope.ProvidersShortListVisibility=false;
	$scope.MessageAreaVisibility=false;
	$scope.ProvidersSearchVisibility=true;
	
	$scope.MessageText="Place holder for message";
	
	$scope.lastname="";
	$scope.zipcode="";

	$scope.genders = [
		{name:'No gender preference', value:'N'},
		{name:'Female only', value:'F'},
		{name:'Male only', value:'M'},
	];
	$scope.gender = $scope.genders[0]; 

	$scope.distances = [
		{name:'Within 5 miles', value:'5'},
		{name:'Within 10 miles', value:'10'},
		{name:'Within 25 miles', value:'25'},
	];
	$scope.distance = $scope.distances[0]; 

	$scope.showMessage = function(text){
		$scope.MessageText=text;
		$scope.MessageAreaVisibility=true;
	};

	$scope.AddSeparator = function(firstparam){
		if(firstparam){
			firstparam=false;
			return methodseparator;
		}
		return paramseparator;
	};
	
	$scope.shortProviderList = function(){
		
		var selectedNPIs = new Array();
		for (var i=0; i<$scope.providersList.length; i++)			
			if ($scope.providersList[i].selected==true)
				selectedNPIs.push($scope.providersList[i].NPI);
 
		var len= selectedNPIs.length;
		if (len==0) {
			showMessage('No providers were selected.');
			return;
		}

		if (len >3) {
			showMessage('Too many providers were selected, maximum is three.');
			return;
		}

		var requeststring = API_URL_PREFIX+"shortlist";
		var firstparam = true;

		for(var i=0; i < len; i++) {
			if(firstparam){
				requeststring+=methodseparator;
				firstparam=false;
			}else{
				requeststring+=paramseparator;
			}
			requeststring+="NPI";
			requeststring+=i+1;
			requeststring+="=";
			requeststring+=selectedNPIs[i];
		}

		$http.get(requeststring)
			.then(function(response){

			if (response.data==null) {
				showMessage('No matching providers were found.');
				return;
			}
				
			$scope.shortProvidersList=response.data.Providers;
			$scope.Transaction=response.data.Transaction;

			//visibility of the different divs
			$scope.ProvidersListVisibility=false;
			$scope.MessageAreaVisibility=false;
			$scope.ProvidersSearchVisibility=false;
			$scope.ProvidersShortListVisibility=true;
		});
	};
	
	$scope.newSearch = function(){
		//visibility of the different divs
		$scope.ProvidersListVisibility=false;
		$scope.MessageAreaVisibility=false;
		$scope.ProvidersShortListVisibility=false;
		$scope.ProvidersSearchVisibility=true;
	};
	
	$scope.searchProviders = function(){
		var requeststring = API_URL_PREFIX + "providers";
		var firstparam = true;

		if ($scope.zipcode){
			if(firstparam){
				requeststring+=methodseparator;
				firstparam=false;
			}else{
				requeststring+=paramseparator;
			}
			requeststring+="zipcode=";
			requeststring+=$scope.zipcode;
		}
	
		if ($scope.gender.value != 'N'){
			if(firstparam){
				requeststring+=methodseparator;
				firstparam=false;
			}else{
				requeststring+=paramseparator;
			}
			requeststring+="gender=";
			requeststring+=$scope.gender.value;
		}

		if ($scope.lastname){
			if(firstparam){
				requeststring+=methodseparator;
				firstparam=false;
			}else{
				requeststring+=paramseparator;
			}
			requeststring+="lastname1=";
			requeststring+=$scope.lastname;
		}

		var buffer= $('#specialty').val();
		if (buffer){
			if(firstparam){
				requeststring+=methodseparator;
				firstparam=false;
			}else{
				requeststring+=paramseparator;
			}
			requeststring+="specialty=";
			requeststring+=buffer;
		}

		if ($scope.distance.value){
			if(firstparam){
				requeststring+=methodseparator;
				firstparam=false;
			}else{
				requeststring+=paramseparator;
			}
			requeststring+="distance=";
			requeststring+=$scope.distance.value;
		}

		//call the api to get the list of providers
		$http.get(requeststring)
			.then(function(response){

			if (response.data==null) {
				showMessage('No matching providers were found.');
				return;
			}

			$scope.providersList=response.data;

			for (var i=0; i<$scope.providersList.length; i++)			
				$scope.providersList[i].selected=false;

			//visibility of the different divs
			$scope.MessageAreaVisibility=false;
			$scope.ProvidersShortListVisibility=false;
			$scope.ProvidersSearchVisibility=false;
			$scope.ProvidersListVisibility=true;
		});
	};
}

