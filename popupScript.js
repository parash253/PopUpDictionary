(function setup() {
    let bgpage = chrome.extension.getBackgroundPage();
    let word = bgpage.word;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    // Topic
    // document.getElementById("Topic").innerHTML = "Selected word: " + word;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayDefinition(data);
        })
        .catch(error => {
            console.log('Error fetching data:', error);
        });

    function displayDefinition(data) {
        document.getElementById("Topic").innerHTML = "Word: " + word;

        const definitionContainer = document.getElementById("definition-container");

        if (data && data[0]?.meanings) {
            // Clear any previous content
            definitionContainer.innerHTML = "";

            data[0].meanings.forEach(meaning => {
                // Create a section for each part of speech
                let partOfSpeechElement = document.createElement("h2");
                partOfSpeechElement.textContent = `Part of Speech: ${meaning.partOfSpeech}`;
                definitionContainer.appendChild(partOfSpeechElement);

                meaning.definitions.forEach((definitionObj, index) => {
                    // Create a paragraph for each definition
                    let definitionElement = document.createElement("p");
                    definitionElement.textContent = `${index + 1}. ${definitionObj.definition}`;

                    // If there's an example, show it too
                    if (definitionObj.example) {
                        let exampleElement = document.createElement("p");
                        exampleElement.textContent = `Example: "${definitionObj.example}"`;
                        definitionContainer.appendChild(exampleElement);
                    }

                    definitionContainer.appendChild(definitionElement);
                });
            });
        } else {
            definitionContainer.innerHTML = "No meaning found for the word.";
        }
    }
})();
