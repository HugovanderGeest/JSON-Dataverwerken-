const uitvoer = document.getElementById('boeken');
const xhr = new XMLHttpRequest();

const taalkeuzen = document.querySelectorAll('.besturing__cl-taal');
const selectSort = document.querySelector('.besturing__select');
const aantalInWinkelwagen = document.querySelector('.ww__aantal');

xhr.onreadystatechange = () => {
    if(xhr.readyState == 4 && xhr.status ==200) {
        let resultaat = JSON.parse(xhr.responseText);
        boeken.filteren (resultaat);
        boeken.uitvoer();
    }
}

xhr.open('GET', 'boeken.json', true);
xhr.send();


const ww = {
    bestelling: [], 
// boek toevoge
boekToevoegen(obj) {
    ww.bestelling.push(obj);
    aantalInWinkelwagen.innerHTML = this.bestelling.length;
    localStorage.wwBestelling = JSON.stringify(this.bestelling);
},

    // de data uit de local stoige halen
    dataOphalen() {
        this.bestelling = JSON.parse(localStorage.wwBestelling);
        this.uitvoeren();
    },
    
    //uitvoer
uitvoeren() {
    let html = '<tabel>';
    let totaal = 0;
    this.bestelling.forEach(boek => {
            
    let completeTitel = "";
    if(boek.voortitel) {
        completeTitel += boek.voortitel = " ";
    }
    completeTitel += boek.titel;

        // string
        html += '<tr>'
        html += `<td><img src="${boek.cover}" class="bestelformulier__cover"></td>`;
        html += `<td><h1>${completeTitel}</h1></td>`;
        html += `<td>${boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})}</td>`
        html += '</tr>';
        totaal += boek.prijs;
    })

    html += `<tr><td colspan"2">Totaal</td>
    <td>${totaal.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})}</td>
    </tr>`;
    html += '</tabel>';
    document.getElementById('uitvoer').innerHTML = html; 
    aantalInWinkelwagen.innerHTML = ww.bestelling.length;

}

}

// de data uit de local stoige halen
ww.dataOphalen();




const boeken = {

    taalfilter:  [ "Duits", "Nederlands", "Engels"],
    oplopend: 1, // volgorden 
     
    // filter op taal
    filteren (gegevens) {
    this.data = gegevens.filter( (bk) => {
        let bool = false;
            this.taalfilter.forEach( (taal) => {
                if ( bk.taal == taal ) {bool = true}
            } )
        return bool;
    } )
},
        // sorteren op titel

sorteren() {
    if (this.eigenschapsorteren == 'titel' ) {     this.data.sort( (a,b) => (a.titel.toUpperCase() > b.titel.toUpperCase()) ? this.oplopend : -1*this.oplopend );}
    else if (this.eigenschapsorteren == 'paginas' ) {     this.data.sort( (a,b) => (a.paginas > b.paginas) ? this.oplopend : -1*this.oplopend );}
    else if (this.eigenschapsorteren == 'uitgave' ) {     this.data.sort( (a,b) => (a.uitgave > b.uitgave) ? this.oplopend : -1*this.oplopend );}
    else if (this.eigenschapsorteren == 'prijs' ) {     this.data.sort( (a,b) => (a.prijs > b.prijs) ? this.oplopend : -1*this.oplopend );}
    else if (this.eigenschapsorteren == 'auteurs' ) {     this.data.sort( (a,b) => (a.auteurs[0].achternaam > b.auteurs[0].achternaam) ? this.oplopend : -1*this.oplopend );}

},

    // met voortitel
    uitvoer() { 

        this.sorteren();

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
            });


            // html 
            html += `<section class="boek">`;
            html += `<img class="boek_cover" src="${boek.cover}" alt="${completeTitel}">`;
            html += `<h3>${completeTitel}</h3>`;
            html += `<p class="boek__auteurs">Auteur(s): ${auteurs}</p>`
            html += `<span class="boek_ean">EAN: ${boek.ean} | </span>`
            html += `<span class="boek_uitvage">Uitgaven datum: ${this.datumOmzetten(boek.uitgave)} | </span>`
            html += `<span class="boek_taal">Taal: ${boek.taal} | </span>`
            html += `<span class="boek_paginas">Aantal blatzijden: ${boek.paginas} </span>`
            html += `<a class="none" href="#"><div class="boek_prijs"> ${boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})} 
            <a href="#" class="boek__bestel-knop" data-role="${boek.ean}">Bestellen</a></div></a>`;
            html += `</section>`;
        });
        uitvoer.innerHTML = html;
        // knoppen eventlistener
        document.querySelectorAll('.boek__bestel-knop').forEach( knop => {
            knop.addEventListener('click', e => {
                e.preventDefault();
                let boekID = e.target.getAttribute('data-role');
            let geklikBoek = this.data.filter( b => b.ean == boekID)
            ww.boekToevoegen(geklikBoek[0]);

            
            })
        });
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


// checkboxen 

const pasfilteraan = () => {
    console.log('pasfilteraan');
    let gecheckteTaalKeuze = [];
    taalkeuzen.forEach(cb => {
        if (cb.checked) gecheckteTaalKeuze.push(cb.value);
        
    });

    
    boeken.taalfilter = gecheckteTaalKeuze;
    boeken.filteren(JSON.parse(xhr.responseText));
    boeken.uitvoer();
    
}

const pasSortEigAan = () => {
    boeken.eigenschapsorteren = selectSort.value;
    boeken.uitvoer();
}

taalkeuzen.forEach( cb  => cb.addEventListener('change', pasfilteraan) );

selectSort.addEventListener('change', pasSortEigAan);


 
// function test() {
// console.log('pasfilteraan');
// }
