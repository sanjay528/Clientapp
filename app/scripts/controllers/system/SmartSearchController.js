(function(module) {
  mifosX.controllers = _.extend(module, {
	  SmartSearchController: function(scope, resourceFactory , paginatorService,dateFilter,location,$rootScope) {
        scope.filters = [{option: "All", value: ""},{option: "Manual Entries", value: true},{option: "System Entries", value: false}];
        scope.isCollapsed = true;
        scope.displayResults = false;
        scope.transactions = [];
        scope.searchDatas = [];
        scope.glAccounts = [];
        scope.offices = [];
        scope.displaySearchResults =false;
        scope.date={};
        scope.formData={};
        scope.searchData={};
        scope.searchData.searchType ='payments';
       

        resourceFactory.accountCoaResource.getAllAccountCoas({manualEntriesAllowed:true, usage:1, disabled:false}, function(data){
          scope.glAccounts = data;
        });

        resourceFactory.officeResource.getAllOffices(function(data){
          scope.offices = data;  
        });
        
        scope.routeTo = function(id){
            location.path('/viewclient/'+ id);
          };
          
          
          scope.getTicketValues= function (){
        	   resourceFactory.ticketResourceTemplate.get(function(data){ 
                   scope.date = data.ticketDate;
                   scope.problemsDatas=data.problemsDatas;
                   scope.usersDatas=data.usersData;
                 
                 });
          };
          scope.getLeadValues = function (){
        	
        	  resourceFactory.prospectTemplateResource.getTemplate(function(data) {
  				scope.sourceOfPublicityDatas = data.sourceOfPublicityData;
  				scope.getTicketValues();
  										
  			});
          };
        
       var fetchFunction = function(offset, limit, callback) {
          var reqFirstDate = dateFilter(scope.date.first,'yyyy-MM-dd');
          var reqSecondDate = dateFilter(scope.date.second,'yyyy-MM-dd');
          var params = {};
          params.offset = offset;
          params.limit = limit;
          params.locale = $rootScope.locale.code;
          params.dateFormat = "dd MMMM yyyy";

          if (scope.formData.searchText) { params.searchText = scope.formData.searchText; };
          
          if (scope.date.first) { params.fromDate = reqFirstDate; };

          if (scope.date.second) { params.toDate = reqSecondDate; };

          resourceFactory.smartSearchResource.search(params, callback,function(data){
        	  scope.transactions = data.pageItems;
          });
        
       };
       var fetchTicketFunction = function(offset, limit, callback) {
    	   
           var reqFirstDate = dateFilter(scope.date.first,'yyyy-MM-dd');
           var reqSecondDate = dateFilter(scope.date.second,'yyyy-MM-dd');
           var params = {};
           params.offset = offset;
           params.limit = limit;
           params.locale = $rootScope.locale.code;
           params.dateFormat = "dd MMMM yyyy";
           params.searchType = scope.searchData.searchType;
           
           if (scope.formData.searchText) { params.searchText = scope.formData.searchText; };
           
           if(scope.searchData.searchType == 'tickets'){
        	   
               if (scope.formData.category) { params.category = scope.formData.category; };
               if (scope.formData.assignedTo) { params.assignedTo = scope.formData.assignedTo; };
               if (scope.formData.closedBy) { params.closedBy = scope.formData.closedBy; };
               if (scope.formData.status) { params.status = scope.formData.status; };
               if (scope.date.first) { params.fromDate = reqFirstDate; };
               if (scope.date.second) { params.toDate = reqSecondDate; };
           }else if(scope.searchData.searchType == 'leads'){
        	  
        	   if (scope.formData.emailId) { params.emailId = scope.formData.emailId; };
        	   if (scope.formData.phone) { params.phone = scope.formData.phone; };
        	   if (scope.formData.user) { params.createdBy = scope.formData.user; };
        	   if (scope.formData.assignedToForLeads) { params.assignedTo = scope.formData.assignedToForLeads; };
        	   if (scope.formData.source) { params.source = scope.formData.source; };
           }else{
        	   
           }
           
           resourceFactory.advanceSearchResource.search(params, callback,function(data){
         	  scope.transactions = data.pageItems;
           });
           
        };
        scope.searchTransaction = function () {
         
          if(scope.searchData.searchType == 'tickets'){
        	  scope.displaySearchResults = true;
        	  scope.searchDatas = paginatorService.paginate(fetchTicketFunction, 14);
        	   scope.formData = {};
          }else if(scope.searchData.searchType == 'leads'){
        	  scope.displaySearchResultsForLeads = true;
        	  scope.searchDatas = paginatorService.paginate(fetchTicketFunction, 14);
        	   scope.formData = {};
          }else{
        	  scope.displayResults = true;
        	  scope.transactions = paginatorService.paginate(fetchFunction, 14);
        	   scope.formData = {};
          }
          scope.isCollapsed= true;
        };

       }
  });
  mifosX.ng.application.controller('SmartSearchController', ['$scope', 'ResourceFactory', 'PaginatorService','dateFilter','$location','$rootScope', mifosX.controllers.SmartSearchController]).run(function($log) {
    $log.info("SmartSearchController initialized");
  });
}(mifosX.controllers || {}));