function searchMovie() {
  const searchInput = document.getElementById("search");
  const query = searchInput.value.trim(); // Keep original search text
  const formattedQuery = query.replace(/\s+/g, "").toLowerCase(); // Format query for file paths

  const resultContainer = document.getElementById("search-result");
  const gallery = document.getElementById("gallery");

  resultContainer.innerHTML = "";

  if (formattedQuery) {
    const imagePath = `Movies/${formattedQuery}/${formattedQuery}.jpg`;
    const txtPath = `Movies/${formattedQuery}/${formattedQuery}.txt`;

    const img = new Image();
    img.src = imagePath;

    img.onload = function () {
      resultContainer.innerHTML = `
        <h2>Result for "${query}"</h2>
        <img src="${imagePath}" alt="${query}">
        <br>
        <button id="download-btn" onclick="fetchAndDownload('${txtPath}', '${query}')">Download</button>
        <button id="watch-btn" onclick="saveToVideoFile('${txtPath}')">Watch Online</button>
      `;
      gallery.style.display = "none";
    };

    img.onerror = function () {
      resultContainer.innerHTML = `
        <h2>No results found for "${query}"</h2>
        <p>Make sure the movie name matches the folder and file structure.</p>
      `;
      gallery.style.display = "grid";
    };
  } else {
    resultContainer.innerHTML = `
      <h2>No input provided</h2>
      <p>Please enter a movie name to search.</p>
    `;
    gallery.style.display = "grid";
  }

  // Clear the search input after performing the search
  searchInput.value = ''; // Clear the search bar
}

// Fetch the URL from the TXT file and download the linked content
function fetchAndDownload(txtPath, movieName) {
  fetch(txtPath)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not fetch the download link.");
      }
      return response.text();
    })
    .then((downloadUrl) => {
      // Trim the URL and initiate a download
      const trimmedUrl = downloadUrl.trim();

      const a = document.createElement("a");
      a.href = trimmedUrl;
      a.download = movieName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}

// Save the link from the movie's TXT file to a video.txt file
function saveToVideoFile(txtPath) {
  fetch(txtPath)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not fetch the link.");
      }
      return response.text();
    })
    .then((videoUrl) => {
      const link = videoUrl.trim();
      const blob = new Blob([link], { type: "text/plain" });

      // Create a link element to download the video.txt file
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "video.txt"; // Save as video.txt in the root directory
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      alert("Link saved to video.txt successfully!");
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}

// Search when clicking on an image in the gallery
function searchMovieByImage(movieName) {
  const searchInput = document.getElementById("search");
  searchInput.value = movieName; // Set the movie name into the search input

  searchMovie(); // Trigger the search function
}

document.getElementById("search").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchMovie(); // Call the search function
    this.blur(); // Close the keyboard
  }
});
