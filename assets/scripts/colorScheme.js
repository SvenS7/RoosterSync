(function () {
  // Kies de kleuren voor light en dark mode
  const lightModeColor = "#f7f7f7";
  const darkModeColor = "#222222";

  // Bepaal de voorkeur van de gebruiker
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const themeColor = prefersDarkMode ? darkModeColor : lightModeColor;

  // Maak het meta-element aan
  const metaThemeColor = document.createElement("meta");
  metaThemeColor.name = "theme-color";
  metaThemeColor.content = themeColor;

  // Voeg het meta-element toe aan de <head>
  document.head.appendChild(metaThemeColor);
})();

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (event) => {
    const newColor = event.matches ? darkModeColor : lightModeColor;
    document.querySelector('meta[name="theme-color"]').content = newColor;
  });
