const output = document.getElementById(`boeken`);
const xhr = new XMLHttpRequest();

const taalKeuze = document.querySelectorAll(`.besturing__cb-taal`);

xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
        let xhrResult = JSON.parse(xhr.responseText);

        boeken.filteren(xhrResult);
        boeken.uitvoeren();
    }
}

xhr.open(`GET`, `boeken.json`, true);

xhr.send();