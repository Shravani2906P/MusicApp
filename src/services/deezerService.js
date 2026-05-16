const KEY = '99e6004315msha6264419bd17b73p11ef85jsn8327f74011b7';
const HOST = 'deezerdevs-deezer.p.rapidapi.com';
const BASE = 'https://deezerdevs-deezer.p.rapidapi.com';

const OPTIONS = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': KEY,
    'x-rapidapi-host': HOST,
  },
};

function mapTrack(track) {
  return {
    id: 'dz_' + track.id,
    title: track.title,
    artistName: track.artist.name,
    artistId: 'dz_artist_' + track.artist.id,
    duration: track.duration,
    cover: track.album.cover_medium,
    url: track.preview || null,
    noPreview: !track.preview,
    deezerId: track.id,
    deezerArtistId: track.artist.id,
    albumTitle: track.album.title,
  };
}

async function fetchQuery(query) {
  try {
    const url = BASE + '/search?q=' + encodeURIComponent(query) + '&limit=50';
    const res = await fetch(url, OPTIONS);
    const data = await res.json();
    return data && data.data ? data.data : [];
  } catch (e) {
    return [];
  }
}

export async function loadHomeTracks() {
  const queries = [
    'arijit singh',
    'bollywood 2024',
    'ar rahman',
    'shreya ghoshal',
    'hindi hits',
    'jubin nautiyal',
    'pritam',
    'neha kakkar',
  ];

  const results = await Promise.all(queries.map(fetchQuery));
  const all = results.flat();

  const seen = new Set();
  return all
    .filter(t => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    })
    .map(mapTrack);
}

export async function searchTracks(query) {
  const raw = await fetchQuery(query);
  return raw.map(mapTrack);
}

export async function getArtist(deezerArtistId) {
  try {
    const res = await fetch(BASE + '/artist/' + deezerArtistId, OPTIONS);
    const data = await res.json();
    if (!data || !data.id) return null;
    return {
      id: 'dz_artist_' + data.id,
      name: data.name,
      genre: 'Artist',
      followers: data.nb_fan ? (data.nb_fan / 1000).toFixed(0) + 'K' : 'N/A',
      bio: data.name + ' has ' + (data.nb_album || 0) + ' albums on Deezer.',
      image: data.picture_xl,
      deezerArtistId: data.id,
    };
  } catch (e) {
    return null;
  }
}

export async function getArtistTracks(deezerArtistId) {
  try {
    const res = await fetch(BASE + '/artist/' + deezerArtistId + '/top?limit=20', OPTIONS);
    const data = await res.json();
    if (!data || !data.data) return [];
    return data.data.map(mapTrack);
  } catch (e) {
    return [];
  }
}