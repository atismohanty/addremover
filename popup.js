window.onload = function(){
    var btn = document.getElementById("001");
    if(!btn) {
        let btn =  document.createElement('BUTTON');
        let txtnode =  document.createElement("TEXT");
        txtnode.value = 'Add Remove';
        btn.appendChild(txtnode);
        btn.addEventListener('click', removeAddMsg);
        document.body.appendChild(btn);
    } else {
        btn.addEventListener('click', function(){
            removeAddMsg();
        });
    }
    
    function removeAddMsg() {
       try{
        console.log('Triggered');
        chrome.tabs.getSelected((tab)=> chrome.tabs.sendMessage(tab.id, 'Hello there'))
       } catch(e) {
           console.log(e);
       }
    }

    setInterval(removeAddMsg, 5000);

    

}