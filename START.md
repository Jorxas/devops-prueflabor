# Technischer Einstieg — P07

## P07-T02: erster blockierter Versuch am 10. November 2026

~~~powershell
node nachweise/p07-t02-voraussetzungen.cjs
~~~

Der Lauf endete mit Status 1: Docker-Client 29.2.0 vorhanden, aber kein erreichbarer Daemon unter `npipe:////./pipe/docker_engine`; zusätzlich meldet Docker verweigerten Zugriff auf seine Konfiguration. Keine Berechtigungen geändert. Vor Wiederaufnahme muss eine zugängliche Docker-Laufzeit bereitstehen und `docker version` erfolgreich Client und Server ausgeben. P02-T03 ist laut dessen Abnahmeprotokoll vom 9. November erfolgreich geprüft; es wurde hier nicht erneut ausgeführt.

Die Prüfung schreibt `nachweise/P07-T02-voraussetzungen.json` und kontrolliert Anzahl und SHA-256 der drei Originalbeispiele. Ein erfolgreicher Voraussetzungscheck wäre noch keine Container-Abnahme. Dockerfile, Konfigurationsbeispiel und HTTP-Endpunkt bleiben unimplementiert; die folgenden T01-Befehle behalten ihren begrenzten Entwurfsumfang.

## Jetzt tatsächlich ausführbar

Im Projektordner mit der vorhandenen Node-Laufzeit (geprüft: v24.13.0):

~~~powershell
node src/gesundheit.cjs
node nachweise/p07-t01-pruefen.cjs
~~~

Der Einstieg gibt `{"zustand":"initialisiert","fachfunktionUmgesetzt":false}` aus und beendet sich. Er öffnet keinen Port. Der zweite Befehl kontrolliert Einstieg, Vertragsdaten und die drei unveränderten synthetischen Beispiele. Er schreibt den tatsächlichen Prüfbericht nach `nachweise/P07-T01-pruefung.json`. Docker und zusätzliche Pakete sind dafür nicht erforderlich.

## Gesundheitsvertrag für den späteren Dienst

Ausgewählt ist **P02 — Mini-DataHub und Protokollauswertung**. P02-T01 ist laut dessen Ticket und Journal geprüft: Protokollformat und lokale JSONL-Prüfung liegen vor, eine API noch nicht. Nur diese Vorleistung ist für den Entwurf erforderlich. Die spätere Container-/API-Umsetzung in P07-T02 wartet zusätzlich auf P02-T03.

Verbindliche Vertragsdaten stehen unter `gesundheitsvertrag` in `projekt.json`. Geplant ist `GET http://127.0.0.1:3000/gesundheit`, ausschließlich lokal, mit 2000 Millisekunden Zeitlimit und `Content-Type: application/json; charset=utf-8`. Bei `DIENST_UMGEBUNG=lokal` liefert der spätere Dienst HTTP 200 mit `{"dienst":"P02","zustand":"betriebsbereit"}`. Das bedeutet nur: Prozess antwortet und die erforderliche Umgebungskonfiguration ist vorhanden. Import, Datenbank und andere Fachfunktionen werden dadurch nicht als funktionsfähig bestätigt.

Die geplante Diagnose erhält `{"umgebung":"lokal"}` als lokale Eingabe. Diese Eingabe ist kein HTTP-Anfragekörper; GET bleibt ohne Körper. Der folgende Vertrag beschreibt Erwartungen, keine bereits implementierte Diagnose:

| Fehlerfall | Geplanter Auslöser und beobachtbares Ergebnis | Wiederherstellung |
|---|---|---|
| Fehlende Konfiguration | `DIENST_UMGEBUNG` fehlt/leer; Prozess nimmt nur die Gesundheitsabfrage an und meldet HTTP 503 mit `{"dienst":"P02","zustand":"konfigurationsfehler"}`; Diagnose-Prozessstatus 1. | `DIENST_UMGEBUNG=lokal` setzen und neu starten. |
| Ungültige Eingabe | Diagnosefeld `umgebung` fehlt/leer/ungleich `lokal`; lokal `eingabefehler`, Prozessstatus 2, keine HTTP-Anfrage. | Eingabe auf `umgebung=lokal` korrigieren. |
| Dienst nicht erreichbar | Verbindung abgelehnt oder nach 2000 Millisekunden ohne Antwort; lokal `verbindungsfehler`, Prozessstatus 3, kein HTTP-Status. | Dienststart und Adresse prüfen, erneut abfragen. |

Für diesen kleinen Entwurf sind nur die oben aufgeführten Konfigurationswerte zugelassen. Andere Werte müssen vor dem späteren Start korrigiert werden. Protokolle sollen später Zeitpunkt, Dienstkennung, Fehlerfall und Wiederherstellungsweg enthalten, keine Geheimnisse.

## Umfang der Prüfung

Die drei vorhandenen Beispieldatensätze bleiben erhalten: Normalbetrieb, fehlende Konfiguration und ungültige Eingabe. Der dritte Fehlerfall „Dienst nicht erreichbar“ steht zusätzlich im Vertrag; er ist kein vierter Beispieldatensatz. Die Prüfung vergleicht Kennungen, Eingaben und erwartete Zustände mit dem Vertrag und kontrolliert den SHA-256-Wert der Originaldatei. Das synthetische Merkmal `konfiguration=gueltig` bezeichnet die geplante Einstellung `DIENST_UMGEBUNG=lokal`; `null` bezeichnet deren Fehlen.

Es werden keine HTTP-Anfragen und keine simulierten Produktabnahmen ausgeführt. Gesundheitsantworten, Fehlerbehandlung und Wiederherstellung sind noch umzusetzen und später tatsächlich auszuführen. Lastenheft A1 bis A4 bleiben offen. Der Nachweis von P07-T01 belegt ausschließlich einen konsistenten Entwurf und den vorhandenen Node-Einstieg.

## Fortsetzung am 10. November: Docker-Motor erreichbar

Docker Desktop wurde vom Koordinator gestartet. Der echte Linux-Motor antwortet mit Version 29.2.0. Eine leere projektlokale Docker-Konfiguration ohne Zugangsdaten liegt unter `ausgabe/docker-konfiguration/config.json`; die private Benutzerkonfiguration wird nicht benötigt und ihre Berechtigungen bleiben unverändert. Vor eigenen Docker-Befehlen in der jeweiligen PowerShell setzen:

~~~powershell
$env:DOCKER_CONFIG = Join-Path $PWD 'ausgabe/docker-konfiguration'
$env:DOCKER_HOST = 'npipe:////./pipe/dockerDesktopLinuxEngine'
docker version
~~~

Dies bestätigt nur die Voraussetzung. Innerhalb der bestehenden Sandbox bleiben; ein dort weiterhin verweigerter Daemonzugriff ist eine echte Blockade. Nur T02 wiederaufnehmen, keine Folgephase.

[Voraussetzungsnachweis vom 10. November](nachweise/P07-T02-voraussetzungen-bereit-2026-11-10.json).

## Wiederaufnahme: Docker-Zugriff in der Sandbox verweigert

Der oben dokumentierte Erfolg des Koordinators ist kein erfolgreicher Zugriff dieses Projektarbeiters. Die Wiederaufnahme am 10. November um 08:38 Uhr Berlin endete trotz projektlokaler Konfiguration mit Status 1: `permission denied while trying to connect to the docker API at npipe:////./pipe/dockerDesktopLinuxEngine`. Der frühere Konfigurationsfehler wurde in diesem Lauf nicht erneut gemeldet; die Docker-API bleibt hier unzugänglich. Keine Berechtigungen geändert, keine alternative Laufzeit oder Simulation verwendet.

Wiederholbare kleinste Voraussetzungsprüfung:

~~~powershell
node nachweise/p07-t02-wiederaufnahme.cjs
~~~

Das Skript setzt nur für seinen Docker-Unterprozess die oben dokumentierten `DOCKER_CONFIG`- und `DOCKER_HOST`-Werte. Voraussetzung ist die vorhandene Datei `ausgabe/docker-konfiguration/config.json` mit dem leeren JSON-Objekt `{}` ohne Zugangsdaten. Es schreibt ausschließlich den neuen Bericht `nachweise/P07-T02-wiederaufnahme.json`; die Nachweise des ersten Versuchs bleiben erhalten. Testquelle sind die drei unveränderten Originalbeispiele in `beispieldaten/szenarien.json`. Weitere Testquellen oder Pakete sind nicht erforderlich.

P07-T02 bleibt blockiert. Dockerfile, Konfigurationsbeispiel für den Dienst und HTTP-Endpunkt wurden noch nicht erstellt; die leere Docker-Clientkonfiguration ersetzt kein Dienstkonfigurationsbeispiel. Kein Imagebau, Containerstart oder HTTP-Test. Erst bei tatsächlich zugänglicher Laufzeit innerhalb der bestehenden Sandbox denselben Endpunkt wiederaufnehmen. Lastenheft A1 bis A4 bleiben offen.

## Tatsächlicher Containerbetrieb vom 17. November 2026

P07-T02 lokal geprüft durch den Koordinator im vorhandenen autorisierten Ausführungskontext. Der frühere verweigerte Docker-Zugriff des isolierten Hintergrundarbeiters bleibt als eigener Befund erhalten. Keine Sandbox- oder Systemrechte geändert. Verwendet wird dieselbe lokale Docker-Desktop-Laufzeit, nicht ein Ersatzdienst.

Dockerfile mit festem Python-3.12-Image-Digest und FastAPI/Uvicorn-Versionen erstellt. Vier unveränderte kleine P02-Dateien (API, Import, Schema, synthetische Logs) mit Herkunft und Prüfsummen unter `bereitstellung/p02/` übernommen. Der Container importiert echte Beispieldaten nach SQLite und startet die echte P02-FastAPI. Der ergänzte Endpunkt `GET /gesundheit` prüft lokale Konfiguration und Datenbankzugriff. Image kopiert ausdrücklich nur die freigegebenen Dateien; keine Git-, Benutzer-, Docker-Konfiguration oder .env-Datei eingebaut. Keine Zugangsdaten erforderlich.

Tatsächlich Image gebaut und eigenen Testcontainer gestartet: Benutzer 10001:10001, ein CPU-Kern, 256 MB und ausschließlich lokaler zufälliger Hostport. Gesundheitsantwort 200 mit `P02/betriebsbereit`; `/status` meldet drei gespeicherte Ereignisse und einen ERROR. [Lauf und Imagekennung](nachweise/P07-T02-container.json), [echtes Buildprotokoll](nachweise/P07-T02-docker-build.txt), [Dienstprotokoll](nachweise/P07-T02-container-protokoll.txt). Nur der selbst erzeugte Container wurde nach Labelprüfung entfernt; Image und fremde Dienste bleiben erhalten.

Wiederholung: `node nachweise/P07-T02-container-pruefen.cjs`. Docker muss für den aufrufenden Kontext zugänglich sein. Das Skript verwendet unter Windows den vorhandenen Docker-Desktop-Linux-Motor und eine leere projektlokale Konfiguration unter `ausgabe/docker-konfiguration/config.json`. Falls diese Datei fehlt, ausschließlich einen leeren lokalen Ordner mit `{}` anlegen; keine privaten Zugangsdaten kopieren. Die Beispiel-Dienstkonfiguration steht in `bereitstellung/dienst.env.beispiel` und wird beim Test als gewöhnliche Umgebungsvariable gesetzt. Direkte Diagnose: `node src/gesundheit.cjs lokal http://127.0.0.1:HOSTPORT/gesundheit` mit dem tatsächlich angezeigten Port.

Diagnosecodes: 0 betriebsbereit, 1 fehlerhafte Dienstantwort, 2 ungültige Diagnoseeingabe, 3 Verbindung nicht möglich beziehungsweise Zeitlimit. Bisher in T02 tatsächlich nur Normalbetrieb geprüft; gezielte Fehler und Runner folgen in T03/T04. Kein Cloudbetrieb, Azure-DevOps-Lauf oder Produktivbetrieb behauptet. Studentische Schätzung 90 Minuten, keine separat gemessene Koordinator-Gesamtdauer und keine menschliche Eigenleistung. Dokumentiert 2026-11-17T18:02:35.612Z.

Gelesene Primärquellen: [Docker-Build](https://docs.docker.com/build/building/best-practices/), [Container starten](https://docs.docker.com/engine/containers/run/).
