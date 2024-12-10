
// Function that toggles dark mode and make sure setting is stored
function toggleDarkMode() {
    document.body.classList.toggle("dark");
    const isDarkMode = document.body.classList.contains("dark");

    if (isDarkMode) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
}

// Function that toggles the screen reader and speaks to user the current status on disable/enable
function toggleScreenReader() {
    const currentStatus = localStorage.getItem("screenReader") || "disabled"; 

    if (currentStatus === "enabled") {
        document.body.classList.remove("screen-reader-enabled");
        document.getElementById("definition-container").removeAttribute("aria-live");
        localStorage.setItem("screenReader", "disabled");

        speechSynthesis.cancel();

        speak("Screen reader mode disabled.");
    } else {
        document.body.classList.add("screen-reader-enabled");
        document.getElementById("definition-container").setAttribute("aria-live", "assertive");
        localStorage.setItem("screenReader", "enabled");

        speak("Screen reader mode enabled.");
    }
}

// Function that will change speaker icon and speak current word on click
function pronunciationClick() {
    const word = document.getElementById("Topic").textContent.trim();
    if (word) {
        speechSynthesis.cancel();

        const speakerElement = document.getElementById("speaker");
        speakerElement.classList.add("pulsating");

        speak(word);

        setTimeout(function() {
            speakerElement.classList.remove("pulsating");
        }, 1000);
    } else {
        console.error("No word found in the Topic element.");
    }
}

// Main speaking function for screen reader and speaker
function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    } else {
        console.error("Speech synthesis not supported in this browser.");
    }
}

// Handles clicking an element when screen reader is enabled
function handleElementClick(event) {
    const isScreenReaderEnabled = localStorage.getItem("screenReader") === "enabled";

    if (isScreenReaderEnabled) {
        const clickedElement = event.target;

        if (clickedElement) {
            const textContent = clickedElement.textContent || clickedElement.innerText;

            if (textContent.trim() !== "") {
                speechSynthesis.cancel();

                speak(textContent);
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Check if dark mode and screen reader are enabled
    const savedDarkMode = localStorage.getItem("darkMode");
    const savedScreenReader = localStorage.getItem("screenReader");

    if (savedDarkMode === "enabled") {
        document.body.classList.add("dark");
        document.getElementById("darkModeToggle").checked = true;
        const toggleElement = document.getElementById("darkModeToggle");
        if (toggleElement) {
            toggleElement.checked = true;
        }
    }

    if (savedScreenReader === "enabled") {
        document.getElementById("screenReaderToggle").checked = true;
        const toggleElement = document.getElementById("screenReaderToggle");
        if (toggleElement) {
            toggleElement.checked = true;
        }

        speak("Screen reader mode enabled.");
    }

    // Add event listeners for all things that are interactable within the pop-up
    const toggleElement = document.getElementById("darkModeToggle");
    if (toggleElement) {
        toggleElement.addEventListener("change", toggleDarkMode);
    } else {
        console.error('Dark mode toggle checkbox not found!');
    }

    const screenReaderToggle = document.getElementById("screenReaderToggle");
    if (screenReaderToggle) {
        screenReaderToggle.addEventListener("change", toggleScreenReader);
    } else {
        console.error('Screen reader toggle checkbox not found!');
    }

    const volumeIcon = document.getElementById("speaker");
    if (volumeIcon) {
        volumeIcon.addEventListener("click", pronunciationClick);
    }

    document.body.addEventListener("click", handleElementClick);
});

(function setup() {
    let bgpage = chrome.extension.getBackgroundPage();
    let word = bgpage.word;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayDefinition(data);
        })
        .catch(error => {
            console.log('Error fetching data:', error);
        });

    function displayDefinition(data) {
        document.getElementById("Topic").innerHTML = word;

        const definitionContainer = document.getElementById("definition-container");

        if (data && data[0]?.meanings) {
            definitionContainer.innerHTML = "";

            data[0].meanings.forEach(meaning => {
                // Assign CSS to new parts of speech and text content
                let partOfSpeechElement = document.createElement("h2");
                partOfSpeechElement.textContent = `${meaning.partOfSpeech}`;
                partOfSpeechElement.style.textAlign = "left";
                partOfSpeechElement.style.width = "fit-content";
                partOfSpeechElement.style.borderRadius = "10px";
                partOfSpeechElement.style.border = "solid 5px";

                // Add colors to parts of speech to have easy visual indicator
                switch (meaning.partOfSpeech) {
                    case "noun":
                        partOfSpeechElement.style.backgroundColor = "#859F3D";
                        partOfSpeechElement.style.borderColor = "#859F3D";
                        break;                    
                    case "verb":
                        partOfSpeechElement.style.backgroundColor = "#3CB29A";
                        partOfSpeechElement.style.borderColor = "#3CB29A";
                        break;
                    case "adjective":
                        partOfSpeechElement.style.backgroundColor = "#266D98";
                        partOfSpeechElement.style.borderColor = "#266D98";
                        break;
                    case "adverb":
                        partOfSpeechElement.style.backgroundColor = "#422B72";
                        partOfSpeechElement.style.borderColor = "#422B72";
                        break;
                    default:
                        partOfSpeechElement.style.backgroundColor = "#9AA6B2";
                        partOfSpeechElement.style.borderColor = "#9AA6B2";
                }
                
                definitionContainer.appendChild(partOfSpeechElement);
                
                // Append meanings below the parts of speech
                meaning.definitions.forEach((definitionObj, index) => {
                    let definitionElement = document.createElement("p");
                    definitionElement.textContent = `${index + 1}. ${definitionObj.definition}`;
                    definitionContainer.appendChild(definitionElement);
                });
            });
        } else {
            definitionContainer.innerHTML = "No meaning found for the word.";
        }
    }
})();