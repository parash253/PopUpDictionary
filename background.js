console.log("Background Running?");
chrome.runtime.onMessage.addListener(receiver);
window.word = 'Popup Dictionary working';
function receiver(request, sender, sendResponse){
    console.log("the request is : ",request);
    window.word = request.text;
}