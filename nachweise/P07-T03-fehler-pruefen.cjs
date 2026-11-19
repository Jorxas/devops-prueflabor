/** Fehlende echte Containerkonfiguration und ungültige Diagnoseeingabe prüfen. */
const fs=require('node:fs'),assert=require('node:assert/strict');
const {container_starten,container_entfernen,docker}=require('./P07-T02-container-pruefen.cjs');
const {gesundheitszustand}=require('../src/gesundheit.cjs');
(async()=>{
  const ungueltig=await gesundheitszustand('', 'http://127.0.0.1:1/gesundheit');
  assert.equal(ungueltig.code,2);assert.equal(ungueltig.zustand,'eingabefehler');
  const container=await container_starten(false);
  try{
    const diagnostik=await gesundheitszustand('lokal',container.adresse+'/gesundheit');
    assert.equal(diagnostik.code,1);assert.equal(diagnostik.httpStatus,503);assert.equal(diagnostik.zustand,'konfigurationsfehler');
    const protokoll=docker('logs',container.id);
    assert(protokoll.includes('konfigurationsfehler'));
    fs.writeFileSync(__dirname+'/P07-T03-fehler.json',JSON.stringify({zeit:new Date().toISOString(),ungueltig,
      fehlendeEchteContainerkonfiguration:diagnostik,container:container.name,
      wiederherstellung:'Container mit DIENST_UMGEBUNG=lokal neu starten; in T04 tatsächlich prüfen.'},null,2)+'\n');
    fs.writeFileSync(__dirname+'/P07-T03-fehler-protokoll.txt',protokoll+'\n');
    console.log('BESTANDEN: ungültige Eingabe -> 2; fehlende Konfiguration im echten Container -> HTTP 503, Diagnose 1 und nutzbares Protokoll.');
  }finally{container_entfernen(container.id);}
})().catch(fehler=>{console.error(fehler);process.exitCode=1;});
