function toggleDarkMode() {
    document.body.classList.toggle("dark");
    const isDarkMode = document.body.classList.contains("dark");
}

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "enabled") {
        document.body.classList.add("dark");
        document.getElementById("darkModeToggle").checked = true;
    }
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