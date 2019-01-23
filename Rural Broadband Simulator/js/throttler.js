var attachedTabs = {};
var version = "1.0";

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	var debuggeeId = {tabId:tabId};
	if (changeInfo.url.charAt(0) === 'c') {
		return;
	}
	
	chrome.storage.local.get(null, function(items) {
		var connectionType = items.mobileBroadbandSelected.split("/")
		var currentNumberofDevices = items.currentNumberOfDevices
		connectionType[0] = Math.round(connectionType[0] / currentNumberofDevices)
		connectionType[1] = Math.round(connectionType[0] / currentNumberofDevices)
		connectionType[2] = Number(connectionType[2])
		console.log(connectionType);
		console.log(currentNumberofDevices)
		console.log(connectionType[2])
		if (connectionType[0] == 0 ) {
			chrome.debugger.sendCommand(debuggeeId, "Network.disable");
			chrome.debugger.detach(debuggeeId, onDetach.bind(null, debuggeeId));
		}
		else if (!attachedTabs[tabId]) {
			console.log("starting first debugging connection with values of " + connectionType)
			chrome.debugger.attach(debuggeeId, version, onAttach.bind(null, debuggeeId, connectionType));
		} 
		else {
			//chrome.debugger.attach(debuggeeId, version, onAttach.bind(null, debuggeeId, connectionType));
			console.log("updating debugging connection with values of " + connectionType)
			chrome.debugger.sendCommand(debuggeeId, "Network.emulateNetworkConditions", {"offline": false, "latency": connectionType[2], "downloadThroughput": connectionType[0], "uploadThroughput": connectionType[1]});
			chrome.debugger.sendCommand(debuggeeId, "Network.setCacheDisabled", {"cacheDisabled": true});
			
		}
	});
});
function onAttach(debuggeeId, connectionType) {
	var tabId = debuggeeId.tabId;
	attachedTabs[tabId] = true;
	chrome.debugger.sendCommand(debuggeeId, "Network.enable", null, function() {
		chrome.debugger.sendCommand(debuggeeId, "Network.emulateNetworkConditions", {"offline": false, "latency": connectionType[2], "downloadThroughput": connectionType[0], "uploadThroughput": connectionType[1]});
		//for disabling cache to slow reload
		chrome.debugger.sendCommand(debuggeeId, "Network.setCacheDisabled", {"cacheDisabled": true});
	});
}

function onDetach(debuggeeId) {
	var tabId = debuggeeId.tabId;
	attachedTabs[tabId] = false;
}