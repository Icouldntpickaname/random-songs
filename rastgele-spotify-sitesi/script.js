const clientId = 'YOUR_CLIENT_ID'; // Spotify Developer'dan alın
const redirectUri = 'http://localhost:8888/callback'; // Test için
const playlistId = 'YOUR_PLAYLIST_ID'; // Örn: 37i9dQZF1DXcBWIGoYBM5M

let accessToken;

// Spotify Girişi
document.getElementById('loginButton').addEventListener('click', () => {
    const scopes = ['user-modify-playback-state'];
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes.join('%20')}&response_type=token`;
});

// Token Kontrolü
window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    accessToken = params.get('access_token');

    if (accessToken) {
        document.getElementById('loginButton').style.display = 'none';
        document.getElementById('playRandomButton').disabled = false;
    }
});

// Rastgele Şarkı Çal
document.getElementById('playRandomButton').addEventListener('click', async () => {
    if (!accessToken) return;

    // Çalma listesindeki şarkıları getir
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const data = await response.json();
    const tracks = data.items;

    if (tracks.length === 0) {
        alert('Çalma listesinde şarkı bulunamadı!');
        return;
    }

    // Rastgele bir şarkı seç
    const randomTrack = tracks[Math.floor(Math.random() * tracks.length)].track;
    const trackUri = randomTrack.uri;

    // Şarkıyı çal
    await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uris: [trackUri] })
    });
});