document
  .getElementById("calenderForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const url = document.querySelector('input[name="calenderURL"]').value;

    const fetchUrl = url.replace("webcal://", "https://");

    try {
      // Haal ICS data op
      const response = await fetch(fetchUrl);
      if (!response.ok) throw new Error("Kon kalender niet ophalen");
      const icsData = await response.text();

      const jCalData = ICAL.parse(icsData);
      const comp = new ICAL.Component(jCalData);
      const events = comp.getAllSubcomponents("vevent");

      const jsonEvents = events.map((event) => {
        const e = new ICAL.Event(event);
        return {
          summary: e.summary,
          start: e.startDate.toString(),
          end: e.endDate.toString(),
          location: e.location,
          description: e.description,
        };
      });

      console.log(toString(jsonEvents));

      // Sorteer de evenementen op starttijd
      jsonEvents.sort((a, b) => new Date(a.start) - new Date(b.start));

      // Vul de tabel
      const tableBody = document.querySelector("#ics-table tbody");
      jsonEvents.forEach((event) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${event.location}</td>
        <td>${new Date(event.start).toLocaleString()}</td>
        <td>${new Date(event.end).toLocaleString()}</td>
        <td>${event.description}</td>
      `;
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Er ging iets mis bij het ophalen van de kalender: " + error.message
      );
    }
  });
