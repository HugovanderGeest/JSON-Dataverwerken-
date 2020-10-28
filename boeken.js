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
            html += `<span class="boek_ean">EAN: ${boek.ean} | </span>`
            html += `<span class="boek_uitvage">Uitgaven datum: ${boek.uitgave} | </span>`
            html += `<span class="boek_taal">Taal: ${boek.taal} | </span>`
            html += `<span class="boek_paginas">Aantal blatzijden: ${boek.paginas} </span>`
            html += `<div class="boek_prijs">&euro; ${boek.prijs} </div>`
            html += `</section>`;
        });
        uitvoer.innerHTML = html
    }
}