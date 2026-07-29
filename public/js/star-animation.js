document.addEventListener("DOMContentLoaded", function () {
    const footer = document.querySelector("footer");

    setInterval(createStar, 200); // every 200ms = adjust as needed

    function createStar() {
        const top = Math.random() * footer.clientHeight;
        const left = Math.random() * footer.clientWidth;

        const star = document.createElement("div");
        star.classList.add("star");
        star.style.top = top + "px";
        star.style.left = left + "px";

        footer.appendChild(star);

        // remove after a while to avoid clutter
        setTimeout(() => star.remove(), 4000);
    }
});

//if someone click on weather stats in website it should focus on the search bar
document.addEventListener("DOMContentLoaded", () => {
  const weatherStatsLink = document.getElementById("weather-link");
  const searchBar = document.getElementById("search-bar");
  if (weatherStatsLink && searchBar){     // to check if both elements actually exist on the page.
    weatherStatsLink.addEventListener("click", (event) => {{
      event.preventDefault(); // stop navigation
      searchBar.classList.add("search-focus"); // focus the search bar
    }})
  }
})
