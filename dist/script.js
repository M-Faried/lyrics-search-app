const form = document.getElementById('form');
const search = document.getElementById('search');
const results = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';

/////////////////////////////////////////////////////////////Event Listeners

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchTerm = search.value.trim();

  if (!searchTerm) {
    alert('Please type in a search term');
  } else {
    searchSongs(searchTerm);
  }
});

results.addEventListener('click', (e) => {
  const clickedEl = e.target;

  if (clickedEl.tagName === 'BUTTON') {
    const artist = clickedEl.getAttribute('data-artist');
    const songTitle = clickedEl.getAttribute('data-songtitle');

    getLyrics(artist, songTitle);
  }
});

////////////////////////////////////////////////////////////Helper Functions

// Search by song or artist
async function searchSongs(term) {
  try {
    const res = await fetch(`${apiURL}/suggest/${term}`);
    const data = await res.json();
    showData(data);
  } catch (err) {
    results.innerHTML =
      '<p> An error occurred while trying to connect to the network. PLease check your connection.</p>';
  }
}

// Get prev and next songs
async function getMoreSongs(url) {
  try {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();
    showData(data);
  } catch (err) {
    results.innerHTML =
      '<p> An error occurred while trying to connect to the network. PLease check your connection.</p>';
  }
}

// Get lyrics for song
async function getLyrics(artist, songTitle) {
  try {
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

    results.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2>
    <span>${lyrics}</span>`;
  } catch (err) {
    results.innerHTML =
      '<p> An error occurred while trying to connect to the network. PLease check your connection.</p>';
  }

  more.innerHTML = '';
}

// Show song and artist in DOM
function showData(data) {
  if (data.total === 0) {
    results.innerHTML =
      "<p> Sorry, couldn't find an artist or a song matching your search.</p>";
    return;
  }

  results.innerHTML = `
    <ul class="songs">
      ${data.data
        .map(
          (song) => `<li>
      <span><strong>${song.artist.name}</strong> - ${song.title}</span>
      <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
    </li>`
        )
        .join('')}
    </ul>
  `;

  if (data.prev || data.next) {
    more.innerHTML = `
      ${
        data.prev
          ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`
          : ''
      }
      ${
        data.next
          ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`
          : ''
      }
    `;
  } else {
    more.innerHTML = '';
  }
}
