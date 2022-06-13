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
var date = localStorage.getItem('date') ? localStorage.getItem('date') : new Date().getDate() + '-' + (new Date().getMonth() + 1 ) + '-' + new Date().getFullYear();
var distid = localStorage.getItem('distid') ? Number(localStorage.getItem('distid')) : 294;
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
    fetchData();
});

function fetchData(){
   try{
    // var token =  (window.sessionStorage.userToken || '' ).replace('\"', '').replace('\"', '').toString();
    // if(!token || token === '') {
    //     return;
    // }
    var reqUrl = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id='+ distid +'&date='+ date;
    var xhr = new XMLHttpRequest();
    xhr.open( 'GET',reqUrl);
    xhr.setRequestHeader('Content-Type', 'application/json');
    // if(token) {
    //     xhr.setRequestHeader('Authorization', 'Bearer '+ token);
    // }

    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 3) {
          // loading
        }
        if (xhr.readyState == 4 && xhr.status==200) {
          console.log(JSON.parse(xhr.response));
          processResponse(JSON.parse(xhr.response));
        }
    }
   } catch(e) {
       console.log(e);
   }

}

function processResponse(response) {
    var isAvailable = false;
    var availCenters = [];
    var isCovaxin = false;
    var coVaxineCenters = [];
    var maxSlots = 0;
    var maxSlotPin = null;
    var ageLimit =  localStorage.getItem('ageLimit') ? Number(localStorage.getItem('ageLimit')) : 18;
    var minDoseLimit = localStorage.getItem('minDoseLimit') ? Number(localStorage.getItem('minDoseLimit')) : 10;
    if(response.centers) {
        var result =  response.centers;
        response.centers.forEach((center) => {
            if(center && center.sessions && center.sessions.length > 0) {
                center.sessions.forEach((i) => {
                    if(i.min_age_limit == ageLimit  && i.available_capacity_dose1 > minDoseLimit) {
                        isAvailable = true;
                        availCenters.push({name: center.address, pin: center.pincode , centerid: center.center_id, center: center, doseCount: i.available_capacity_dose1 });
                        
                        if(i.vaccine==='COVAXIN') {
                            isCovaxin = true;
                            coVaxineCenters.push({name: center.address, pin: center.pincode , centerid: center.center_id });
                        }
                    }
                });
            }

        });
        if(isAvailable){
            console.clear();
            availCenters.forEach((i) => {
                console.log(' PinCode ', i.pin, '              ------', 'Max Slot', i.doseCount );
                console.log('-------------------');
                if(i.doseCount > maxSlots) {
                    maxSlots = i.doseCount;
                    maxSlotPin = i.pin;
                }
            });

            if(!audio) {
                var audio = new Audio();
            }
            audio.src = 'https://www.soundjay.com/buttons/button-4.wav';
            audio.loop = true;
            audio.play();
            setTimeout(() => {
                audio.loop = false;
            }, 4000);
            
            setTimeout(()=> {
                if(maxSlots > minDoseLimit && maxSlotPin) {
                    //window.document.focus();
                    if(document.getElementById('mat-input-0')) {
                        document.getElementById('mat-input-0').focus();
                        document.getElementById('mat-input-0').value = maxSlotPin;
                        setTimeout(() => {
                            document.getElementsByClassName('pin-search-btn')[0].click();
                        }, 1000);
                    }
                }
            }, 2000);
            console.log('max slot', maxSlots, 'max slot pin', maxSlotPin);

           
        } else {
            if(count == 50) {
                // window.location.reload();
            } else {
                count ++;
            }
        }
    }
}