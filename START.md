# Technischer Einstieg — P07

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
