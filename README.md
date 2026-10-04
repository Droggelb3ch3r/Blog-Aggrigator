Ein Programm um RSS-Feeds zu sammeln, zu speichern und anzuzueigen. Geschreiben in TypeScript und Node.js. Die Daten werden in einer Postgres-Datenbank gespeichert.

#### Bedienung:

### Benutzerverwaltung

    register <name> – Erstellt einen neuen Benutzer und setzt ihn gleichzeitig als aktuell eingeloggten Benutzer.
    login <name> – Wechselt zu einem bereits existierenden Benutzer.
    users – Listet alle registrierten Benutzer auf. Der aktuell eingeloggte Benutzer wird mit (current) markiert.
    reset – Löscht alle Benutzer aus der Datenbank (und damit über Kaskadierung meist auch die zugehörigen Daten).

### Feed-Verwaltung

    addfeed <feed_name> <url> – Fügt einen neuen RSS-Feed hinzu und lässt den aktuellen Benutzer ihm automatisch folgen. (Erfordert Login)
    feeds – Listet alle Feeds auf, die in der Datenbank gespeichert sind, inklusive des Nutzers, der sie ursprünglich erstellt hat.

### Feed-Follows (Abonnements)

    follow <feed_url> – Der aktuelle Benutzer abonniert einen bestehenden Feed über dessen URL. (Erfordert Login)
    following – Zeigt alle Feeds an, denen der aktuelle Benutzer folgt. (Erfordert Login)
    unfollow <feed_url> – Beendet das Abonnement eines Feeds für den aktuellen Benutzer. (Erfordert Login)

### Aggregation (Scraping)

    agg <time_between_reqs> – Startet den Dauer-Scraper, der in festgelegten Zeitabständen (z. B. 1m, 30s, 1h) den jeweils "ältesten" Feed abruft, neue Posts in die Datenbank speichert und das Feld last_fetched_at aktualisiert. Läuft, bis du mit Strg+C abbrichst.

### Posts (deine aktuelle Lektion)

    browse [limit] – Zeigt die neuesten Posts der Feeds an, denen der aktuelle Benutzer folgt. Der optionale Parameter limit bestimmt, wie viele Posts angezeigt werden (Standard: 2). (Erfordert Login)

### Typischer Workflow

    register alice – Benutzer erstellen
    addfeed "Hacker News" https://news.ycombinator.com/rss – Feed hinzufügen (automatisch gefolgt)
    In einem separaten Terminal: agg 1m – Scraper laufen lassen, damit Posts gesammelt werden
    browse 5 – Die letzten 5 Posts ansehen

#### Status:

    Aktuell ist das Programm auf dem absoluten Minimum, was in den Aufgaben gefordert ist. Es gibt noch keine Tests und keine Dokumentation. Die Datenbank wird nicht automatisch erstellt, sondern muss manuell angelegt werden. Die Tabellen werden beim ersten Start automatisch erstellt. Es gibt noch keine Möglichkeit, Feeds zu löschen oder Posts zu löschen. Die Datenbank wird nicht automatisch bereinigt, sodass alte Posts und Feeds bestehen bleiben, bis sie manuell gelöscht werden.

#### Extending the Project

    some ideas:

      Add sorting and filtering options to the browse command
      Add pagination to the browse command
      Add concurrency to the agg command so that it can fetch more frequently
      Add a search command that allows for fuzzy searching of posts
      Add bookmarking or liking posts
      Add a TUI that allows you to select a post in the terminal and view it in a more readable format (either in the terminal or open in a browser)
      Add an HTTP API (and authentication/authorization) that allows other users to interact with the service remotely
      Write a service manager that keeps the agg command running in the background and restarts it if it crashes
