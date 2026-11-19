/** Ein kleiner tatsächlich ausführbarer lokaler Runner, keine Cloudplattform. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const projekt=path.resolve(__dirname,'..');
const konfiguration=path.join(projekt,'ausgabe/docker-konfiguration');
fs.mkdirSync(konfiguration,{recursive:true});
if(!fs.existsSync(path.join(konfiguration,'config.json')))fs.writeFileSync(path.join(konfiguration,'config.json'),'{}\n');
const beispiele=JSON.parse(fs.readFileSync(path.join(projekt,'beispieldaten/szenarien.json'),'utf8'));
assert.equal(beispiele.length,3);assert.equal(new Set(beispiele.map(b=>b.id)).size,3);
const ergebnisse=[];
const schritte=[['Syntaxprüfung','--check','src/gesundheit.cjs'],
 ['Echter Imagebau und Normalbetrieb','nachweise/P07-T02-container-pruefen.cjs'],
 ['Eingabe- und Konfigurationsfehler','nachweise/P07-T03-fehler-pruefen.cjs']];
for(const [name,...argumente] of schritte){
  const beginn=new Date().toISOString();
  const lauf=spawnSync(process.execPath,argumente,{cwd:projekt,encoding:'utf8',windowsHide:true,timeout:420000,maxBuffer:8*1024*1024});
  ergebnisse.push({name,beginn,ende:new Date().toISOString(),befehl:['node',...argumente],code:lauf.status,ausgabe:lauf.stdout,fehler:lauf.stderr});
  fs.writeFileSync(path.join(projekt,'nachweise/P07-T03-runner.json'),JSON.stringify({zeit:new Date().toISOString(),node:process.version,
    laufort:process.platform,schritte:ergebnisse,ergebnis:lauf.status===0&&ergebnisse.length===schritte.length?'bestanden':'noch-nicht-bestanden',
    grenze:'Echter lokaler Runner; keine Ausführung auf Azure DevOps oder anderer entfernter Plattform.'},null,2)+'\n');
  if(lauf.status!==0){console.error(lauf.stderr||lauf.stdout);process.exit(lauf.status||1);}
  console.log('BESTANDEN: '+name);
}
