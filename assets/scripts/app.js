// Functie om de datum in de vorm van "dag maand jaar" te krijgen
function formatDate(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("nl-NL", options);
}

function printTable() {
  window.print();
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("fetchCalendarButton")
    .addEventListener("click", function () {
      // Haal de waarde uit het input-veld
      var notes = document.querySelector('input[name="calenderNotes"]').value;

      // Zet de waarde in het span-element binnen de tfoot
      document.getElementById("calendarNotesText").textContent = notes;
    });
});

// Selecteer de invoer
const colorInput = document.getElementById("colorInput");

// Voeg een event listener toe aan de kleurinvoer
colorInput.addEventListener("input", function () {
  const newColor = colorInput.value; // Haal de geselecteerde kleur op

  // Update de CSS-variabele met de nieuwe kleur
  document.documentElement.style.setProperty("--table-border-color", newColor);
});

document
  .getElementById("calenderForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const url = document
      .querySelector('input[name="calenderURL"]')
      .value.replace("webcal://", "https://");
    let fetchUrl; // Definieer fetchUrl buiten de if/else blokken

    // Kijk of de url begint met https://calendar.magister.net

    if (url.startsWith("https://calendar.magister.net")) {
      fetchUrl = `https://cors.svenscheepstra.workers.dev/?url=${url}`;
    } else {
      // Als de url er niet mee begint, gebruik de url zoals die is
      fetchUrl = url;
    }

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

      // Sorteer de evenementen op starttijd
      jsonEvents.sort((a, b) => new Date(a.start) - new Date(b.start));

      // Vul de tabel
      const tableBody = document.querySelector("#ics-table tbody");
      tableBody.innerHTML = "";

      // Toon de naam van de kalender
      const name = document.querySelector('input[name="calenderName"]').value;
      // Verander de tekst van de h1 naar de naam van de kalender
      document.querySelector("caption").textContent = "Rooster: " + name;

      jsonEvents.forEach((event) => {
        const row = document.createElement("tr");

        // Gebruik een custom format voor de datum
        const startDate = new Date(event.start);
        const endDate = new Date(event.end);

        // Opties voor de datum en tijd
        const options = {
          weekday: "long", // maandag
          day: "numeric", // 6
          month: "long", // januari
          year: "numeric", // 2025
          hour: "2-digit", // 09
          minute: "2-digit", // 20
          hour12: false, // 24-uurs formaat
        };

        const startFormatted = startDate.toLocaleString("nl-NL", options);
        const endFormatted = endDate.toLocaleString("nl-NL", options);

        // Vergelijk de start- en einddatum
        const isSameDate = startDate.toDateString() === endDate.toDateString();

        let dateDisplay = startFormatted;
        if (!isSameDate) {
          dateDisplay += ` t/m ${endFormatted}`;
        } else {
          // Als de datums gelijk zijn, geef alleen de tijd van de einddatum weer
          const endTimeFormatted = endDate.toLocaleString("nl-NL", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          dateDisplay += ` t/m ${endTimeFormatted}`;
        }

        row.innerHTML = `
    <td>${event.summary}</td>
    <td>${event.location}</td>
    <td>${dateDisplay}</td>
    <td></td>
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

// script.js
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("popup");
  const content = document.getElementById("content");
  const acceptBtn = document.getElementById("accept-btn");

  // Akkoord-knop functionaliteit
  acceptBtn.addEventListener("click", () => {
    popup.classList.add("hidden"); // Verberg popup
    content.classList.remove("hidden"); // Toon inhoud
    localStorage.setItem("popupAccepted", "true"); // Opslaan dat akkoord is gegeven
  });

  // Controleer of gebruiker al akkoord is gegaan
  if (localStorage.getItem("popupAccepted") === "true") {
    popup.classList.add("hidden");
    content.classList.remove("hidden");
  }
});
