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

            // auteurs html

            let auteurs ="";
            boek.auteurs.forEach(schrijver => {
                let tussenvoegsel = schrijver.tussenvoegsel ? schrijver.tussenvoegsel+" " : " ";
                auteurs += schrijver.voornaam + " " + tussenvoegsel + " " + schrijver.achternaam  + ", " ;
            })


            // html 
            html += `<section class="boek">`;
            html += `<img src="${boek.cover}" alt="${completeTitel}">`;
            html += `<h3>${completeTitel}</h3>`;
            html += `<p class="boek__auteurs">Auteur(s): ${auteurs}</p>`
            html += `<span class="boek_ean">EAN: ${boek.ean} | </span>`
            html += `<span class="boek_uitvage">Uitgaven datum: ${this.datumOmzetten(boek.uitgave)} | </span>`
            html += `<span class="boek_taal">Taal: ${boek.taal} | </span>`
            html += `<span class="boek_paginas">Aantal blatzijden: ${boek.paginas} </span>`
            html += `<div class="boek_prijs"> ${boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})} </div>`
            html += `</section>`;
        });
        uitvoer.innerHTML = html
    },

    datumOmzetten(datumString) {
        let datum = new Date(datumString);
        let jaar = datum.getFullYear();
        let maand = this.geefMaandnaam(datum.getMonth());

        return `${maand} ${jaar}`;
    },

    geefMaandnaam(m) {
        let maand = "";
        switch (m) {
            case 0:
                maand = `januari`;
                break;
            case 1:
                maand = `februari`;
                break;
            case 2:
                maand = `maart`;
                break;
            case 3:
                maand = `april`;
                break;
            case 4:
                maand = `mei`;
                break;
            case 5:
                maand = `juni`;
                break;
            case 6:
                maand = `juli`;
                break;
            case 7:
                maand = `augustus`;
                break;
            case 8:
                maand = `september`;
                break;
            case 9:
                maand = `oktober`;
                break;
            case 10:
                maand = `november`;
                break;
            case 11:
                maand = `december`;
                break;
            default:
                maand = m;
        }
        return maand;
    }
}