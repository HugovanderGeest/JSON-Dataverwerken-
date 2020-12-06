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


function AutoRefresh( t ) {
   setTimeout("location.reload(true);", t);
}

const ww = {
    bestelling: [], 
// boek toevoge
boekToevoegen(obj) { 
    let gevonden = this.bestelling.filter(b => b.ean == obj.ean );
    if ( gevonden.length == 0) {
        obj.besteldAantal ++;
        ww.bestelling.push(obj);
    } else {
        gevonden[0].besteldAantal ++;

    }
    localStorage.wwBestelling = JSON.stringify(this.bestelling);
},

    // de data uit de local stoige halen
    dataOphalen() {
        if (localStorage.wwBestelling) {
            this.bestelling = JSON.parse(localStorage.wwBestelling);
        }
        this.uitvoeren();
    },
    
    //uitvoer
uitvoeren() {
    let html = '<tabel>';
    let totaal = 0;
    let totaalBesteld = 0;
    this.bestelling.forEach(boek => {
            
    let completeTitel = "";
    if(boek.voortitel) {
        completeTitel += boek.voortitel = " ";
    }
    completeTitel += boek.titel;

        // string
        html += '<tr>'
        html += `<td><h1>${completeTitel}</h1></td>`;
        html += `<td><img src="${boek.cover}" class="bestelformulier__cover"></td>`;
        html += `<td class="bestelformulier__aantal">
        <i class="fas fa-arrow-down bestelformulier__verlaag " data-rol="${boek.ean}"></i>
        ${boek.besteldAantal}
        <i class="fas fa-arrow-up bestelformulier__verhoog "data-rol="${boek.ean}"></i>
        </td>`;
        html += `<td>${boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})}</td>`
        html += `<td><i class="fas fa-trash bestelformulier__trash" data-rol="${boek.ean}"></i></td>`;
        html += '</tr><br><br><br><br>';
        totaal += boek.prijs*boek.besteldAantal;
        totaalBesteld += boek.besteldAantal;
    })

    html += `<tr><td colspan"2">Totaal</td>
    <td>${totaal.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})}</td>
    </tr>`;
    html += '</tabel>';
    document.getElementById('uitvoer').innerHTML = html; 
    aantalInWinkelwagen.innerHTML = totaalBesteld;
    this.trashActiveren();

},
trashActiveren() {
    document.querySelectorAll('.bestelformulier__trash').forEach( trash => {
        trash.addEventListener('click', e => {
            let teVerwijderenBoekID = e.target.getAttribute('data-rol');
            this.bestelling = this.bestelling.filter(bk => bk.ean != teVerwijderenBoekID);
            // localstorage bijwerken 
            localStorage.wwBestelling = JSON.stringify(this.bestelling);
            this.uitvoeren();
        })
    })
}

}

// de data uit de local stoige halen
ww.dataOphalen();



// Hugo van der Geest
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

            // aantal besteld
            boek.besteldAantal = 0;

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
            let geklikBoek = this.data.filter( b => b.ean == boekID);
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
