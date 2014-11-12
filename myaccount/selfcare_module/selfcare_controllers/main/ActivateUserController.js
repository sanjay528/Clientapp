(function(selfcare_module) {
  selfcare.controllers = _.extend(selfcare_module, {
	  ActivateUserController: function(scope,RequestSender,rootScope,routeParams,http,
			  							webStorage,httpService,sessionManager,location,API_VERSION) {
		 
		  //clearing selfcare_sessionData 
		  webStorage.remove('selfcare_sessionData');
		  rootScope.isSignInProcess = false;
		  
		//getting the mailId value form routeParams
		  scope.existedEmail = routeParams.mailId;

		//default variables for this controller
		 // scope.isActive=false;
		  scope.isAlreadyActive=false;
		  scope.isRegPage = false;
		  scope.cities = [];
		  scope.clientData = {};
		  var itemDetails = {};
		  
		//declaration of formData
		  scope.formData = {};
		  
		//getting the key value form routeParams
		  var actualKey = routeParams.registrationKey;
		  var afterSliceKey = actualKey.slice(0, 27);
		  
		  //adding jsondata for selfcare activation updation request
		  scope.registrationKey = {'verificationKey' : afterSliceKey,
		  	  						'uniqueReference' : scope.existedEmail};
		  
		  //sending obs authentication request through like username='billing' and passoword='password'  
		  httpService.post("/obsplatform/api/v1/authentication?username="+selfcare.models.obs_username+"&password="+selfcare.models.obs_password)
		  .success(function(data){
		  	 httpService.setAuthorization(data.base64EncodedAuthenticationKey);
		  	 	//sending selfcare activation updation request
		  		RequestSender.registrationResource.update(scope.registrationKey,function(successData) {
		  			scope.isRegPage=true;
		  			rootScope.currentSession= {user :'selfcare'};
	  				  if(scope.isRegPage == true){
	  					  
	  					  //getting list of city data
	  					  RequestSender.addressTemplateResource.get(function(data) {
	  						  scope.cities=data.cityData;
	  					  });
	  					  
	  					//getting data from c_configuration for isRegister_plan and isisDeviceEnabled
	  					  RequestSender.configurationResource.get(function(data){
	  						  for(var i in data.globalConfiguration){
	  							 if(data.globalConfiguration[i].name=="Register_plan"){
	  								  scope.isRegisteredPlan = data.globalConfiguration[i].enabled;
	  						      }
	  							  if(data.globalConfiguration[i].name=="Registration_requires_device"){
	  								  scope.isDeviceEnabled = data.globalConfiguration[i].enabled;
	  							  }
	  							  if(data.globalConfiguration[i].name=="CPE_TYPE"){
	  								  if(data.globalConfiguration[i].value == 'SALE')
	  									  scope.isCPE_TYPESale = true;
	  								  else if(data.globalConfiguration[i].value == 'OWN')
	  									  scope.isCPE_TYPEOwn = true;
	  								  else{
	  									  scope.isCPE_TYPEOwn = false;
	  									  scope.isCPE_TYPESale = false;
	  								  }
	  							  }
	  						  }
	  					  });
	
	  				  }
		        },function(errorData){
		      	  scope.isAlreadyActive=true;
		      	  rootScope.currentSession= {user :'sefcare'};
		        });
		  })
		  .error(function(errordata){
			  alert('authentication failure');
		  });
		  
		  
		//national Id validation
		  /*scope.$watch(scope.formData.nationalId,
	              function() {
			  			if(scope.formData.nationalId){
			  				if(scope.formData.nationalId.length == 10){
			  					scope.submitFunAllow = true;
			  				}
			  				else{
			  					scope.submitFunAllow = false;
			  				}
			  			}
		  			}
	      );*/
		  
			scope.nationalIdValidationFun =function(id){
			if(id){
				var nationalId = id;
				var val = false;
				  if(id[0] == 5 || id[0] == 6|| id[0] == 7){
					  val = true;
					  var fist = id[0];
					  var last	= fist-4;
					  console.log(last);
					   nationalId = id.replace(id[0], last);
					  console.log(nationalId[0]);
				  }
				 var patternCheck = nationalId.match(/(^(((0[1-9]|[12][0-8]|19)(0[1-9]|1[012]))|((29|30|31)(0[13578]|1[02]))|((29|30)(0[4,6,9]|11)))\d\d[-]?\d\d\d\d$)|(^2902(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)[-]?\d\d\d\d$)/);
				 if(patternCheck){
					 var sum = 0;
					 if(val){
						 if(nationalId[6]=='-'){
							 sum = 3*(id[0])+2*(nationalId[1])+7*(nationalId[2])+6*(nationalId[3])+5*(nationalId[4])+4*(nationalId[5])+3*(nationalId[7])+2*(nationalId[8])
						 }else{
						   sum = 3*(id[0])+2*(nationalId[1])+7*(nationalId[2])+6*(nationalId[3])+5*(nationalId[4])+4*(nationalId[5])+3*(nationalId[6])+2*(nationalId[7])
						 }
					 }else{
						 if(nationalId[6]=='-'){
							 sum = 3*(nationalId[0])+2*(nationalId[1])+7*(nationalId[2])+6*(nationalId[3])+5*(nationalId[4])+4*(nationalId[5])+3*(nationalId[7])+2*(nationalId[8])
						 }
						 else{
						    sum = 3*(nationalId[0])+2*(nationalId[1])+7*(nationalId[2])+6*(nationalId[3])+5*(nationalId[4])+4*(nationalId[5])+3*(nationalId[6])+2*(nationalId[7])
						 }
					 }
					 var checksum = 11 - ((sum) % 11);
					 console.log(checksum);
					 if(nationalId[6]=='-'){
						 if(checksum == nationalId[9]){
							 console.log(checksum);
								 if(nationalId[10] == 0 || nationalId[10] == 9){
									 console.log(nationalId[10]);
									 scope.regSuccessFormNationalIdErrorPattern = false;
								 }
								 else{
									 scope.regSuccessFormNationalIdErrorPattern = true;
								 }
						 }else{
							 scope.regSuccessFormNationalIdErrorPattern = true;
						 }
					 }else{
						 if(checksum == nationalId[8]){
							 console.log(checksum);
								 if(nationalId[9] == 0 || nationalId[9] == 9){
									 console.log(nationalId[9]);
									 scope.regSuccessFormNationalIdErrorPattern = false;
								 }
								 else{
									 scope.regSuccessFormNationalIdErrorPattern = true;
								 }
						 }else{
							 scope.regSuccessFormNationalIdErrorPattern = true;
						 }
					 }
				 }
				 else{
					 console.log(patternCheck);
					 scope.regSuccessFormNationalIdErrorPattern = true;
				 }
				}
			 };
		  
		 //function called when entering the device name 
		  
		  scope.getDataForMacId = function(query){
			  if(query){
				  var str = "";
				  var containsColon = query.match(":");
				  if(containsColon){
					  str = query;
				  }else{
					  str += query[0]+query[1]+":";
					  for(var val=3;val<=query.length-1;val++){
						  if(val == query.length-1){
							  break;
						  }
						  if(val%2 == 0)
							  str += query[val]+":";
						  else
							  str +=query[val];
					  }
				  }
				  console.log(str);
				  RequestSender.gettingSerialNumbers.query({query:query},function(data){
					  itemDetails = {};
					  itemDetails = data;
					  if(itemDetails.length == 0){
						  scope.isInvalidMacId = true;
					  }
					  else if(itemDetails.length >=1){
						  scope.isInvalidMacId = false;
				          scope.isDisabledSerialNumber = true;
		            		 if(query.toLowerCase() == itemDetails[0].serialNumber.toLowerCase()){
		            			 scope.provisioningSerialNumber =  itemDetails[0].provisioningSerialNumber;
		            		 }else{
		            			 scope.isInvalidMacId = true;
		            			 delete scope.provisioningSerialNumber;
		            		 }
					  }
				  });
			  }else{
				  scope.isDisabledSerialNumber = false;
				  scope.isInvalidMacId = false;
				  delete scope.provisioningSerialNumber;
			  }
		  };
		  

		  scope.getDataForSerialNumber = function(query){
			  if(query){
				  var str = "";
				  var containsColon = query.match(":");
				  if(containsColon){
					  str = query;
				  }else{
					  str += query[0]+query[1]+":";
					  for(var val=3;val<=query.length-1;val++){
						  if(val == query.length-1){
							  break;
						  }
						  if(val%2 == 0)
							  str += query[val]+":";
						  else
							  str +=query[val];
					  }
				  }
				  console.log(str);
				  RequestSender.gettingSerialNumbers.query({query:query},function(data){
					  itemDetails = {};
					  itemDetails = data;
					  if(itemDetails.length == 0){
						  scope.isInvalidSerialNumber = true;
					  }
					  else if(itemDetails.length >=1){
						  scope.isInvalidSerialNumber = false;
						  scope.isDisabledMacId = true;
		            		 if(query.toLowerCase() == itemDetails[0].provisioningSerialNumber.toLowerCase()){
		            			 	scope.formData.deviceNo =  itemDetails[0].serialNumber;
		            		 }else{
		            			 scope.isInvalidSerialNumber = true;
		            			 delete scope.formData.deviceNo;
		            		 }
					  }
				  });
			  }else{
				  scope.isDisabledMacId = false;
				  scope.isInvalidSerialNumber = false;
				  delete scope.formData.deviceNo;
			  }
		  };
			  	        	/*return http.get(rootScope.hostUrl+ API_VERSION+'/itemdetails/searchserialnum', {
			  	        	      params: {
			  	        	    	  query: query
			  	        	      }
			  	        	    }).then(function(res){
			  	        	    	itemDetails = [];
			  	        	      for(var i in res.data){
			  	        	    	  itemDetails.push(res.data[i]);
			  	        	    	  if(i == 7)
			  	        	    		  break;
			  	        	      }
			  	        	      return itemDetails;
			  	        	    });*/
			              
		
		  /*//setting the value of serial Number based on mac id 
		 scope.$watch(function () {
             return scope.formData.deviceNo;
         }, function () {
        	 if(scope.isDisabledMacId != true){
	             if(scope.formData.deviceNo){
	            	 scope.isDisabledSerialNumber = true;
	            	 for(var i in itemDetails){
	            		 if(scope.formData.deviceNo == itemDetails[i].serialNumber){
	            			 scope.provisioningSerialNumber =  itemDetails[i].provisioningSerialNumber;
	            			 break;
	            		 }else{
	            			 delete scope.provisioningSerialNumber;
	            		 }
	            	 }
	             }else{
	            	 scope.isDisabledSerialNumber = false;
	            	 delete scope.provisioningSerialNumber;
	             }
        	 }
         });
		 
		//setting the value of mac id based on serial Number 
		 scope.$watch(function () {
             return scope.provisioningSerialNumber;
         }, function () {
        	 if(scope.isDisabledSerialNumber != true){
	             if(scope.provisioningSerialNumber){
	            	 scope.isDisabledMacId = true;
	            	 for(var i in itemDetails){
	            		 if(scope.provisioningSerialNumber == itemDetails[i].provisioningSerialNumber){
	            			 	scope.formData.deviceNo =  itemDetails[i].serialNumber;
	            			 	break;
	            		 }else{
	            			 delete scope.formData.deviceNo;
	            		 }
	            	 }
	             }else{
	            	 scope.isDisabledMacId = false;
	            	 delete scope.formData.deviceNo;
	             }
        	 }
         });*/
		  
		  //function called when  clicking on Sinin link
		  scope.goToSignInPageFun = function(){
			  	rootScope.currentSession = sessionManager.clear();
			  	rootScope.isActiveScreenPage= false;
			  	  location.path('/').replace;
		   };
		   
		   //getting state and country while changing the city
			  scope.getStateAndCountry=function(city){
				  scope.formData.zipcode = city;
				//sending request for getting state and country while changing the city
				  RequestSender.addressTemplateResource.get({city :city}, function(data) {
					  scope.formData.state = data.state;
					  scope.formData.country = data.country;
				  },function(errorData) {
					  delete scope.formData.state ;
					  delete scope.formData.country;
				  });
			  };
		  
		  //function called when  clicking on Register link
		 /* scope.registrationLinkPageFun =function(){
			  scope.isActive=false;
			  scope.isAlreadyActive=false;
			  scope.isRegPage = true;
			  
			  if(scope.isRegPage == true){
				  
				  //getting list of city data
				  RequestSender.addressTemplateResource.get(function(data) {
					  scope.cities=data.cityData;
				  });
				  
				  //getting state and country while changing the city
				  scope.getStateAndCountry=function(city){
					  scope.formData.zipcode = city;
					//sending request for getting state and country while changing the city
					  RequestSender.addressTemplateResource.get({city :city}, function(data) {
						  scope.formData.state = data.state;
						  scope.formData.country = data.country;
					  },function(errorData) {
						  delete scope.formData.state ;
						  delete scope.formData.country;
					  });
				  };
				  
				//getting data from c_configuration for isRegister_plan and isisDeviceEnabled
				  RequestSender.configurationResource.get(function(data){
					  for(var i in data.globalConfiguration){
						 if(data.globalConfiguration[i].name=="Register_plan"){
							  scope.isRegisteredPlan = data.globalConfiguration[i].enabled;
					      }
						  if(data.globalConfiguration[i].name=="Registration_requires_device"){
							  scope.isDeviceEnabled = data.globalConfiguration[i].enabled;
						  }
					  }
				  });

			  }
			};*/
			
			//function called when clicking on Register button in Registration Page
			scope.registerBtnFun =function(){
				
				 //deviceNo added to form data when isDeviceEnabled true
					 if(scope.formData.deviceNo){
						 scope.clientData.device = scope.formData.deviceNo;
					 }
					 if(scope.formData.homePhoneNumber){
						 scope.clientData.homePhoneNumber = scope.formData.homePhoneNumber;
					 }
					 scope.clientData.firstname = "Mr ";
					 scope.clientData.address = scope.formData.address;
					 scope.clientData.nationalId = scope.formData.nationalId;
					 scope.clientData.zipCode = scope.formData.zipcode;
					 scope.clientData.fullname = scope.formData.fullName;
					 scope.clientData.city = scope.formData.city;
					 scope.clientData.phone = parseInt(scope.formData.mobileNo); 
					 scope.clientData.email = scope.existedEmail; 
					 
					 RequestSender.authenticationClientResource.save(scope.clientData,function(data){
		  				 rootScope.currentSession = sessionManager.clear();
		  				rootScope.isActiveScreenPage= false;
		  				 location.path('/').replace();
		  				 rootScope.activetedClientPopup();
		  			 });
					
			};
    }
  });
  selfcare.ng.application.controller('ActivateUserController', 
 ['$scope','RequestSender','$rootScope','$routeParams','$http','webStorage','HttpService',
  'SessionManager','$location','API_VERSION',selfcare.controllers.ActivateUserController]).run(function($log) {
      $log.info("ActivateUserController initialized");
  });
}(selfcare.controllers || {}));


//client activation code through payment gateway
/*	scope.isActive=false;
	scope.isAlreadyActive=false;
	scope.isRegPage = false;
	scope.isOrderPage = false;
	scope.isAmountZero = false;
	scope.isPaymentPage = false;
	scope.isRedirectToDalpay = false;
	scope.cities = [];
	scope.plansData = [];
scope.clientData = {};
scope.contractDetails = [];
//scope.isRegisteredPlanDetails = {};
webStorage.remove('selfcare_sessionData');
rootScope.isSignInProcess = false;
scope.existedEmail = routeParams.mailId;
	
//declaration of formData
  scope.formData = {};
  
//getting dalpay Url
scope.dalpayURL = selfcare.models.dalpayURL;
	
//getting the key value form routeParams
var email = routeParams.mailId;
webStorage.add("emailId",email);
var actualKey = routeParams.registrationKey;
var sliceKey = actualKey.slice(0, 27);

scope.registrationKey = {'verificationKey' : sliceKey,
	  						'uniqueReference' : email};

scope.goToSignInPageFun = function(){
	rootScope.currentSession = sessionManager.clear();
	  location.path('/').replace;
};

httpService.post("/obsplatform/api/v1/authentication?username="+selfcare.models.obs_username+"&password="+selfcare.models.obs_password)
.success(function(data){
	 httpService.setAuthorization(data.base64EncodedAuthenticationKey);
		RequestSender.registrationResource.update(scope.registrationKey,function(successData) {
			scope.isActive=true;
			rootScope.currentSession= {user :'selfcare'};
      },function(errorData){
    	  scope.isAlreadyActive=true;
    	  rootScope.currentSession= {user :'sefcare'};
      });
})
.error(function(errordata){
console.log('authentication failure');
});

scope.registrationLinkPageFun =function(){
  scope.isActive=false;
  scope.isAlreadyActive=false;
  scope.isRegPage = true;
  
  if(scope.isRegPage == true){
	  
	  //getting list of city data
	  RequestSender.addressTemplateResource.get(function(data) {
		  scope.cities=data.cityData;
	  });
	  
	  //getting state and country
	  scope.getStateAndCountry=function(city){
		  scope.formData.zipcode = city;
		  console.log(scope.formData.zipcode);
		  RequestSender.addressTemplateResource.get({city :city}, function(data) {
			  scope.formData.state = data.state;
			  scope.formData.country = data.country;
		  },function(errorData) {
			  delete scope.formData.state ;
			  delete scope.formData.country;
		  });
	  };

	  //getting data from c_configuration
	  RequestSender.configurationResource.get(function(data){
		  for(var i in data.globalConfiguration){
			 //if(data.globalConfiguration[i].name=="Register_plan"){
				//  scope.isRegisteredPlan = data.globalConfiguration[i].enabled;
				//  var jsonObj = JSON.parse(data.globalConfiguration[i].value);
				//  scope.isRegisteredPlanDetails = jsonObj;
		      //}
			  if(data.globalConfiguration[i].name=="Registration_requires_device"){
				  scope.isDeviceEnabled = data.globalConfiguration[i].enabled;
				  break;
			  }
		  }
	  });
  }
};

scope.nextBtnFun = function(){
  scope.isRegPage = false;
  scope.isOrderPage = true;
  scope.isPaymentPage = false;
  scope.isAmountZero = false;
  if(scope.isOrderPage == true){
	  
	  RequestSender.orderTemplateResource.query({region : scope.formData.state},function(data){
		  for(var j in data){
			  if(data[j].isPrepaid == 'Y'){
				  scope.plansData.push(data[j]); 
			  }
		  }
	  });
  }
};

scope.previousBtnFun = function(){
  
  scope.isActive=false;
  scope.isAlreadyActive=false;
  scope.isRegPage = true;
  scope.isOrderPage = false;
  scope.isPaymentPage = false;
  scope.isAmountZero = false;
  scope.plansData = [];
  scope.registrationLinkPageFun();
};
var hostName = selfcare.models.selfcareAppUrl;

scope.paymentGatewayFun  = function(paymentGatewayName){
  console.log(paymentGatewayName);
  if(paymentGatewayName == 'dalpay'){
	  scope.paymentDalpayURL = scope.dalpayURL+"&cust_name="+scope.formData.fullName+"&cust_phone="+scope.formData.mobileNo+"&cust_email="+email+"&cust_state="+scope.formData.state+""+
			"&cust_address1="+scope.formData.address+"&cust_zip="+scope.formData.zipcode+"&cust_city=" +
			scope.formData.state+"&item1_desc="+scope.formData.planName+"&item1_price="+scope.formData.planAmount+"&user1=0&user2="+hostName+"&user3=activeclientpreviewscreen"; 
  }else if(paymentGatewayName == 'korta'){
	  scope.paymentDalpayURL = "#/kortaIntegration/0/0";
  };
};

scope.selectedPLandAm = function(contractId,planId,chargeCode,price,planCode,duration){
	 
  scope.isOrderPage = false;
  scope.formData.planAmount = price;
  scope.duration = duration;
  scope.formData.contractperiod = contractId;
  scope.formData.planCode = planId;
  scope.formData.paytermCode = chargeCode;
  scope.formData.planName = planCode;
  if(price==0){
	  scope.isAmountZero = true;
	  scope.isPaymentPage = false;
  }
  else{
	  scope.isAmountZero = false;
	  scope.isPaymentPage = true;
  }
  scope.paymentGatewayFun('korta');
};

scope.makePaymentFun =function(){
  scope.formData.emailId = email;
  webStorage.add('form','orderbook');
  webStorage.add("planFormData",scope.formData);
  scope.isRedirectToDalpay = true;
};

scope.cancelPaymentFun =function(){
  scope.plansData = [];
  scope.nextBtnFun();
};

scope.finishBtnFun =function(){
  scope.formData.emailId = email;
  webStorage.add("planFormData",scope.formData);
  location.path("/activeclientpreviewscreen");
};*/
