/** Einen echten Ausfall und eine echte Wiederherstellung ausschließlich eigener Container prüfen. */
const fs=require('node:fs'),assert=require('node:assert/strict');
const {docker,container_starten,container_entfernen}=require('./P07-T02-container-pruefen.cjs');
const {gesundheitszustand}=require('../src/gesundheit.cjs');
(async()=>{
  const schritte=[];
  const kaputt=await container_starten(false);
  try{
    const fehler=await gesundheitszustand('lokal',kaputt.adresse+'/gesundheit');
    assert.equal(fehler.zustand,'konfigurationsfehler');
    const protokoll=docker('logs',kaputt.id);assert(protokoll.includes('konfigurationsfehler'));
    schritte.push({fall:'Fehlende Konfiguration',ergebnis:fehler,protokoll});
  }finally{container_entfernen(kaputt.id);}
  const gesund=await container_starten(true);
  try{
    const korrekt=await gesundheitszustand('lokal',gesund.adresse+'/gesundheit');assert.equal(korrekt.code,0);
    schritte.push({fall:'Mit dokumentierter Konfiguration neu gestartet',ergebnis:korrekt});
    docker('stop','--time','3',gesund.id);
    const ausfall=await gesundheitszustand('lokal',gesund.adresse+'/gesundheit');assert.equal(ausfall.code,3);
    schritte.push({fall:'Eigener Container tatsächlich angehalten',ergebnis:ausfall});
    docker('start',gesund.id);
    const port=docker('port',gesund.id,'3000/tcp').match(/^127\.0\.0\.1:(\d+)$/)?.[1];assert(port);
    const adresse='http://127.0.0.1:'+port;
    let wiederhergestellt;
    for(let i=0;i<100;i++){
      wiederhergestellt=await gesundheitszustand('lokal',adresse+'/gesundheit');
      if(wiederhergestellt.code===0)break;
      await new Promise(erfuellt=>setTimeout(erfuellt,200));
    }
    assert.equal(wiederhergestellt.code,0);
    const status=await (await fetch(adresse+'/status')).json();assert.equal(status.ereignisanzahl,3);assert.equal(status.fehleranzahl,1);
    schritte.push({fall:'Denselben Container wieder gestartet',ergebnis:wiederhergestellt,p02Status:status});
    fs.writeFileSync(__dirname+'/P07-T04-wiederherstellung.json',JSON.stringify({zeit:new Date().toISOString(),ergebnis:'bestanden',schritte,
      grenze:'Nur eigene temporäre Container; keine fremden Dienste, Plattformen oder Systemrechte verändert.'},null,2)+'\n');
    fs.writeFileSync(__dirname+'/P07-T04-container-protokoll.txt',docker('logs',gesund.id)+'\n');
    console.log('BESTANDEN: Konfigurationsfehler behoben, Container wirklich angehalten (Code 3), wieder gestartet (Code 0), P02-Daten 3/1 erhalten.');
  }finally{container_entfernen(gesund.id);}
})().catch(fehler=>{console.error(fehler);process.exitCode=1;});
