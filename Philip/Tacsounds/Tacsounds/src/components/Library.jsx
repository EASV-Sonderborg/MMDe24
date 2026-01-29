import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./library.css";

import playIcon from "../assets/icons/play.svg";
import pauseIcon from "../assets/icons/pause.svg";
import TrackActionsMenu from "./TrackActionsMenu.jsx";
import TrackDetailsModal from "./TrackDetailsModal.jsx";
import heartOutline from "../assets/icons/heart-outline.svg";
import heartFilled from "../assets/icons/heart-filled.svg";
import chevronIcon from "../assets/icons/chevron.svg";
import backIcon from "../assets/icons/back.svg";

const FALLBACK_COVER = "/assets/covers/tacStandard.png";
const PLAYLIST_STORAGE_KEY = "tacsounds.playlists";
const LIKED_PLAYLIST_ID = "liked-songs";
const LIKED_PLAYLIST_NAME = "Liked Songs";
const DEFAULT_LIBRARY_ALBUM = "Sunsets after Midnight";
const RECOMMEND_IGNORE_KEY = "tacsounds.recommendations.ignore";
const RECOMMEND_COUNT = 3;

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(max-width:${breakpoint}px)`).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return () => {};
    const mql = window.matchMedia(`(max-width:${breakpoint}px)`);
    const handler = (event) => setIsMobile(event.matches);
    if (mql.addEventListener) mql.addEventListener("change", handler);
    else mql.addListener(handler);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", handler);
      else mql.removeListener(handler);
    };
  }, [breakpoint]);

  return isMobile;
}

export default function Library({
  controller,
  initialQuery = "",
  focusTrackId = null,
}) {
  const tracks = controller?.tracks ?? [];
  const catalog = controller?.catalog ?? tracks;
  const { playById, playNext, playSequence, addToQueue, isPlaying } =
    controller || {};

  const [query, setQuery] = useState(initialQuery);
  const [activeGenre, setActiveGenre] = useState("");
  const [sortKey, setSortKey] = useState("releaseDate");
  const [sortDir, setSortDir] = useState("desc");
  const [durations, setDurations] = useState({});
  const [detailsOf, setDetailsOf] = useState(null);
  const [showGenres, setShowGenres] = useState(false);
  const [viewMode, setViewMode] = useState("tracks");
  const [detailView, setDetailView] = useState(null);
  const [playlists, setPlaylists] = useState(() =>
    ensureLikedPlaylist(readStoredPlaylists(PLAYLIST_STORAGE_KEY)),
  );
  const [ignoredRecs, setIgnoredRecs] = useState(() =>
    readStoredIgnoredRecommendations(RECOMMEND_IGNORE_KEY),
  );
  const lastSavedRef = useRef("");
  const [playlistDraft, setPlaylistDraft] = useState("");
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);
  const [playlistModalTrack, setPlaylistModalTrack] = useState(null);
  const [playlistModalDraft, setPlaylistModalDraft] = useState("");

  const isMobile = useIsMobile(820);

  useEffect(() => {
    setQuery(initialQuery || "");
  }, [initialQuery]);

  useEffect(() => {
    let cancelled = false;
    const pending = catalog.filter(
      (track) => !track.length && !track.duration && track.audio?.src,
    );
    if (pending.length === 0) return () => {};

    pending.forEach((track) => {
      const audio = new Audio();
      audio.preload = "metadata";
      audio.src = track.audio?.src || "";

      const cleanup = () => {
        audio.removeEventListener("loadedmetadata", onLoaded);
        audio.removeEventListener("error", onError);
      };

      const onLoaded = () => {
        if (cancelled) return;
        const sec = Number.isFinite(audio.duration) ? audio.duration : 0;
        setDurations((prev) => ({
          ...prev,
          [track.id]: fmtTimeFromSeconds(sec),
        }));
        cleanup();
      };

      const onError = () => cleanup();

      audio.addEventListener("loadedmetadata", onLoaded);
      audio.addEventListener("error", onError);
      audio.load();
    });

    return () => {
      cancelled = true;
    };
  }, [catalog]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const safe = ensureLikedPlaylist(playlists);
      const serialized = JSON.stringify(safe);
      if (serialized === lastSavedRef.current) return;
      localStorage.setItem(PLAYLIST_STORAGE_KEY, serialized);
      lastSavedRef.current = serialized;
      window.dispatchEvent(new Event("playlists-updated"));
    } catch {}
  }, [playlists]);

  useEffect(() => {
    if (typeof window === "undefined") return () => {};
    const onStorage = (event) => {
      if (event.key !== PLAYLIST_STORAGE_KEY) return;
      const stored = readStoredPlaylists(PLAYLIST_STORAGE_KEY);
      const safe = ensureLikedPlaylist(stored);
      const serialized = JSON.stringify(safe);
      if (serialized === lastSavedRef.current) return;
      lastSavedRef.current = serialized;
      setPlaylists(safe);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return () => {};
    const onUpdate = () => {
      const stored = readStoredPlaylists(PLAYLIST_STORAGE_KEY);
      const safe = ensureLikedPlaylist(stored);
      const serialized = JSON.stringify(safe);
      if (serialized === lastSavedRef.current) return;
      lastSavedRef.current = serialized;
      setPlaylists(safe);
    };
    window.addEventListener("playlists-updated", onUpdate);
    return () => window.removeEventListener("playlists-updated", onUpdate);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        RECOMMEND_IGNORE_KEY,
        JSON.stringify(ignoredRecs || []),
      );
    } catch {}
  }, [ignoredRecs]);

  const normalizeGenres = useCallback((track) => {
    if (!track) return [];
    if (Array.isArray(track.genres))
      return track.genres.filter(Boolean).map((g) => String(g).trim());
    if (Array.isArray(track.genre))
      return track.genre.filter(Boolean).map((g) => String(g).trim());
    if (typeof track.genres === "string")
      return track.genres
        .split(/[,|]/)
        .map((genre) => genre.trim())
        .filter(Boolean);
    if (typeof track.genre === "string")
      return track.genre
        .split(/[,|]/)
        .map((genre) => genre.trim())
        .filter(Boolean);
    return [];
  }, []);

  const allGenres = useMemo(() => {
    const set = new Set();
    catalog.forEach((track) =>
      normalizeGenres(track).forEach((genre) => set.add(genre)),
    );
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [catalog, normalizeGenres]);

  const searchTerm = query.trim().toLowerCase();

  const filteredTracks = useMemo(() => {
    let scopeTracks = catalog;
    if (detailView?.type === "playlist") {
      const playlist = playlists.find((item) => item.id === detailView.id);
      const trackMap = new Map(
        catalog.map((track) => [String(track.id), track]),
      );
      const byIds = (playlist?.trackIds || [])
        .map((id) => trackMap.get(String(id)))
        .filter(Boolean);
      scopeTracks = byIds.length ? byIds : detailView.tracks || [];
    } else if (detailView?.type) {
      scopeTracks = detailView.tracks || [];
    }
    const isDetail = Boolean(detailView?.type);
    const term = isDetail ? "" : query.trim().toLowerCase();
    return scopeTracks.filter((track) => {
      const textHit =
        !term ||
        track.title?.toLowerCase().includes(term) ||
        track.artist?.toLowerCase().includes(term) ||
        track.album?.toLowerCase().includes(term);
      const genreHit = isDetail
        ? true
        : !activeGenre || normalizeGenres(track).includes(activeGenre);
      return textHit && genreHit;
    });
  }, [activeGenre, catalog, detailView, normalizeGenres, playlists, query]);
  const sortedTracks = useMemo(() => {
    const arr = [...filteredTracks];
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      switch (sortKey) {
        case "title":
        case "artist":
        case "album":
          return (
            String(a[sortKey] || "").localeCompare(String(b[sortKey] || "")) *
            dir
          );
        case "genre": {
          const aa = normalizeGenres(a).join(", ");
          const bb = normalizeGenres(b).join(", ");
          return aa.localeCompare(bb) * dir;
        }
        case "releaseDate":
        default: {
          const ta = new Date(a.releaseDate).getTime() || 0;
          const tb = new Date(b.releaseDate).getTime() || 0;
          return (ta - tb) * dir;
        }
      }
    });
    return arr;
  }, [filteredTracks, sortKey, sortDir, normalizeGenres]);

  const albums = useMemo(() => {
    const map = new Map();
    catalog.forEach((track) => {
      const name = String(track.album || "").trim();
      if (!name) return;
      if (!map.has(name)) {
        map.set(name, {
          id: `album-${slugify(name)}`,
          name,
          tracks: [],
          cover: track.cover?.src || FALLBACK_COVER,
          artists: new Set(),
          releaseDate: null,
        });
      }
      const entry = map.get(name);
      entry.tracks.push(track);
      if (track.artist) entry.artists.add(track.artist);
      if (!entry.cover && track.cover?.src) entry.cover = track.cover.src;
      entry.releaseDate = latestIsoDate(entry.releaseDate, track.releaseDate);
    });
    return [...map.values()]
      .map((entry) => ({
        ...entry,
        artist:
          entry.artists.size === 1
            ? [...entry.artists][0]
            : "Various Artists",
        trackCount: entry.tracks.length,
      }))
      .sort((a, b) => {
        const ta = new Date(a.releaseDate).getTime() || 0;
        const tb = new Date(b.releaseDate).getTime() || 0;
        return tb - ta;
      });
  }, [catalog]);

  const albumsById = useMemo(() => {
    const map = new Map();
    albums.forEach((album) => map.set(album.id, album));
    return map;
  }, [albums]);

  const filteredAlbums = useMemo(() => {
    if (!searchTerm) return albums;
    return albums.filter((album) => {
      const name = album.name.toLowerCase();
      const artist = (album.artist || "").toLowerCase();
      return name.includes(searchTerm) || artist.includes(searchTerm);
    });
  }, [albums, searchTerm]);

  const playlistsById = useMemo(() => {
    const map = new Map();
    playlists.forEach((playlist) => map.set(playlist.id, playlist));
    return map;
  }, [playlists]);

  const playlistItems = useMemo(() => {
    const trackMap = new Map(catalog.map((track) => [track.id, track]));
    return playlists.map((playlist) => {
      const tracksIn = playlist.trackIds
        .map((id) => trackMap.get(id))
        .filter(Boolean);
      const cover = tracksIn[0]?.cover?.src || FALLBACK_COVER;
      return {
        ...playlist,
        tracks: tracksIn,
        cover,
        trackCount: tracksIn.length,
        releaseDate: playlist.createdAt,
      };
    });
  }, [catalog, playlists]);

  const filteredPlaylists = useMemo(() => {
    if (!searchTerm) return playlistItems;
    return playlistItems.filter((playlist) =>
      playlist.name.toLowerCase().includes(searchTerm),
    );
  }, [playlistItems, searchTerm]);
  useEffect(() => {
    if (!detailView) return;
    if (detailView.type === "album") {
      const album = albumsById.get(detailView.id);
      if (!album) setDetailView(null);
    }
    if (detailView.type === "playlist") {
      const playlist = playlistsById.get(detailView.id);
      if (!playlist) setDetailView(null);
    }
  }, [detailView, albumsById, playlistsById]);

  const rowRefs = useRef(new Map());
  const menuButtonRefs = useRef(new Map());
  const menuOpeners = useRef(new Map());
  const longPressTimers = useRef(new Map());
  useEffect(() => {
    if (!focusTrackId) return;
    const el = rowRefs.current.get(focusTrackId);
    if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [focusTrackId, sortedTracks]);

  const setMenuRef = useCallback(
    (trackId) => (node) => {
      if (node) menuButtonRefs.current.set(trackId, node);
      else menuButtonRefs.current.delete(trackId);
    },
    [],
  );

  const playlistMenuOpenerRef = useRef(null);
  const registerPlaylistMenuOpenAt = useCallback((opener) => {
    playlistMenuOpenerRef.current = opener;
  }, []);

  const openPlaylistMenuAt = useCallback((event) => {
    if (!playlistMenuOpenerRef.current) return;
    event.preventDefault();
    playlistMenuOpenerRef.current({
      x: event.clientX,
      y: event.clientY,
    });
  }, []);

  const registerMenuOpenAt = useCallback(
    (trackId) => (opener) => {
      if (opener) menuOpeners.current.set(trackId, opener);
      else menuOpeners.current.delete(trackId);
    },
    [],
  );

  const openMenuFor = useCallback((trackId, point) => {
    const opener = menuOpeners.current.get(trackId);
    if (opener && point) {
      opener(point);
      return;
    }
    if (point) return;
    const btn = menuButtonRefs.current.get(trackId);
    if (btn) btn.click();
  }, []);

  const startLongPress = useCallback(
    (event, trackId) => {
      if (event.pointerType && event.pointerType !== "touch") return;
      if (longPressTimers.current.has(trackId)) return;
      const x = event.clientX ?? event.touches?.[0]?.clientX ?? 0;
      const y = event.clientY ?? event.touches?.[0]?.clientY ?? 0;
      const timer = setTimeout(() => {
        openMenuFor(trackId, { x, y });
      }, 500);
      longPressTimers.current.set(trackId, timer);
    },
    [openMenuFor],
  );

  const cancelLongPress = useCallback((trackId) => {
    const timer = longPressTimers.current.get(trackId);
    if (timer) clearTimeout(timer);
    longPressTimers.current.delete(trackId);
  }, []);

  const contextMenuHandlers = useCallback(
    (trackId) => ({
      onContextMenu: (event) => {
        event.preventDefault();
        openMenuFor(trackId, { x: event.clientX, y: event.clientY });
      },
      onPointerDown: (event) => startLongPress(event, trackId),
      onPointerUp: () => cancelLongPress(trackId),
      onPointerLeave: () => cancelLongPress(trackId),
      onPointerMove: () => cancelLongPress(trackId),
      onPointerCancel: () => cancelLongPress(trackId),
    }),
    [openMenuFor, startLongPress, cancelLongPress],
  );

  const likedTrackIds = useMemo(() => {
    const liked = playlists.find((playlist) => playlist.id === LIKED_PLAYLIST_ID);
    return new Set(liked?.trackIds || []);
  }, [playlists]);

  const allPlaylistTrackIds = useMemo(() => {
    const ids = new Set();
    playlists.forEach((playlist) => {
      (playlist.trackIds || []).forEach((id) => ids.add(String(id)));
    });
    return ids;
  }, [playlists]);

  useEffect(() => {
    setIgnoredRecs((prev) => {
      if (!prev.length) return prev;
      const next = prev.filter((id) => !allPlaylistTrackIds.has(String(id)));
      return next.length === prev.length ? prev : next;
    });
  }, [allPlaylistTrackIds]);

  const isLiked = useCallback(
    (trackId) => likedTrackIds.has(trackId),
    [likedTrackIds],
  );

  const toggleLikeTrack = useCallback((trackId) => {
    const safeId = String(trackId || "");
    if (!safeId) return;
    setPlaylists((prev) =>
      ensureLikedPlaylist(prev).map((playlist) => {
        if (playlist.id !== LIKED_PLAYLIST_ID) return playlist;
        const trackIds = (playlist.trackIds || []).map((id) => String(id));
        const hasTrack = trackIds.includes(safeId);
        const nextIds = hasTrack
          ? trackIds.filter((id) => id !== safeId)
          : [...trackIds, safeId];
        return { ...playlist, trackIds: nextIds };
      }),
    );
  }, []);

  const isCurrent = useCallback(
    () => controller?.tracks?.[controller.index],
    [controller],
  );

  const isPlayingHere = useCallback(
    (track) => isCurrent()?.id === track.id && isPlaying,
    [isCurrent, isPlaying],
  );

  const onSort = (key) => {
    if (key === sortKey) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "releaseDate" ? "desc" : "asc");
    }
  };

  const buildActions = useCallback(
    (track) => {
      if (!track) return [];
      return [
        {
          label: "View info",
          onSelect: () => setDetailsOf(track),
        },
        {
          label: "Play",
          onSelect: () => playById?.(track.id),
        },
        {
          label: "Play next",
          onSelect: () => playNext?.(track.id),
        },
        {
          label: "View album",
          onSelect: () => {
            if (!track.album) return;
            const match = albums.find((album) => album.name === track.album);
            if (!match) return;
            setViewMode("albums");
            setDetailView({ type: "album", id: match.id, tracks: match.tracks });
          },
          disabled: !track.album || albums.length === 0,
        },
        {
          label: "View artist",
          onSelect: () => {
            if (!track.artist) return;
            setQuery(track.artist);
            setActiveGenre("");
          },
          disabled: !track.artist,
        },
        {
          id: "like",
          label: (
            <span className="trackMenu__itemLabel">
              Like
              <img
                src={isLiked(track.id) ? heartFilled : heartOutline}
                alt=""
                className={`trackMenu__likeIcon ${isLiked(track.id) ? "isActive" : ""}`}
              />
            </span>
          ),
          onSelect: () => toggleLikeTrack(track.id),
        },
        {
          label: "Add to playlist",
          onSelect: () => setPlaylistModalTrack(track),
        },
        {
          label: "Add to queue",
          onSelect: () => addToQueue?.(track.id),
        },
      ].filter(Boolean);
    },
    [
      addToQueue,
      playById,
      playNext,
      albums,
      isLiked,
      toggleLikeTrack,
      heartFilled,
      heartOutline,
    ],
  );

  const durationLabelFor = useCallback(
    (track) => track.length || track.duration || durations[track.id] || "--",
    [durations],
  );

  const activeDetail =
    detailView?.type === "album"
      ? albumsById.get(detailView.id)
      : detailView?.type === "playlist"
        ? playlistItems.find((item) => item.id === detailView.id)
        : null;

  const detailTracks = activeDetail?.tracks || [];
  const isPlaylistDetail = detailView?.type === "playlist";
  const isLikedDetail = isPlaylistDetail && activeDetail?.id === LIKED_PLAYLIST_ID;

  const playlistMeta = useMemo(() => {
    if (!isPlaylistDetail) return null;
    const genres = new Set();
    const albums = new Set();
    detailTracks.forEach((track) => {
      normalizeGenres(track).forEach((genre) => genres.add(genre));
      if (track.album) albums.add(track.album);
    });
    return { genres, albums };
  }, [detailTracks, isPlaylistDetail, normalizeGenres]);

  const recommendations = useMemo(() => {
    if (!isPlaylistDetail || isLikedDetail) return [];
    const playlistIds = new Set(detailTracks.map((track) => track.id));
    const ignoredSet = new Set(ignoredRecs.map((id) => String(id)));
    const candidates = catalog.filter(
      (track) =>
        !playlistIds.has(track.id) && !ignoredSet.has(String(track.id)),
    );
    if (!candidates.length) return [];

    const scored = candidates
      .map((track) => {
        let score = 0;
        if (playlistMeta?.albums?.has(track.album)) score += 2;
        normalizeGenres(track).forEach((genre) => {
          if (playlistMeta?.genres?.has(genre)) score += 1;
        });
        return { track, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return String(a.track.title || "").localeCompare(
          String(b.track.title || ""),
        );
      })
      .map((entry) => entry.track);

    if (scored.length) return scored.slice(0, RECOMMEND_COUNT);

    const featured = candidates.filter((track) => track.featured);
    if (featured.length) {
      return featured.slice(0, RECOMMEND_COUNT);
    }

    const seeded = [...candidates].sort((a, b) => {
      const aKey = `${activeDetail?.id || "playlist"}-${a.id}`;
      const bKey = `${activeDetail?.id || "playlist"}-${b.id}`;
      return hashString(aKey) - hashString(bKey);
    });
    return seeded.slice(0, RECOMMEND_COUNT);
  }, [
    activeDetail?.id,
    catalog,
    detailTracks,
    ignoredRecs,
    isLikedDetail,
    isPlaylistDetail,
    normalizeGenres,
    playlistMeta,
  ]);

  const showTrackList = viewMode === "tracks" || !!detailView;
  const showAlbumList = viewMode === "albums" && !detailView;
  const showPlaylistList = viewMode === "playlists" && !detailView;
  const searchPlaceholder =
    viewMode === "albums"
      ? "Search albums or artists"
      : viewMode === "playlists"
        ? "Search playlists"
        : "Search by Title, Artist or Album";

  const handleSelectAlbum = (album) => {
    setViewMode("albums");
    setDetailView({ type: "album", id: album.id, tracks: album.tracks });
  };

  const openAlbumByName = useCallback(
    (albumName) => {
      if (!albumName) return;
      const match = albums.find((album) => album.name === albumName);
      if (!match) return;
      setViewMode("albums");
      setDetailView({ type: "album", id: match.id, tracks: match.tracks });
    },
    [albums],
  );

  const handleSelectPlaylist = (playlist) => {
    setViewMode("playlists");
    setDetailView({
      type: "playlist",
      id: playlist.id,
      tracks: playlist.tracks || [],
    });
  };

  const playCollection = useCallback(
    (collectionTracks) => {
      if (!collectionTracks || collectionTracks.length === 0) return;
      const [first, ...rest] = collectionTracks;
      if (first?.id) playById?.(first.id);
      rest.forEach((track) => {
        if (track?.id) addToQueue?.(track.id);
      });
    },
    [addToQueue, playById],
  );

  const resetDetail = () => setDetailView(null);

  const handleCreatePlaylist = (name) => {
    const trimmed = String(name || "").trim();
    if (!trimmed) return null;
    const id = `pl-${slugify(trimmed)}-${Date.now()}`;
    const createdAt = new Date().toISOString();
    const newPlaylist = { id, name: trimmed, trackIds: [], createdAt };
    setPlaylists((prev) => [newPlaylist, ...prev]);
    return newPlaylist;
  };

  const renamePlaylist = useCallback(
    (playlistId) => {
      if (!playlistId || playlistId === LIKED_PLAYLIST_ID) return;
      const currentName =
        playlists.find((playlist) => playlist.id === playlistId)?.name || "";
      const nextName = window.prompt("Rename playlist", currentName);
      const trimmed = String(nextName || "").trim();
      if (!trimmed || trimmed === currentName) return;
      setPlaylists((prev) =>
        prev.map((playlist) =>
          playlist.id === playlistId
            ? { ...playlist, name: trimmed }
            : playlist,
        ),
      );
    },
    [playlists],
  );

  const deletePlaylist = useCallback((playlistId) => {
    if (!playlistId || playlistId === LIKED_PLAYLIST_ID) return;
    const ok = window.confirm("Delete this playlist?");
    if (!ok) return;
    setPlaylists((prev) =>
      prev.filter((playlist) => playlist.id !== playlistId),
    );
    if (detailView?.id === playlistId) setDetailView(null);
  }, [detailView?.id]);

  const addTrackToPlaylist = (playlistId, trackId) => {
    if (!trackId) return;
    const safeId = String(trackId);
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id !== playlistId) return playlist;
        const nextIds = Array.from(
          new Set([...(playlist.trackIds || []), safeId]),
        );
        return { ...playlist, trackIds: nextIds };
      }),
    );
    if (detailView?.type === "playlist" && detailView.id === playlistId) {
      setDetailView((prev) => {
        if (!prev) return prev;
        const exists = (prev.tracks || []).some((track) => track.id === safeId);
        if (exists) return prev;
        const match = catalog.find((track) => track.id === safeId);
        if (!match) return prev;
        return { ...prev, tracks: [...(prev.tracks || []), match] };
      });
    }
  };

  const handlePlaylistSubmit = () => {
    const created = handleCreatePlaylist(playlistDraft);
    if (created) {
      setPlaylistDraft("");
      setShowPlaylistForm(false);
    }
  };

  const ignoreRecommendation = useCallback((trackId) => {
    const safeId = String(trackId || "");
    if (!safeId) return;
    setIgnoredRecs((prev) =>
      prev.includes(safeId) ? prev : [...prev, safeId],
    );
  }, []);

  const addRecommendationToPlaylist = useCallback(
    (trackId) => {
      if (!isPlaylistDetail || !activeDetail?.id) return;
      addTrackToPlaylist(activeDetail.id, trackId);
    },
    [activeDetail?.id, addTrackToPlaylist, isPlaylistDetail],
  );

  const playRecommendedFrom = useCallback(
    (trackId) => {
      if (!recommendations.length) return;
      const recIds = recommendations.map((track) => track.id);
      const start = recIds.indexOf(trackId);
      const ordered = start >= 0 ? recIds.slice(start) : recIds;
      playSequence?.(ordered);
    },
    [playSequence, recommendations],
  );

  const playlistMenuActions = useMemo(() => {
    if (!isPlaylistDetail || isLikedDetail) return [];
    const playlistIds = detailTracks.map((track) => track.id);
    const recIds = recommendations.map((track) => track.id);
    return [
      {
        label: "Play playlist",
        onSelect: () => {
          const sequence = [...playlistIds, ...recIds];
          if (sequence.length) playSequence?.(sequence);
        },
      },
      {
        label: "Add playlist to queue",
        onSelect: () => {
          playlistIds.forEach((id) => addToQueue?.(id));
          recIds.forEach((id) => addToQueue?.(id));
        },
      },
      {
        label: "Rename playlist",
        onSelect: () => renamePlaylist(activeDetail?.id),
      },
      {
        label: "Delete playlist",
        onSelect: () => deletePlaylist(activeDetail?.id),
      },
    ];
  }, [
    addToQueue,
    activeDetail?.id,
    deletePlaylist,
    detailTracks,
    isLikedDetail,
    isPlaylistDetail,
    playSequence,
    recommendations,
    renamePlaylist,
  ]);
  return (
    <section
      className={`library ${
        showAlbumList || showPlaylistList ? "library--gridView" : ""
      }`.trim()}
    >
      <div className="library__content">
        <div className="library__header">
          <div className={`library__headerTop ${detailView ? "isDetail" : ""}`}>
            <div className="library__headerLeft">
              {!detailView ? <h1>Library</h1> : null}
              {detailView ? (
                <div className="libraryBreadcrumb" aria-label="Breadcrumb">
                  <button
                    type="button"
                    className="crumbLink"
                    onClick={() => {
                      setDetailView(null);
                      setViewMode("tracks");
                    }}
                  >
                    Library
                  </button>
                  <span className="crumbSep">/</span>
                  <button
                    type="button"
                    className="crumbLink"
                    onClick={() => {
                      setDetailView(null);
                      setViewMode(
                        detailView.type === "album" ? "albums" : "playlists",
                      );
                    }}
                  >
                    {detailView.type === "album" ? "Album" : "Playlist"}
                  </button>
                  {activeDetail?.name ? (
                    <>
                      <span className="crumbSep">/</span>
                      <span className="crumbCurrent">{activeDetail.name}</span>
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
            {detailView ? (
              <button
                type="button"
                className="crumbBack"
                onClick={resetDetail}
                aria-label={`Back to ${viewMode === "albums" ? "albums" : "playlists"}`}
                title={`Back to ${viewMode === "albums" ? "albums" : "playlists"}`}
              >
                <img src={backIcon} alt="" />
              </button>
            ) : null}
          </div>

          {!detailView ? (
            <div className="filtersRow">
              <div className="libraryTabsRow">
                <div className="libraryTabs">
                  <button
                    type="button"
                    className={`chip ${viewMode === "tracks" ? "isActive" : ""}`}
                    onClick={() => {
                      setViewMode("tracks");
                      resetDetail();
                    }}
                  >
                    Tracks
                  </button>
                  <button
                    type="button"
                    className={`chip ${viewMode === "albums" ? "isActive" : ""}`}
                    onClick={() => {
                      setViewMode("albums");
                      resetDetail();
                    }}
                  >
                    Albums
                  </button>
                  <button
                    type="button"
                    className={`chip ${viewMode === "playlists" ? "isActive" : ""}`}
                    onClick={() => {
                      setViewMode("playlists");
                      resetDetail();
                    }}
                  >
                    Playlists
                  </button>
                </div>
              </div>

              <div className="searchBox">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label="Search library"
                />
              </div>

              {showTrackList ? (
                <div className="genreControls">
                  <button
                    type="button"
                    className="chip genreToggle"
                    aria-expanded={showGenres}
                    aria-controls="genreChips"
                    onClick={() => setShowGenres((v) => !v)}
                  >
                    {showGenres ? "Hide genres" : "Genres"}
                  </button>
                  {activeGenre ? (
                    <button
                      type="button"
                      className="chip isActive"
                      title="Clear genre filter"
                      onClick={() => setActiveGenre("")}
                    >
                      {activeGenre} x
                    </button>
                  ) : null}
                </div>
              ) : null}

              {showGenres && showTrackList ? (
                <div className="genreChips" id="genreChips">
                  <button
                    className={`chip ${!activeGenre ? "isActive" : ""}`}
                    onClick={() => setActiveGenre("")}
                  >
                    All
                  </button>
                  {allGenres.map((genre) => (
                    <button
                      key={genre}
                      className={`chip ${activeGenre === genre ? "isActive" : ""}`}
                      onClick={() => setActiveGenre(genre)}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="library__body">
        {detailView ? (
          <div className="collectionDetail">
            <div
              className="collectionDetail__header"
              onContextMenu={
                isPlaylistDetail && !isLikedDetail
                  ? openPlaylistMenuAt
                  : undefined
              }
            >
              <div className="collectionDetail__cover">
                <img
                  src={activeDetail?.cover || FALLBACK_COVER}
                  alt=""
                  className="collectionDetail__image"
                />
              </div>
              <div className="collectionDetail__meta">
                <span className="collectionTag">
                  {detailView.type === "album" ? "Album" : "Playlist"}
                </span>
                <div className="collectionDetail__info">
                  <h2>{activeDetail?.name || "--"}</h2>
                  <div className="collectionDetail__sub">
                    {detailView.type === "album"
                      ? activeDetail?.artist
                      : `${detailTracks.length} tracks`}
                    <span className="dot">|</span>
                    <span>{fmtDate(activeDetail?.releaseDate)}</span>
                  </div>
                </div>
              </div>
              {isPlaylistDetail && !isLikedDetail ? (
                <div className="collectionDetail__menu">
                  <TrackActionsMenu
                    track={activeDetail}
                    actions={playlistMenuActions}
                    triggerClassName="collectionDetail__menuTrigger"
                    size="sm"
                    align="right"
                    label="Playlist options"
                    registerOpenAt={registerPlaylistMenuOpenAt}
                  />
                </div>
              ) : null}
            </div>
            {detailView.type === "playlist" && detailTracks.length === 0 ? (
              <div className="collectionDetail__empty">
                This playlist is empty. Add some songs to get started.
              </div>
            ) : null}
          </div>
        ) : null}

          {showTrackList ? (
            isMobile ? (
              <div
                className={`library__mobileList ${
                  detailView?.type === "playlist"
                    ? "library__mobileList--playlist"
                    : ""
                }`.trim()}
              >
                {sortedTracks.map((track) => {
                  const playing = isPlayingHere(track);
                  return (
                    <div
                      key={track.id}
                      ref={(el) => rowRefs.current.set(track.id, el)}
                      className={`libCard ${playing ? "isPlaying" : ""}`}
                      {...contextMenuHandlers(track.id)}
                      onDoubleClick={() => playById?.(track.id)}
                    >
                      <button
                        type="button"
                        className="libCard__coverBtn"
                        onClick={() => playById?.(track.id)}
                        aria-label={playing ? "Pause" : "Play"}
                      >
                        {track.cover?.src ? (
                          <img
                            className="libCard__cover"
                            src={track.cover.src}
                            alt=""
                          />
                        ) : (
                          <div className="libCard__cover libCard__cover--placeholder" />
                        )}
                        <span className="libCard__overlay">
                          <img src={playing ? pauseIcon : playIcon} alt="" />
                        </span>
                      </button>

                      <div className="libCard__meta">
                        <div className="libCard__title">{track.title}</div>
                        <div className="libCard__artist">{track.artist}</div>
                        {!detailView ? (
                          <div className="libCard__genres">
                            {normalizeGenres(track).join(", ")}
                          </div>
                        ) : null}
                      </div>

                      <TrackActionsMenu
                        track={track}
                        actions={buildActions(track)}
                        triggerClassName="libCard__more"
                        size="sm"
                        align="right"
                        triggerRef={setMenuRef(track.id)}
                        registerOpenAt={registerMenuOpenAt(track.id)}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="tableWrap">
                <table className="trackTable">
                  <thead>
                    <tr>
                      <th aria-label="Cover" />
                      <th onClick={() => onSort("title")}> 
                        Title {sortKey === "title" && <SortArrow dir={sortDir} />}
                      </th>
                      <th onClick={() => onSort("artist")}> 
                        Artist{" "}
                        {sortKey === "artist" && <SortArrow dir={sortDir} />}
                      </th>
                      <th onClick={() => onSort("album")}> 
                        Album {sortKey === "album" && <SortArrow dir={sortDir} />}
                      </th>
                      <th onClick={() => onSort("genre")}> 
                        Genre {sortKey === "genre" && <SortArrow dir={sortDir} />}
                      </th>
                      <th onClick={() => onSort("releaseDate")}> 
                        Release Date{" "}
                        {sortKey === "releaseDate" && <SortArrow dir={sortDir} />}
                      </th>
                      <th>Length</th>
                      <th aria-label="Actions" />
                    </tr>
                  </thead>

                  <tbody>
                    {sortedTracks.map((track) => {
                      const playing = isPlayingHere(track);
                      const coverSrc = track.cover?.src || FALLBACK_COVER;
                      const lengthStr = durationLabelFor(track);
                      return (
                        <tr
                          key={track.id}
                          ref={(el) => rowRefs.current.set(track.id, el)}
                          className={playing ? "isPlaying" : ""}
                          {...contextMenuHandlers(track.id)}
                          onDoubleClick={() => playById?.(track.id)}
                        >
                          <td>
                            <button
                              className="coverBtn"
                              onClick={() => playById?.(track.id)}
                              aria-label={playing ? "Pause" : "Play"}
                              title={playing ? "Pause" : "Play"}
                            >
                              <img className="coverImg" src={coverSrc} alt="" />
                              <span className="coverOverlay">
                                <img src={playing ? pauseIcon : playIcon} alt="" />
                              </span>
                            </button>
                          </td>

                          <td className="cellTitle">{track.title}</td>
                          <td className="cellArtist">{track.artist}</td>
                        <td>
                          {track.album ? (
                            <button
                              type="button"
                              className="cellAlbumLink"
                              onClick={() => openAlbumByName(track.album)}
                            >
                              {track.album}
                            </button>
                          ) : (
                            "--"
                          )}
                        </td>
                          <td>{normalizeGenres(track).join(", ") || "--"}</td>
                          <td>{fmtDate(track.releaseDate)}</td>
                          <td>{lengthStr}</td>

                          <td className="cellInfo">
                          <TrackActionsMenu
                            track={track}
                            actions={buildActions(track)}
                            triggerClassName="cellInfo__trigger"
                            size="sm"
                            triggerRef={setMenuRef(track.id)}
                            registerOpenAt={registerMenuOpenAt(track.id)}
                          />
                        </td>
                      </tr>
                    );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : null}

        {isPlaylistDetail && !isLikedDetail ? (
          <div className="recommendSection">
              <div className="recommendHeader">Recommended for this playlist</div>
              {recommendations.length ? (
                isMobile ? (
                  <div className="recommendList">
                    {recommendations.map((track) => {
                      const playing = isPlayingHere(track);
                      return (
                        <div
                          key={track.id}
                          className={`libCard libCard--recommend ${
                            playing ? "isPlaying" : ""
                          }`}
                        >
                          <button
                            type="button"
                            className="libCard__coverBtn"
                            onClick={() => playRecommendedFrom(track.id)}
                            aria-label={playing ? "Pause" : "Play"}
                          >
                            {track.cover?.src ? (
                              <img
                                className="libCard__cover"
                                src={track.cover.src}
                                alt=""
                              />
                            ) : (
                              <div className="libCard__cover libCard__cover--placeholder" />
                            )}
                            <span className="libCard__overlay">
                              <img src={playing ? pauseIcon : playIcon} alt="" />
                            </span>
                          </button>

                          <div className="libCard__meta">
                            <div className="libCard__title">{track.title}</div>
                            <div className="libCard__artist">{track.artist}</div>
                          </div>

                          <div className="recommendActions">
                            <button
                              type="button"
                              className="recommendAction recommendAction--ignore"
                              onClick={() => ignoreRecommendation(track.id)}
                              aria-label="Ignore recommendation"
                              title="Ignore"
                            >
                              -
                            </button>
                            <button
                              type="button"
                              className="recommendAction recommendAction--add"
                              onClick={() =>
                                addRecommendationToPlaylist(track.id)
                              }
                              aria-label="Add to playlist"
                              title="Add to playlist"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="tableWrap tableWrap--recommend">
                    <table className="trackTable trackTable--recommend">
                      <thead>
                        <tr>
                          <th aria-label="Cover" />
                          <th>Title</th>
                          <th>Artist</th>
                          <th>Album</th>
                          <th>Genre</th>
                          <th>Release Date</th>
                          <th>Length</th>
                          <th aria-label="Actions" />
                        </tr>
                      </thead>
                      <tbody>
                        {recommendations.map((track) => {
                          const playing = isPlayingHere(track);
                          const coverSrc = track.cover?.src || FALLBACK_COVER;
                          const lengthStr = durationLabelFor(track);
                          return (
                            <tr
                              key={track.id}
                              className={playing ? "isPlaying" : ""}
                              onDoubleClick={() =>
                                playRecommendedFrom(track.id)
                              }
                            >
                              <td>
                                <button
                                  className="coverBtn"
                                  onClick={() => playRecommendedFrom(track.id)}
                                  aria-label={playing ? "Pause" : "Play"}
                                  title={playing ? "Pause" : "Play"}
                                >
                                  <img
                                    className="coverImg"
                                    src={coverSrc}
                                    alt=""
                                  />
                                  <span className="coverOverlay">
                                    <img
                                      src={playing ? pauseIcon : playIcon}
                                      alt=""
                                    />
                                  </span>
                                </button>
                              </td>
                              <td className="cellTitle">{track.title}</td>
                              <td className="cellArtist">{track.artist}</td>
                              <td>{track.album || "--"}</td>
                              <td>{normalizeGenres(track).join(", ") || "--"}</td>
                              <td>{fmtDate(track.releaseDate)}</td>
                              <td>{lengthStr}</td>
                              <td className="recommendCell">
                                <div className="recommendActions">
                                  <button
                                    type="button"
                                    className="recommendAction recommendAction--ignore"
                                    onClick={() =>
                                      ignoreRecommendation(track.id)
                                    }
                                    aria-label="Ignore recommendation"
                                    title="Ignore"
                                  >
                                    -
                                  </button>
                                  <button
                                    type="button"
                                    className="recommendAction recommendAction--add"
                                    onClick={() =>
                                      addRecommendationToPlaylist(track.id)
                                    }
                                    aria-label="Add to playlist"
                                    title="Add to playlist"
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                <div className="recommendEmpty">
                  I don&apos;t have any more songs but will hopefully release new
                  stuff soon.
                </div>
              )}
            </div>
          ) : null}
        </div>

        {showAlbumList ? (
          <div className="collectionGrid">
            {filteredAlbums.map((album) => (
                <div
                  key={album.id}
                  className="collectionCard"
                  onClick={() => handleSelectAlbum(album)}
                  role="button"
                  tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleSelectAlbum(album);
                }}
              >
                <button
                  type="button"
                  className="collectionCard__coverBtn"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleSelectAlbum(album);
                  }}
                  aria-label={`Play ${album.name}`}
                >
                  <img
                    className="collectionCard__cover"
                    src={album.cover || FALLBACK_COVER}
                    alt=""
                  />
                </button>
                <div className="collectionCard__body">
                  <div className="collectionCard__title">{album.name}</div>
                  <div className="collectionCard__subtitle">
                    {fmtYear(album.releaseDate)} · {album.artist || "--"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {showPlaylistList ? (
          <div className="playlistSection">
            <div className="playlistHeader">
              {showPlaylistForm ? (
                <div className="playlistForm">
                  <input
                    type="text"
                    placeholder="New playlist name"
                    value={playlistDraft}
                    onChange={(event) => setPlaylistDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") handlePlaylistSubmit();
                    }}
                  />
                  <button
                    type="button"
                    className="chip isActive"
                    onClick={handlePlaylistSubmit}
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    className="chip"
                    onClick={() => {
                      setShowPlaylistForm(false);
                      setPlaylistDraft("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="chip isActive"
                  onClick={() => setShowPlaylistForm(true)}
                >
                  New playlist
                </button>
              )}
            </div>

            <div className="collectionGrid">
              {filteredPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  className={`collectionCard ${playlist.id === LIKED_PLAYLIST_ID ? "collectionCard--liked" : ""}`}
                  onClick={() => handleSelectPlaylist(playlist)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleSelectPlaylist(playlist);
                  }}
                >
                  <button
                    type="button"
                    className="collectionCard__coverBtn"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleSelectPlaylist(playlist);
                    }}
                    aria-label={`Play ${playlist.name}`}
                  >
                    <img
                      className="collectionCard__cover"
                      src={playlist.cover || FALLBACK_COVER}
                      alt=""
                    />
                    {playlist.id === LIKED_PLAYLIST_ID ? (
                      <span className="likedOverlay" aria-hidden>
                        <img src={heartOutline} alt="" />
                      </span>
                    ) : null}
                  </button>
                  <div className="collectionCard__body">
                    <div className="collectionCard__title">
                      {playlist.name}
                      {playlist.id === LIKED_PLAYLIST_ID ? (
                        <img src={heartFilled} alt="" />
                      ) : null}
                    </div>
                    <div className="collectionCard__subtitle">
                      {fmtYear(playlist.releaseDate)} · Playlist
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <TrackDetailsModal
        track={detailsOf}
        onClose={() => setDetailsOf(null)}
        durationLabel={detailsOf ? durationLabelFor(detailsOf) : undefined}
        normalizeGenres={normalizeGenres}
        fmtDate={fmtDate}
      />

      {playlistModalTrack ? (
        <div className="modalBackdrop" role="dialog" aria-modal="true">
          <div className="modalCard playlistModal">
            <button
              type="button"
              className="modalClose"
              onClick={() => {
                setPlaylistModalTrack(null);
                setPlaylistModalDraft("");
              }}
              aria-label="Close"
            >
              x
            </button>
            <div className="playlistModal__header">
              <h2>Add to playlist</h2>
              <p>{playlistModalTrack.title}</p>
            </div>
            <div className="playlistModal__body">
              <div className="playlistModal__create">
                <input
                  type="text"
                  placeholder="New playlist name"
                  value={playlistModalDraft}
                  onChange={(event) =>
                    setPlaylistModalDraft(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      const created = handleCreatePlaylist(
                        playlistModalDraft,
                      );
                      if (created) {
                        addTrackToPlaylist(
                          created.id,
                          playlistModalTrack.id,
                        );
                        setPlaylistModalTrack(null);
                        setPlaylistModalDraft("");
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  className="chip isActive"
                  onClick={() => {
                    const created = handleCreatePlaylist(playlistModalDraft);
                    if (created) {
                      addTrackToPlaylist(created.id, playlistModalTrack.id);
                      setPlaylistModalTrack(null);
                      setPlaylistModalDraft("");
                    }
                  }}
                >
                  Create & Add
                </button>
              </div>
              <div className="playlistModal__list">
                {playlistItems.length ? (
                  playlistItems.map((playlist) => (
                    <button
                      key={playlist.id}
                      type="button"
                      className="playlistPick"
                      onClick={() => {
                        addTrackToPlaylist(playlist.id, playlistModalTrack.id);
                        setPlaylistModalTrack(null);
                        setPlaylistModalDraft("");
                      }}
                    >
                      <span>{playlist.name}</span>
                      <span className="playlistPick__meta">
                        {playlist.trackCount} tracks
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="playlistEmpty">No playlists yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
function SortArrow({ dir }) {
  return (
    <span className={`sortBadge ${dir === "asc" ? "isAsc" : "isDesc"}`}>
      <img src={chevronIcon} alt="" className="sortBadge__icon" />
    </span>
  );
}

function fmtDate(iso) {
  if (!iso) return "--";
  const d = new Date(iso);
  if (Number.isNaN(+d)) return "--";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function fmtYear(iso) {
  if (!iso) return "--";
  const d = new Date(iso);
  if (Number.isNaN(+d)) return "--";
  return String(d.getFullYear());
}

function fmtTimeFromSeconds(totalSec) {
  const s = Math.max(0, Math.round(totalSec || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

function latestIsoDate(base, candidate) {
  const baseTime = base ? new Date(base).getTime() : 0;
  const candTime = candidate ? new Date(candidate).getTime() : 0;
  if (!baseTime && !candTime) return base || candidate || null;
  if (candTime >= baseTime) return candidate;
  return base;
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function hashString(value) {
  const str = String(value || "");
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function readStoredPlaylists(key) {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        id: item.id,
        name: item.name,
        trackIds: Array.isArray(item.trackIds)
          ? item.trackIds.map((id) => String(id))
          : [],
        createdAt: item.createdAt || new Date().toISOString(),
      }))
      .filter((item) => item.id && item.name);
  } catch {
    return [];
  }
}

function readStoredIgnoredRecommendations(key) {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((id) => String(id)).filter(Boolean);
  } catch {
    return [];
  }
}

function ensureLikedPlaylist(playlists) {
  const list = Array.isArray(playlists)
    ? playlists.map((playlist) => ({
        ...playlist,
        trackIds: Array.isArray(playlist.trackIds)
          ? playlist.trackIds.map((id) => String(id))
          : [],
      }))
    : [];
  const idx = list.findIndex((playlist) => playlist.id === LIKED_PLAYLIST_ID);
  if (idx >= 0) {
    const liked = list[idx];
    list[idx] = {
      ...liked,
      name: LIKED_PLAYLIST_NAME,
      createdAt: liked.createdAt || new Date().toISOString(),
    };
    return list;
  }
  return [
    {
      id: LIKED_PLAYLIST_ID,
      name: LIKED_PLAYLIST_NAME,
      trackIds: [],
      createdAt: new Date().toISOString(),
    },
    ...list,
  ];
}
