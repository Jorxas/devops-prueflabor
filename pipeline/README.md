# Lokale Prüfverkettung

`node pipeline/lokal.cjs` führt Eingabe-/Syntaxprüfung, echten Docker-Bau mit Normalabnahme und Fehlerprüfung aus. Ein fehlgeschlagener Schritt bricht ab; tatsächliche Befehle, Zeitpunkte und Ausgaben stehen unter `nachweise/P07-T03-runner.json`. Docker muss im aufrufenden Kontext zugänglich sein. Die Azure-Pipelines-Datei ist nur eine nicht veröffentlichte Vorlage; keine entfernte Ausführung nachgewiesen.
