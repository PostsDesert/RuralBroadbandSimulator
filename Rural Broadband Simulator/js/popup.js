$(document).ready(function() {
    $('select').material_select();
  });

window.onload=function(){
    try {
        var chromeValue = chrome.storage.local.get(["currentNumberOfDevices"], function(items){
            console.log(Object.values(items)[0])
            $('#numberOfDevices').val(Object.values(items)[0]);
        });
        var chromeValue = chrome.storage.local.get(["mobileBroadbandSelected"], function(items){
            console.log(Object.values(items)[0])
            $('#mobileBroadband').val(Object.values(items)[0]);
            $("#mobileBroadband").material_select();
        });
    }
    catch(err) {
        a = 2
    }
    document.getElementById('essayLink').addEventListener('click',
        function (e) {
            chrome.tabs.create({
            'url':'https://docs.google.com/document/d/1Jovt3ceafzhxPfn9a1Z0xupNsEM0p02ehFBMluYTKaE/edit?usp=sharing',
            'selected':true
            });
            window.close();
    });
    document.getElementById('bitlyLink').addEventListener('click',
        function (e) {
            chrome.tabs.create({
            'url':'https://bit.ly/ruralbroadbandsim',
            'selected':true
            });
            window.close();
    });
    $( "#mobileBroadband" ).change(function() {
        var val = document.getElementById('mobileBroadband').value
        chrome.storage.local.set({ "mobileBroadbandSelected": val })
        console.log(val)
    })

    $("#numberOfDevices").change(function() {
        var val = document.getElementById('numberOfDevices').value
        chrome.storage.local.set({ "currentNumberOfDevices": val })
        console.log(val)
    })
}