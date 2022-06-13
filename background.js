
var intervalCheck = localStorage.getItem('intervalCheck') ? Number(localStorage.getItem('intervalCheck')) : 30000;
console.log('Re-run at ', intervalCheck/1000, ' sec');
var interval = setInterval(() => {
    var extid = GetExtnID();
    chrome.tabs.getAllInWindow((tabs) => console.log(tabs) );
    chrome.tabs.query({url:'https://selfregistration.cowin.gov.in/*'}, (tab) => 
    {
        chrome.tabs.sendMessage(tab[0].id, 'Hello there');
        chrome.runtime.sendMessage(extid, 'Hello there runtime');
        console.log(tab);
    });
    
}, intervalCheck);

function GetExtnID() {
    var id = null;
    var href = window.location.href;
    var splitArray = href.split('ExtnID=');
    if (splitArray && splitArray.length > 1) {
        id = splitArray[1];
    }
    return (id);
};

// (function removeAddMsg() {
//     console.log('Triggered');
//     chrome.tabs.getSelected((tab)=> chrome.tabs.sendMessage(tab.id, 'Hello there'));
// })();