console.log('Éxecuting the content script');
var props = {
ageLimit: '',
date: '',
distid: '',
intervalCheck: '',
minDoseLimit: ''
}
for(prop in props) {
    if(localStorage[prop]=== undefined) {
        localStorage[prop] = '';
    }
}
var count =0;
function addBlocker() {
     var divAll =  document.body.querySelectorAll("DIV");
     if( divAll.length > 0 ) {
             divAll.forEach((div,i, divAll) => {
                 let id = divAll[i].id.toString();
                 if( id.match(/google_ads_*/gi) || id.match(/_adr_abp_container_*/gi)){
                     console.log(divAll[i]);
                     divAll[i].style.display = 'none';
             }
         });
     }
 }

chrome.runtime.onMessage.addListener(function(message) {
    console.log(message);
    addBlocker();
});

function allowChat()