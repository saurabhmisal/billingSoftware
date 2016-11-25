app.service('tabService', function(){
   var tab = {
        off: function(id){
            $("#"+id).css('background', '#31b0d5').css('color','#fff').css('border','#269abc');
        },
        on: function(id){
            $("#"+ id).css('background', '#e8e8e8').css('color','#444').css('border','#e1e1e1');
        }
        
    }

    function getItem (arr, property, value) {
        return arr.filter(function(item){
            return item[property] ===  value;
        });
    }

    function tabOpen (cTab, oTab, tabs) {
        tabs[cTab[0].index].status = false;
        tab.off(tabs[cTab[0].index].id);

        tabs[oTab[0].index].status = true;
        tab.on(tabs[oTab[0].index].id);
    }

    this.toggleTab = function( tabId , tabs) {
        var 
        currTab = getItem(tabs, 'status', true),
        tabToOn = getItem(tabs, 'id', tabId);

        if(currTab[0].id != tabId){
            tabOpen(currTab, tabToOn, tabs);
        }
    }
 
});