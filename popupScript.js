function toggleDarkMode() {
    document.body.classList.toggle("dark");
    const isDarkMode = document.body.classList.contains("dark");

    if (isDarkMode) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
}

function toggleScreenReader() {
    const currentStatus = localStorage.getItem("screenReader") || "disabled"; 

    if (currentStatus === "enabled") {
        document.body.classList.remove("screen-reader-enabled");
        document.getElementById("definition-container").removeAttribute("aria-live");
        localStorage.setItem("screenReader", "disabled");
        speak("Screen reader mode disabled.");
    } else {
        document.body.classList.add("screen-reader-enabled");
        document.getElementById("definition-container").setAttribute("aria-live", "assertive");
        localStorage.setItem("screenReader", "enabled");
        speak("Screen reader mode enabled.");
    }
}

function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    } else {
        console.error("Speech synthesis not supported in this browser.");
    }
}

function handleElementClick(event) {
    const isScreenReaderEnabled = localStorage.getItem("screenReader") === "enabled";

    if (isScreenReaderEnabled) {
        const clickedElement = event.target;

        if (clickedElement) {
            const textContent = clickedElement.textContent || clickedElement.innerText;

            if (textContent.trim() !== "") {
                speak(textContent);
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "enabled") {
        document.body.classList.add("dark");
        document.getElementById("darkModeToggle").checked = true;
        const toggleElement = document.getElementById("darkModeToggle");
        if (toggleElement) {
            toggleElement.checked = true;
        }
    }

    const toggleElement = document.getElementById("darkModeToggle");
    if (toggleElement) {
        toggleElement.addEventListener("change", toggleDarkMode);
    } else {
        console.error('Dark mode toggle checkbox not found!');
    }

    const screenReaderToggle = document.getElementById("screenReaderToggle");
    if (screenReaderToggle) {
        toggleElement.addEventListener("change", toggleDarkMode);
        screenReaderToggle.addEventListener("change", toggleScreenReader);
    } else {
        console.error('Screen reader toggle checkbox not found!');
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
                let partOfSpeechElement = document.createElement("h2");
                partOfSpeechElement.textContent = `${meaning.partOfSpeech}`;
                definitionContainer.appendChild(partOfSpeechElement);

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