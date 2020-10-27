const uitvoer = document.getElementById('boeken');
const xhr = new XMLHttpRequest();

xhr.onreadystatechange = () => {
    if(xhr.readyState == 4 && xhr.status ==200) {
        let resultaat = JSON.parse(xhr.responseText);
        boeken.data = resultaat;
        boeken.uitvoer();
    }
}

xhr.open('GET', 'boeken.json', true);
xhr.send();

const boeken = {

    // met voortitel
    uitvoer() {
        let html = "";
        this.data.forEach( boek => {

            let completeTitel = "";
            if(boek.voortitel) {
                completeTitel += boek.voortitel = " ";
            }
            completeTitel += boek.titel;


            // html 
            html += `<section class="boek">`;
            html += `<img src="${boek.cover}" alt="${completeTitel}">`;
            html += `<h3>${completeTitel}</h3>`;
            html += `</section>`;
        });
        uitvoer.innerHTML = html
    }
}