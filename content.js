console.log("chrome extension with background is working?");
window.addEventListener('mouseup',wordSelected);
function wordSelected(){
    let selectedText = window.getSelection().toString().trim();
    console.log("the selected word is : ",selectedText);
    if (selectedText.length > 0){
        let message = {
            text: selectedText
        };
        chrome.runtime.sendMessage(message);
    }
}