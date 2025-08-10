function formatDuration(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

async function searchSong() {
    const query = document.getElementById("search").value.trim();
    if (!query) {
    alert("Digite o nome da música");
    return;
    }

    try {
    const resp = await fetch(`http://localhost:3000/search?q=${encodeURIComponent(query)}`);
    const data = await resp.json();

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (data.data && data.data.length > 0) {
        data.data.forEach(track => {
        const div = document.createElement("div");
        div.classList.add("track");
        div.innerHTML = `
            <p><b>${track.title}</b> - ${track.artist.name}</p>
            <img src="${track.album.cover_medium}" alt="Capa do álbum" />
            <audio controls>
            <source src="${track.preview}" type="audio/mpeg" />
            Seu navegador não suporta áudio.
            </audio>
            <div>
            <button class="btn-details" onclick="getAlbumDetails(${track.album.id})">Ver álbum</button>
            <button class="btn-details" onclick="getArtistDetails(${track.artist.id})">Ver artista</button>
            </div>
        `;
        resultsDiv.appendChild(div);
        });
    } else {
        resultsDiv.innerHTML = "<p>Nenhum resultado encontrado.</p>";
    }
    } catch (error) {
    alert("Erro ao buscar músicas.");
    console.error(error);
    }
}

async function getAlbumDetails(albumId) {
    try {
    const resp = await fetch(`http://localhost:3000/album/${albumId}`);
    if (!resp.ok) throw new Error('Erro ao buscar álbum');
    const album = await resp.json();

    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h2>${album.title}</h2>
        <img src="${album.cover_medium}" alt="Capa do álbum" />
        <p><b>Artista:</b> ${album.artist.name}</p>
        <p><b>Lançamento:</b> ${album.release_date}</p>
        <p><b>Número de faixas:</b> ${album.nb_tracks}</p>
        <p><b>Duração total:</b> ${formatDuration(album.duration)}</p>
        <h3>Faixas:</h3>
        <ol>
        ${album.tracks.data.map(track => `<li>${track.title} (${formatDuration(track.duration)})</li>`).join('')}
        </ol>
    `;
    openModal();
    } catch (error) {
    alert('Erro ao buscar detalhes do álbum.');
    console.error(error);
    }
}

async function getArtistDetails(artistId) {
    try {
    const resp = await fetch(`http://localhost:3000/artist/${artistId}`);
    if (!resp.ok) throw new Error('Erro ao buscar artista');
    const artist = await resp.json();

    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h2>${artist.name}</h2>
        <img src="${artist.picture_medium}" alt="Foto do artista" />
        <p><b>Fans:</b> ${artist.nb_fan ? artist.nb_fan.toLocaleString() : 'N/A'}</p>
        <p><b>Link Deezer:</b> <a href="${artist.link}" target="_blank" style="color:#b8a1ff;">Ouvir no Deezer</a></p>
        <p><b>Rank:</b> ${artist.rank ? artist.rank.toLocaleString() : 'N/A'}</p>
        <p><b>Tipo:</b> ${artist.type || 'N/A'}</p>
    `;
    openModal();
    } catch (error) {
    alert('Erro ao buscar detalhes do artista.');
    console.error(error);
    }
}

// Modal controls
function openModal() {
    document.getElementById('modal').classList.add('active');
}
function closeModal() {
    document.getElementById('modal').classList.remove('active');
    document.getElementById('modal-body').innerHTML = '';
}
document.getElementById('modal-close').addEventListener('click', closeModal);
window.addEventListener('click', e => {
    if (e.target.id === 'modal') closeModal();
});