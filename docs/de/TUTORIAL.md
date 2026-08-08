# Anleitung

[English](../en/TUTORIAL.md) · [Türkçe](../tr/TUTORIAL.md) · [Deutsch](../de/TUTORIAL.md) · [Español](../es/TUTORIAL.md) · [繁體中文](../zh/TUTORIAL.md)

Diese Seite führt durch die vier Dinge, für die SteamEdge tatsächlich genutzt wird. Sie
setzt voraus, dass du bereits angemeldet bist - falls nicht, beginne mit der
[Einrichtung](./SETUP.md).

---

## 1. Deine ersten Karten farmen

Tab **Karten farmen**.

1. Drücke **Spieleliste aktualisieren**. SteamEdge liest deine Steam-Abzeichenseiten und
   listet jedes Spiel auf, das noch Kartendrops übrig hat.
2. Wähle einen **Farm-Modus** (unten erklärt).
3. Drücke **Starten**.

Das war's. Lass das Fenster offen - oder minimiere es in die Taskleiste, wenn du das in den
Einstellungen aktiviert hast. Karten erscheinen unter **Letzte Drops**, sobald sie kommen.

### Welchen Modus soll ich nehmen?

| Modus | Was er tut | Wann |
|---|---|---|
| **Nacheinander** | Ein Spiel nach dem anderen, in Warteschlangenreihenfolge. | Du willst vorhersagbares, einfaches Verhalten. |
| **Meiste Karten** | Spiele mit den meisten verbleibenden Karten zuerst. | Du willst möglichst schnell viele Karten. |
| **Wenigste Karten** | Spiele mit den wenigsten verbleibenden zuerst. | Du willst Abzeichen *abschließen*. |
| **Priorität** | Deine manuelle Reihenfolge über die Zeilenpfeile. | Bestimmte Spiele sind dir wichtig. |
| **Schnell** | Siehe unten. | Du hast Spiele unter 2 Stunden Spielzeit. |

### Zum Schnellmodus

Steam schüttet Karten für ein Spiel erst aus, wenn die **Gesamtspielzeit 2 Stunden
überschreitet**. Der Schnellmodus löst das in zwei Stufen:

1. **Aufwärmen.** Jedes ausgewählte Spiel unter 2 Stunden wird *parallel* geöffnet und auf
   die Schwelle gebracht. Steam zählt Zeit für jedes gleichzeitig offene Spiel, deshalb
   dauert eine Gruppe so lange wie ihr am weitesten zurückliegendes Mitglied, nicht die
   Summe.
2. **Rotation.** Ist die Schwelle überschritten, bleiben alle offen und das hervorgehobene
   Spiel wechselt alle 1,5-2 Minuten (zufällig, damit kein fester Rhythmus entsteht).

Wenn du im Schnellmodus auf Starten drückst, sagt dir SteamEdge, wie viele Spiele zuerst
aufgewärmt werden müssen.

### Warteschlangen-Steuerung

Jede Zeile hat kleine Schaltflächen:

- **↑ / ↓** verschieben das Spiel nach oben oder unten (wechselt in den Prioritätsmodus)
- **Ganz nach oben** setzt es an die Spitze
- **✕** entfernt es vollständig aus der Warteschlange

Deine Reihenfolge und Entfernungen werden zwischen Sitzungen gemerkt. Wie lange, legst du
unter Einstellungen → Allgemein → Sicherung → *Aufbewahrungsdauer gemerkter Daten* fest.

---

## 2. Spielzeit erhöhen

Tab **Stunden-Booster**.

1. Durchsuche links deine Bibliothek und klicke Spiele an, um sie zur Warteschlange
   hinzuzufügen.
2. Setze das **Gleichzeitig-Limit** (2 / 8 / 16 / 32 oder benutzerdefiniert).
3. Setze die **Boost-Dauer** oder wähle Unbegrenzt.
4. Drücke **Starten**.

Steam zählt Spielzeit für jedes gleichzeitig geöffnete Spiel, bis zum bekannten Limit von 32.

### Stundenabgleich

Das ist die meistgewünschte Funktion. Aktiviere sie unter Einstellungen → Stunden-Booster →
**Spielzeiten angleichen**.

Angenommen, du hast drei Spiele mit 8, 11 und 101 Stunden und willst sie alle gleich haben.
SteamEdge macht das stufenweise:

1. Das 8-Stunden-Spiel läuft allein, bis es 11 Stunden erreicht.
2. Beide laufen nun gemeinsam bis 101 Stunden.
3. Alle drei laufen von dort zusammen weiter.

Vor dem Start erhältst du ein Bestätigungsfenster mit jeder Stufe und der insgesamt nötigen
Zeit. Diese Summe kann Tage betragen - lies sie, bevor du zustimmst.

Drei Ziele stehen zur Wahl:

- **Höchster der ausgewählten** - das meistgespielte Spiel deiner Warteschlange gibt das Ziel vor
- **Manuell eingegebene Stunden** - du tippst das Ziel ein
- **Höchster in der Bibliothek** - die höchste Spielzeit deines gesamten Steam-Kontos

Spiele, die bereits über dem Ziel liegen, bleiben unberührt.

---

## 3. Errungenschaften verwalten

Tab **Errungenschaften**.

1. Suche oben ein Spiel. Es erscheinen nur Spiele, die Errungenschaften führen.
2. Warte, bis die Liste geladen ist - SteamEdge liest den echten Freischaltstatus über das
   Protokoll.
3. Klicke das Kästchen einer Errungenschaft an oder nutze **Ausgewählte freischalten** /
   **Ausgewählte sperren**.

Der rechte Bereich zeigt Beschreibung, Seltenheit, Freischaltdatum und wie viel Prozent
aller Spieler sie besitzen.

### Vor dem Massen-Freischalten lesen

- **Sicherer Modus** (standardmäßig an) schaltet einzeln frei, mit zufälligem Abstand
  dazwischen. Lass ihn an.
- Das **Freischaltintervall** steht standardmäßig auf 1 Sekunde. Das ist die schnellste
  Option. Hunderte Errungenschaften in wenigen Minuten sind auf deinem öffentlichen Profil
  und auf Seiten, die Errungenschaftsverläufe verfolgen, sichtbar.
- **Freischaltungen zeitlich verteilen** erhöht die Streuung weiter - wirkt natürlicher,
  dauert aber deutlich länger.
- Eine Errungenschaft wieder zu sperren ist möglich, das ursprüngliche Freischaltdatum ist
  jedoch für immer verloren.

Jede Freischaltung wird lokal protokolliert, damit du siehst, was du geändert hast.

---

## 4. Gegenstände im Markt verkaufen

Tab **Inventar & Markt**.

### Preise abrufen

Beim Öffnen fragt SteamEdge, ob die Preise jetzt abgerufen werden sollen. Steam begrenzt
Marktanfragen (grob 20 pro 30 Sekunden), ein großes Inventar dauert also.

Der schnellere Weg:

1. Antworte **Nein, später**.
2. Setze deine Filter - Typ, Spiel, Zustand, Preisbereich.
3. Drücke **Preise abrufen** in der Werkzeugleiste.

Nur die Objekte, die zum aktuellen Filter passen, werden abgerufen. Die Schaltfläche sperrt
sich und zeigt den Fortschritt, bis alle Anfragen fertig sind. Änderst du einen Filter, wird
sie für die neue Auswahl wieder verfügbar.

### Einen Gegenstand lesen

Klicke einen Gegenstand an. Der rechte Bereich zeigt drei getrennte Kästen, und der
Unterschied ist wichtig:

| Kasten | Bedeutung |
|---|---|
| **Aktuelle Angebote** | Was Verkäufer *verlangen*. Nicht bindend - jeder kann einen Gegenstand für 999.999 $ anbieten. |
| **Sofort verkaufen** | Der höchste offene Kaufauftrag. Das bekommst du jetzt, heute. |
| **Abgeschlossene Verkäufe** | Wofür der Gegenstand tatsächlich verkauft wurde. **Daher stammt der Wert.** |

Der Wert ist der mengengewichtete Median abgeschlossener Verkäufe, kein Durchschnitt. Wenn
100 Stück zu 0,30 $ und eines zu 50 $ verkauft wurden, sagt der Durchschnitt 0,79 $ und der
Median 0,30 $. Der Median hat recht.

Gibt es keine offenen Kaufaufträge, bleibt der Kasten **Sofort verkaufen** nicht leer - er
fällt auf den letzten abgeschlossenen Verkauf zurück und sagt das ausdrücklich.

### Verkaufen

Verkauft wird immer über die untere Leiste, ob ein Gegenstand oder fünfzig.

1. Hake die Gegenstände an (oder klicke eine Zeile an und nutze direkt die untere Leiste).
2. Wähle eine Preisstrategie:
   - **Vom Durchschnitt** - der Wert aus abgeschlossenen Verkäufen. Bringt am meisten,
     verkauft am langsamsten.
   - **Unterbieten** - eine Stufe unter dem günstigsten Angebot. Verkauft am schnellsten.
   - **Niedrigsten treffen** - derselbe Preis wie das günstigste Angebot.
   - **Sofort verkaufen** - an den höchsten Kaufauftrag. Sofort weg.
   - **Eigener Preis** - du gibst den Preis ein.
3. Prüfe die Warnzeile. Liegt ein Gegenstand mehr als 25 % über oder unter seinem echten
   Marktwert, sagt SteamEdge das, bevor du bestätigst.
4. Drücke **Verkaufen**.

Die Leiste zeigt sowohl den **Bruttopreis** (was der Käufer zahlt, die Zahl auf Steam) als
auch den **Nettopreis** (was nach Steams rund 13 % Abzug in deinem Guthaben landet).

> Hat dein Konto einen Mobil-Authentifikator, verlangt Steam weiterhin die Bestätigung jedes
> Angebots in der Steam-App. SteamEdge bestätigt nicht automatisch für dich, sofern du keine
> maFile importiert hast.

---

## Nützliche Gewohnheiten

- **Sieh zuerst in die Übersicht.** Sie zeigt, was läuft, wie lange die Sitzung schon
  dauert, und die letzten Aktivitäten aller Funktionen.
- **Schalte "Offline erscheinen" ein** (Einstellungen → Datenschutz), wenn Freunde dich
  nicht bei vierzig Spielen sehen sollen.
- **Nutze Ruhezeiten** (Einstellungen → Benachrichtigungen), damit die App dich nicht um
  3 Uhr morgens anpingt.
- **Exportiere deine Einstellungen** gelegentlich (Einstellungen → Allgemein → Sicherung).
  Der Export enthält keine Anmeldedaten und darf in der Cloud liegen.

---

Weiter: [Einstellungen](./INSTRUCTIONS.md) - jede Option erklärt.
