const STORAGE_KEY = "calisthenics_ranked_prev_positions_v1";
const PROFILE_STORAGE_KEY = "calisthenics_ranked_profiles_v1";
const SESSION_STORAGE_KEY = "calisthenics_ranked_session_v1";
const ATHLETES_DB_PATH = "data/athletes-db.json";
const VIDEO_LOCK_MS = 30 * 24 * 60 * 60 * 1000;
const PHOTO_MAX_BYTES = 1.5 * 1024 * 1024;
const SUPABASE_DEFAULT_CONFIG = {
  url: "",
  anonKey: "",
  table: "athletes",
};
const SUPABASE_CONFIG = window.CALI_SUPABASE_CONFIG || SUPABASE_DEFAULT_CONFIG;
const SUPABASE_URL = String(SUPABASE_CONFIG.url || "").trim();
const SUPABASE_ANON_KEY = String(SUPABASE_CONFIG.anonKey || "").trim();
const SUPABASE_TABLE = String(SUPABASE_CONFIG.table || SUPABASE_DEFAULT_CONFIG.table).trim() || SUPABASE_DEFAULT_CONFIG.table;
const SUPABASE_AVAILABLE = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase?.createClient);

const LANG = (document.documentElement.lang || "en").toLowerCase().startsWith("es") ? "es" : "en";

const I18N = {
  en: {
    position: "Position",
    athlete: "Athlete",
    state: "State",
    up: "Moved up",
    tie: "Tie",
    pointsSuffix: "pts",
    myCardGuestName: "Create your athlete profile",
    myCardGuestMeta: "Sign in and submit your profile for review",
    myCardDraftMeta: "Draft profile. Click to edit.",
    myCardPendingMeta: "Pending verification. You will appear after approval.",
    myCardVerifiedMeta: "Verified profile.",
    badgeEdit: "EDIT",
    badgeDraft: "DRAFT",
    badgePending: "PENDING",
    badgeVerified: "VERIFIED",
    notSet: "Not set",
    photoReady: "Ready",
    sessionPrefix: "Session",
    statusPrefix: "Status",
    statusDraft: "Draft",
    statusPending: "Pending verification",
    statusVerified: "Verified",
    videoUnlocked: "Video can be changed now.",
    videoLockedPrefix: "Video locked until",
    authInvalidEmail: "Enter a valid email.",
    messageSaved: "Saved.",
    messageSavedLocal: "Saved locally. Could not sync with server.",
    messageSaveError: "Could not save changes.",
    messageNeedName: "Add your name first.",
    messageNeedVideo: "Add a video URL or upload a video file first.",
    messageNeedTerms: "Accept terms before sending for verification.",
    messageSent: "Profile sent for verification.",
    messageSignedOut: "Session closed.",
    messageServerUnavailable: "Could not connect to Supabase. Check your config and network.",
    messageVideoLocked: "You can only change video once every 30 days.",
    messagePhotoTooLarge: "Photo is too large. Maximum size is 1.5MB.",
    messagePhotoInvalid: "Select a valid image file.",
    messagePhotoMissing: "Choose an image file first.",
    messageVideoMissing: "Add a video URL or select a video file.",
    messageProfileCreated: "Profile ready. Complete your fields and send for verification.",
    messageProfileLoadError: "Could not load your profile from Supabase. Local draft loaded.",
    fieldPhotoTitle: "Edit profile photo",
    fieldPhotoHelp: "Upload JPG or PNG up to 1.5MB.",
    fieldNameTitle: "Edit name",
    fieldNamePlaceholder: "Athlete name",
    fieldProfileLinkTitle: "Edit social or website link",
    fieldProfileLinkPlaceholder: "https://...",
    fieldVideoTitle: "Edit video",
    fieldVideoPlaceholder: "https://...",
    fieldVideoHelp: "Paste a video URL or upload a file for review.",
    videoFilePrefix: "File",
    linkPrefix: "Link",
    positionPrefix: "Position",
  },
  es: {
    position: "Posición",
    athlete: "Atleta",
    state: "Estado",
    up: "Subió",
    tie: "Empate",
    pointsSuffix: "pts",
    myCardGuestName: "Crea tu perfil de atleta",
    myCardGuestMeta: "Inicia sesión y envía tu perfil a revisión",
    myCardDraftMeta: "Perfil en borrador. Haz clic para editar.",
    myCardPendingMeta: "Pendiente de verificación. Aparecerás al aprobarse.",
    myCardVerifiedMeta: "Perfil verificado.",
    badgeEdit: "EDITAR",
    badgeDraft: "BORRADOR",
    badgePending: "PENDIENTE",
    badgeVerified: "VERIFICADO",
    notSet: "Sin configurar",
    photoReady: "Lista",
    sessionPrefix: "Sesión",
    statusPrefix: "Estado",
    statusDraft: "Borrador",
    statusPending: "Pendiente de verificación",
    statusVerified: "Verificado",
    videoUnlocked: "El video puede cambiarse ahora.",
    videoLockedPrefix: "Video bloqueado hasta",
    authInvalidEmail: "Introduce un correo válido.",
    messageSaved: "Guardado.",
    messageSavedLocal: "Guardado en local. No se pudo sincronizar con el servidor.",
    messageSaveError: "No se pudieron guardar los cambios.",
    messageNeedName: "Añade primero tu nombre.",
    messageNeedVideo: "Añade una URL de video o sube un archivo de video.",
    messageNeedTerms: "Acepta los términos antes de enviar a verificación.",
    messageSent: "Perfil enviado a verificación.",
    messageSignedOut: "Sesión cerrada.",
    messageServerUnavailable: "No se pudo conectar con Supabase. Revisa la configuración y la red.",
    messageVideoLocked: "Solo puedes cambiar el video una vez cada 30 días.",
    messagePhotoTooLarge: "La foto es demasiado grande. Máximo 1.5MB.",
    messagePhotoInvalid: "Selecciona una imagen válida.",
    messagePhotoMissing: "Elige primero un archivo de imagen.",
    messageVideoMissing: "Añade una URL de video o selecciona un archivo de video.",
    messageProfileCreated: "Perfil listo. Completa tus campos y envíalo a verificación.",
    messageProfileLoadError: "No se pudo cargar tu perfil desde Supabase. Se cargó el borrador local.",
    fieldPhotoTitle: "Editar foto de perfil",
    fieldPhotoHelp: "Sube JPG o PNG hasta 1.5MB.",
    fieldNameTitle: "Editar nombre",
    fieldNamePlaceholder: "Nombre del atleta",
    fieldProfileLinkTitle: "Editar enlace de red social o web",
    fieldProfileLinkPlaceholder: "https://...",
    fieldVideoTitle: "Editar video",
    fieldVideoPlaceholder: "https://...",
    fieldVideoHelp: "Pega una URL de video o sube un archivo para revisión.",
    videoFilePrefix: "Archivo",
    linkPrefix: "Enlace",
    positionPrefix: "Posición",
  }
};

const TEXT = I18N[LANG];

const baseAthletes = [
  {
    id: 1,
    name: "paracu",
    points: 5 + 3 + 2 + 3 + 2,
    photo: "photos/paracu.jpeg",
    socials: {
      instagram: "https://www.instagram.com/paracu.sw/",
      youtube: "https://youtube.com/@paracu_sw?si=YCiXktwlxgzpzq3P",
      tiktok: "https://www.tiktok.com/@user691637720?_r=1&_t=ZN-942DjwGJtcU"
    },
    videoUrl: "https://www.instagram.com/reel/DPQelW6jZ55/?igsh=MWo2eWRubGJlN2N5cg==",
    videoDuration: "0:20",
  },
];

const $list = document.getElementById("athletesList");
const $search = document.getElementById("searchInput");

const $statTotal = document.getElementById("statTotal");
const $statUps = document.getElementById("statUps");
const $statTies = document.getElementById("statTies");

const $overlay = document.getElementById("modalOverlay");
const $modalClose = document.getElementById("modalClose");
const $modalTitle = document.getElementById("modalTitle");
const $modalPhoto = document.getElementById("modalPhoto");
const $modalPoints = document.getElementById("modalPoints");
const $modalDuration = document.getElementById("modalDuration");
const $modalVideo = document.getElementById("modalVideo");
const $modalAthleteInfo = document.getElementById("modalAthleteInfo");

const $myAthleteCard = document.getElementById("myAthleteCard");
const $myAthleteRank = document.getElementById("myAthleteRank");
const $myAthleteName = document.getElementById("myAthleteName");
const $myAthleteMeta = document.getElementById("myAthleteMeta");
const $myAthleteState = document.getElementById("myAthleteState");
const $myAthleteOverlayText = document.getElementById("myAthleteOverlayText");

const $profileOverlay = document.getElementById("profileOverlay");
const $profileClose = document.getElementById("profileClose");
const $profileAuthStep = document.getElementById("profileAuthStep");
const $profileEditStep = document.getElementById("profileEditStep");
const $profileEmailInput = document.getElementById("profileEmailInput");
const $profileLoginBtn = document.getElementById("profileLoginBtn");
const $profileSessionLine = document.getElementById("profileSessionLine");
const $profileTermsInput = document.getElementById("profileTermsInput");
const $profileStatusLine = document.getElementById("profileStatusLine");
const $profileVideoLockLine = document.getElementById("profileVideoLockLine");
const $profileMessage = document.getElementById("profileMessage");
const $profileSendBtn = document.getElementById("profileSendBtn");
const $profileLogoutBtn = document.getElementById("profileLogoutBtn");

const $profilePhotoValue = document.getElementById("profilePhotoValue");
const $profileNameValue = document.getElementById("profileNameValue");
const $profileLinkValue = document.getElementById("profileLinkValue");
const $profileVideoValue = document.getElementById("profileVideoValue");

let ranked = [];
let query = "";
let prevPositions = loadPrevPositions();
let renderLimit = 50;
let lastFilteredCacheKey = "";
let filteredCache = [];
let profiles = loadProfiles();
let sessionEmail = loadSessionEmail();
let fileAthletes = [];
let supabaseClient = createSupabaseClient();

function norm(s) {
  return (s ?? "").toString().trim().toLowerCase();
}

function normalizeEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  if (!email || !email.includes("@") || email.startsWith("@") || email.endsWith("@")) return "";
  return email;
}

function nowIso() {
  return new Date().toISOString();
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString(LANG === "es" ? "es-ES" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function safeHostname(value) {
  try {
    const url = new URL(value);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
}

function shortText(value, max = 32) {
  const text = String(value || "");
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

function parseScore(value) {
  if (value === null || value === undefined) return null;
  const normalized = String(value).replace(",", ".").trim();
  if (!normalized) return null;
  const score = Number(normalized);
  if (!Number.isFinite(score)) return null;
  return score;
}

function createSupabaseClient() {
  if (!SUPABASE_AVAILABLE) return null;
  try {
    return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch {
    return null;
  }
}

function hasSupabase() {
  return Boolean(supabaseClient);
}

function normalizeProfileStatus(value) {
  if (value === "verified" || value === "pending") return value;
  return "draft";
}

function mapSupabaseRowToProfile(row, fallbackEmail) {
  const email = normalizeEmail(row?.email || fallbackEmail);
  if (!email) return null;

  const profile = buildDefaultProfile(email);
  profile.name = String(row?.name || "").trim();
  profile.photoData = String(row?.photo_url ?? row?.photoData ?? "").trim();
  profile.profileLink = String(row?.profile_link ?? row?.profileLink ?? "").trim();
  profile.videoUrl = String(row?.video_url ?? row?.videoUrl ?? "").trim();
  profile.videoFileName = String(row?.video_file_name ?? row?.videoFileName ?? "").trim();
  profile.videoDuration = String(row?.video_duration ?? row?.videoDuration ?? "—").trim() || "—";
  profile.videoUpdatedAt = row?.video_updated_at ?? row?.videoUpdatedAt ?? null;
  profile.termsAccepted = Boolean(row?.terms_accepted ?? row?.termsAccepted);
  profile.status = normalizeProfileStatus(row?.status);
  profile.submittedAt = row?.submitted_at ?? row?.submittedAt ?? null;
  profile.verifiedAt = row?.verified_at ?? row?.verifiedAt ?? null;
  profile.updatedAt = row?.updated_at ?? row?.updatedAt ?? profile.updatedAt;
  profile.points = parseScore(row?.score) ?? profile.points;
  return profile;
}

function mapProfileToSupabaseRow(profile) {
  return {
    email: profile.email,
    name: profile.name || "",
    photo_url: profile.photoData || "",
    profile_link: profile.profileLink || "",
    video_url: profile.videoUrl || "",
    video_file_name: profile.videoFileName || "",
    video_duration: profile.videoDuration || "—",
    video_updated_at: profile.videoUpdatedAt || null,
    terms_accepted: Boolean(profile.termsAccepted),
    status: normalizeProfileStatus(profile.status),
    submitted_at: profile.submittedAt || null,
    verified_at: profile.verifiedAt || null,
    updated_at: nowIso(),
  };
}

function normalizeDbAthlete(row, index) {
  if (!row || typeof row !== "object") return null;

  const score = parseScore(row.score ?? row.points ?? row.puntuacion ?? row.puntuación);
  if (score === null) return null;

  const name = String(row.name ?? row.nombre ?? "").trim();
  if (!name) return null;

  const email = normalizeEmail(row.email ?? row.correo ?? "");
  const rawId = String(row.id ?? email ?? `${name}-${index}`).trim();

  const photo = String(row.photo ?? row.photo_url ?? row.photoUrl ?? row.foto ?? "").trim();
  const profileLink = String(
    row.profileLink ??
    row.profile_link ??
    row.link ??
    row.website ??
    row.web ??
    row.social ??
    row.red ??
    ""
  ).trim();
  const videoUrl = String(
    row.videoUrl ??
    row.video_url ??
    row.video ??
    row.videoLink ??
    row.enlaceVideo ??
    row.enlace_video ??
    ""
  ).trim();
  const videoDuration = String(
    row.videoDuration ??
    row.video_duration ??
    row.duration ??
    row.duracion ??
    row.duración ??
    "—"
  ).trim() || "—";

  return {
    id: `db:${rawId}`,
    ownerEmail: email || undefined,
    name,
    points: score,
    photo: photo || makeAvatarDataUri(name),
    socials: {},
    athleteInfoUrl: profileLink,
    videoUrl: videoUrl || "#",
    videoDuration,
  };
}

async function loadAthletesFromFile() {
  try {
    const response = await fetch(ATHLETES_DB_PATH, { cache: "no-store" });
    if (!response.ok) {
      fileAthletes = [];
      return;
    }

    const payload = await response.json();
    const rows = Array.isArray(payload) ? payload : (Array.isArray(payload?.rows) ? payload.rows : []);
    fileAthletes = rows
      .map((row, index) => normalizeDbAthlete(row, index))
      .filter(Boolean);
  } catch {
    fileAthletes = [];
  }
}

async function loadAthletesFromSupabase() {
  if (!hasSupabase()) throw new Error("supabase_unavailable");

  const { data, error } = await supabaseClient
    .from(SUPABASE_TABLE)
    .select("*");

  if (error) throw error;

  const rows = Array.isArray(data) ? data : [];
  fileAthletes = rows
    .map((row, index) => normalizeDbAthlete(row, index))
    .filter(Boolean);
}

async function loadAthletesDataSource() {
  if (hasSupabase()) {
    try {
      await loadAthletesFromSupabase();
      return;
    } catch (error) {
      console.warn("[CALI] Supabase read failed. Falling back to data/athletes-db.json", error);
      await loadAthletesFromFile();
      return;
    }
  }

  await loadAthletesFromFile();
}

async function fetchProfileFromSupabase(email) {
  if (!hasSupabase()) return null;

  const { data, error } = await supabaseClient
    .from(SUPABASE_TABLE)
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.warn("[CALI] Supabase profile load failed", error);
    throw error;
  }
  if (!data) return null;
  return mapSupabaseRowToProfile(data, email);
}

async function upsertProfileToSupabase(profile) {
  if (!hasSupabase()) return { ok: true, skipped: true };

  const payload = mapProfileToSupabaseRow(profile);
  const { error } = await supabaseClient
    .from(SUPABASE_TABLE)
    .upsert(payload, { onConflict: "email" });

  if (error) {
    console.warn("[CALI] Supabase upsert failed", error);
    return { ok: false, error };
  }
  return { ok: true, skipped: false };
}

function makeFilterKey() {
  return `${norm(query)}|${ranked.length}|${ranked.map((a) => a.id).join(",")}`;
}

function parsePositionJump(raw) {
  const s = String(raw ?? "").trim();
  if (!s) return null;
  const m = s.match(/^#?\s*(\d+)$/);
  if (!m) return null;
  const n = Number(m[1]);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

function loadPrevPositions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function savePrevPositions(map) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    return true;
  } catch {
    return false;
  }
}

function loadProfiles() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function saveProfiles(nextProfiles) {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfiles));
    return true;
  } catch {
    return false;
  }
}

function loadSessionEmail() {
  try {
    return normalizeEmail(localStorage.getItem(SESSION_STORAGE_KEY));
  } catch {
    return "";
  }
}

function saveSessionEmail(email) {
  try {
    if (email) localStorage.setItem(SESSION_STORAGE_KEY, email);
    else localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
  }
}

function buildDefaultProfile(email) {
  return {
    email,
    name: "",
    photoData: "",
    profileLink: "",
    videoUrl: "",
    videoFileName: "",
    videoUpdatedAt: null,
    videoDuration: "—",
    termsAccepted: false,
    status: "draft",
    submittedAt: null,
    verifiedAt: null,
    updatedAt: nowIso(),
    points: 1,
  };
}

function migrateLegacyProfile(profile) {
  if (!profile || typeof profile !== "object") return null;

  const migrated = { ...profile };
  if (typeof migrated.profileLink !== "string") {
    migrated.profileLink = (
      migrated.athleteInfoUrl ||
      migrated.instagram ||
      migrated.youtube ||
      migrated.tiktok ||
      ""
    );
  }

  if (typeof migrated.name !== "string") migrated.name = "";
  if (typeof migrated.photoData !== "string") migrated.photoData = "";
  if (typeof migrated.videoUrl !== "string") migrated.videoUrl = "";
  if (typeof migrated.videoFileName !== "string") migrated.videoFileName = "";
  if (typeof migrated.points !== "number" || migrated.points <= 0) migrated.points = 1;
  if (!["draft", "pending", "verified"].includes(migrated.status)) migrated.status = "draft";
  if (typeof migrated.termsAccepted !== "boolean") migrated.termsAccepted = false;

  delete migrated.athleteInfoUrl;
  delete migrated.instagram;
  delete migrated.youtube;
  delete migrated.tiktok;

  return migrated;
}

function getOrCreateProfile(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;
  if (!profiles[normalized]) {
    profiles[normalized] = buildDefaultProfile(normalized);
    saveProfiles(profiles);
  } else {
    const migrated = migrateLegacyProfile(profiles[normalized]);
    if (migrated) {
      profiles[normalized] = migrated;
      saveProfiles(profiles);
    }
  }
  return profiles[normalized];
}

function getCurrentProfile() {
  if (!sessionEmail) return null;
  return getOrCreateProfile(sessionEmail);
}

function persistCurrentProfile(profile) {
  if (!profile || !profile.email) return false;
  profile.updatedAt = nowIso();
  profiles[profile.email] = profile;
  return saveProfiles(profiles);
}

function getAthleteInfoLink(athlete) {
  return (
    athlete.athleteInfoUrl ||
    athlete.socials?.instagram ||
    athlete.socials?.youtube ||
    athlete.socials?.tiktok ||
    null
  );
}

function setLinkOrHide($a, href) {
  if (!$a) return;
  if (href) {
    $a.style.display = "inline-flex";
    $a.href = href;
  } else {
    $a.style.display = "none";
    $a.href = "#";
  }
}

function makeAvatarDataUri(name) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  const hue = hash % 360;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="hsl(${hue}, 70%, 85%)"/>
        <stop offset="1" stop-color="hsl(${(hue + 30) % 360}, 70%, 75%)"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" rx="40" fill="url(#g)"/>
    <text x="200" y="230" text-anchor="middle" font-family="system-ui" font-size="110" font-weight="900" fill="rgba(0,0,0,0.65)">${initials || "A"}</text>
  </svg>`;

  const encoded = encodeURIComponent(svg).replaceAll("%0A", "");
  return `data:image/svg+xml;charset=UTF-8,${encoded}`;
}

function buildAthletesData() {
  return [...baseAthletes, ...fileAthletes];
}

function computeRanking() {
  const source = buildAthletesData();

  const sorted = [...source].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return a.name.localeCompare(b.name, LANG === "es" ? "es" : "en");
  });

  const pointsCount = new Map();
  for (const athlete of sorted) {
    pointsCount.set(athlete.points, (pointsCount.get(athlete.points) ?? 0) + 1);
  }

  ranked = sorted.map((athlete, index) => {
    const position = index + 1;
    const prev = Number(prevPositions[athlete.id] ?? position);
    const isTie = (pointsCount.get(athlete.points) ?? 0) >= 2;
    const isUp = prev > position;

    return {
      ...athlete,
      position,
      previousPosition: prev,
      isTie,
      isUp,
      photo: athlete.photo || makeAvatarDataUri(athlete.name)
    };
  });

  lastFilteredCacheKey = "";
}

function persistCurrentPositions() {
  const next = {};
  for (const athlete of ranked) next[athlete.id] = athlete.position;
  savePrevPositions(next);
}

function getFilteredRanked() {
  const key = makeFilterKey();
  if (key === lastFilteredCacheKey) return filteredCache;

  const q = norm(query);
  const jumpPos = parsePositionJump(query);

  const filtered = ranked.filter((athlete) => {
    if (!q) return true;
    if (jumpPos !== null) return athlete.position >= jumpPos;
    return norm(athlete.name).includes(q) || String(athlete.position).includes(q) || (`#${athlete.position}`).includes(q);
  });

  lastFilteredCacheKey = key;
  filteredCache = filtered;
  return filteredCache;
}

function ensureScrollLoader() {
  if (ensureScrollLoader._bound) return;
  ensureScrollLoader._bound = true;

  window.addEventListener("scroll", () => {
    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 400;
    if (!nearBottom) return;

    const filtered = getFilteredRanked();
    if (renderLimit >= filtered.length) return;

    renderLimit = Math.min(renderLimit + 50, filtered.length);
    renderList();
  }, { passive: true });
}

function getRankBadge(position) {
  if (position === 1) return { text: "🏆", className: "rank-badge--gold" };
  if (position === 2) return { text: "🏆", className: "rank-badge--silver" };
  if (position === 3) return { text: "🏆", className: "rank-badge--bronze" };
  return { text: `#${position}`, className: "rank-badge--normal" };
}

function getStateClasses(athlete) {
  const card = ["athlete-card"];
  const points = ["points-badge"];

  if (athlete.isTie) {
    card.push("athlete-card--tie");
    points.push("points-badge--tie");
  } else if (athlete.isUp) {
    card.push("athlete-card--up");
    points.push("points-badge--up");
  } else {
    points.push("points-badge--normal");
  }

  return { card: card.join(" "), points: points.join(" ") };
}

function renderStats() {
  if ($statTotal) $statTotal.textContent = String(ranked.length);
  if ($statUps) $statUps.textContent = String(ranked.filter((athlete) => athlete.isUp).length);
  if ($statTies) $statTies.textContent = String(ranked.filter((athlete) => athlete.isTie).length);
}

function renderList() {
  if (!$list) return;

  const filtered = getFilteredRanked();
  const slice = filtered.slice(0, Math.max(0, renderLimit));

  $list.innerHTML = "";

  for (const athlete of slice) {
    const badge = getRankBadge(athlete.position);
    const state = getStateClasses(athlete);
    const meta = athlete.position <= 3 ? `${TEXT.position} ${athlete.position}` : TEXT.athlete;

    const icons = [];
    if (athlete.isUp) icons.push(`<span class="state-icon--up" title="${TEXT.up}">▲</span>`);
    if (athlete.isTie) icons.push(`<span class="state-icon--tie" title="${TEXT.tie}">⚠</span>`);

    const card = document.createElement("article");
    card.className = state.card;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    card.innerHTML = `
      <div class="rank-badge ${badge.className}" aria-hidden="true">${badge.text}</div>
      <div class="athlete-main">
        <p class="athlete-name">${athlete.name}</p>
        <p class="athlete-meta">${meta}</p>
      </div>
      <div class="athlete-right">
        <div class="state-icons" aria-label="${TEXT.state}">${icons.join("")}</div>
        <div class="${state.points}">${athlete.points} ${TEXT.pointsSuffix}</div>
      </div>
    `.trim();

    card.addEventListener("click", () => openModal(athlete.id));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(athlete.id);
      }
    });

    $list.appendChild(card);
  }

  renderStats();
  ensureScrollLoader();
}

function openModal(id) {
  const athlete = ranked.find((item) => item.id === id);
  if (!athlete) return;

  if ($modalTitle) $modalTitle.textContent = `#${athlete.position} - ${athlete.name}`;
  if ($modalPhoto) $modalPhoto.src = athlete.photo;
  if ($modalPoints) $modalPoints.textContent = String(athlete.points);
  if ($modalDuration) $modalDuration.textContent = athlete.videoDuration ?? "—";

  if ($modalVideo) {
    if (athlete.videoUrl && athlete.videoUrl !== "#") {
      $modalVideo.style.display = "inline-flex";
      $modalVideo.href = athlete.videoUrl;
    } else {
      $modalVideo.style.display = "none";
      $modalVideo.href = "#";
    }
  }

  setLinkOrHide($modalAthleteInfo, getAthleteInfoLink(athlete));

  if ($overlay) {
    $overlay.classList.add("is-open");
    $overlay.setAttribute("aria-hidden", "false");
  }
}

function closeModal() {
  if (!$overlay) return;
  $overlay.classList.remove("is-open");
  $overlay.setAttribute("aria-hidden", "true");
}

function profileStatusLabel(status) {
  if (status === "verified") return TEXT.statusVerified;
  if (status === "pending") return TEXT.statusPending;
  return TEXT.statusDraft;
}

function videoIsLocked(profile) {
  if (!profile?.videoUpdatedAt) return false;
  const updated = new Date(profile.videoUpdatedAt).getTime();
  if (!Number.isFinite(updated)) return false;
  return Date.now() - updated < VIDEO_LOCK_MS;
}

function nextVideoChangeDate(profile) {
  if (!profile?.videoUpdatedAt) return null;
  const updated = new Date(profile.videoUpdatedAt).getTime();
  if (!Number.isFinite(updated)) return null;
  return new Date(updated + VIDEO_LOCK_MS);
}

function setProfileMessage(message, isError = false) {
  if (!$profileMessage) return;
  $profileMessage.textContent = message || "";
  $profileMessage.classList.toggle("profile-message--error", Boolean(isError));
}

function showAuthStep() {
  if ($profileAuthStep) $profileAuthStep.hidden = false;
  if ($profileEditStep) $profileEditStep.hidden = true;
}

function showEditStep() {
  if ($profileAuthStep) $profileAuthStep.hidden = true;
  if ($profileEditStep) $profileEditStep.hidden = false;
}

function openProfileModal() {
  if (!$profileOverlay) return;

  if (sessionEmail) {
    getOrCreateProfile(sessionEmail);
    showEditStep();
    syncProfileEditor();
  } else {
    showAuthStep();
    setProfileMessage("");
  }

  $profileOverlay.classList.add("is-open");
  $profileOverlay.setAttribute("aria-hidden", "false");
}

function closeProfileModal() {
  if (!$profileOverlay) return;
  $profileOverlay.classList.remove("is-open");
  $profileOverlay.setAttribute("aria-hidden", "true");
}

function updateMyAthleteCard() {
  if ($myAthleteOverlayText) $myAthleteOverlayText.textContent = TEXT.badgeEdit;

  const profile = getCurrentProfile();

  if (!profile) {
    if ($myAthleteRank) $myAthleteRank.textContent = "#—";
    if ($myAthleteName) $myAthleteName.textContent = TEXT.myCardGuestName;
    if ($myAthleteMeta) $myAthleteMeta.textContent = TEXT.myCardGuestMeta;
    if ($myAthleteState) {
      $myAthleteState.textContent = TEXT.badgeEdit;
      $myAthleteState.className = "points-badge points-badge--normal";
    }
    return;
  }

  const rankedEntry = ranked.find((athlete) => athlete.ownerEmail === profile.email);
  const status = profile.status || "draft";
  const fallbackName = profile.email.split("@")[0] || TEXT.myCardGuestName;

  if ($myAthleteRank) {
    $myAthleteRank.textContent = rankedEntry ? `#${rankedEntry.position}` : "#—";
  }

  if ($myAthleteName) {
    $myAthleteName.textContent = profile.name || fallbackName;
  }

  if ($myAthleteMeta) {
    if (status === "verified") {
      const pos = rankedEntry ? `${TEXT.positionPrefix} ${rankedEntry.position}` : TEXT.myCardVerifiedMeta;
      $myAthleteMeta.textContent = `${TEXT.myCardVerifiedMeta} ${pos}`;
    } else if (status === "pending") {
      $myAthleteMeta.textContent = TEXT.myCardPendingMeta;
    } else {
      $myAthleteMeta.textContent = TEXT.myCardDraftMeta;
    }
  }

  if ($myAthleteState) {
    if (status === "verified") {
      $myAthleteState.textContent = TEXT.badgeVerified;
      $myAthleteState.className = "points-badge points-badge--up";
    } else if (status === "pending") {
      $myAthleteState.textContent = TEXT.badgePending;
      $myAthleteState.className = "points-badge points-badge--tie";
    } else {
      $myAthleteState.textContent = TEXT.badgeDraft;
      $myAthleteState.className = "points-badge points-badge--normal";
    }
  }
}

function valueOrNotSet(value) {
  const clean = String(value || "").trim();
  return clean || TEXT.notSet;
}

function syncProfileSummaryFields() {
  const profile = getCurrentProfile();
  if (!profile) return;

  if ($profilePhotoValue) $profilePhotoValue.textContent = profile.photoData ? TEXT.photoReady : TEXT.notSet;
  if ($profileNameValue) $profileNameValue.textContent = valueOrNotSet(profile.name);
  if ($profileLinkValue) $profileLinkValue.textContent = profile.profileLink ? shortText(safeHostname(profile.profileLink)) : TEXT.notSet;

  if ($profileVideoValue) {
    if (profile.videoUrl) {
      $profileVideoValue.textContent = `${TEXT.linkPrefix}: ${shortText(safeHostname(profile.videoUrl), 22)}`;
    } else if (profile.videoFileName) {
      $profileVideoValue.textContent = `${TEXT.videoFilePrefix}: ${shortText(profile.videoFileName, 22)}`;
    } else {
      $profileVideoValue.textContent = TEXT.notSet;
    }
  }

  if ($profileTermsInput) $profileTermsInput.checked = Boolean(profile.termsAccepted);
}

function syncProfileStateLines() {
  const profile = getCurrentProfile();
  if (!profile) return;

  if ($profileSessionLine) {
    $profileSessionLine.textContent = `${TEXT.sessionPrefix}: ${profile.email}`;
  }

  if ($profileStatusLine) {
    $profileStatusLine.textContent = `${TEXT.statusPrefix}: ${profileStatusLabel(profile.status)}`;
  }

  if ($profileVideoLockLine) {
    if (videoIsLocked(profile)) {
      const nextDate = nextVideoChangeDate(profile);
      $profileVideoLockLine.textContent = `${TEXT.videoLockedPrefix} ${nextDate ? formatDate(nextDate) : "-"}`;
    } else {
      $profileVideoLockLine.textContent = TEXT.videoUnlocked;
    }
  }
}

function syncProfileEditor() {
  syncProfileSummaryFields();
  syncProfileStateLines();
}

function refreshAll() {
  computeRanking();
  renderList();
  persistCurrentPositions();
  updateMyAthleteCard();
  syncProfileEditor();
}

function getFieldMeta(field) {
  if (field === "name") return { title: TEXT.fieldNameTitle, key: "name" };
  if (field === "profileLink") return { title: TEXT.fieldProfileLinkTitle, key: "profileLink" };
  return null;
}

function pickFile(accept) {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.style.position = "fixed";
    input.style.left = "-9999px";
    document.body.appendChild(input);

    let done = false;

    const cleanup = (file) => {
      if (done) return;
      done = true;
      input.remove();
      window.removeEventListener("focus", onFocus);
      resolve(file || null);
    };

    const onFocus = () => {
      setTimeout(() => cleanup(input.files?.[0] || null), 300);
    };

    input.addEventListener("change", () => cleanup(input.files?.[0] || null), { once: true });
    window.addEventListener("focus", onFocus, { once: true });

    input.click();
  });
}

async function saveProfileAndRefresh(profile) {
  const saved = persistCurrentProfile(profile);
  if (!saved) {
    setProfileMessage(TEXT.messageSaveError, true);
    return false;
  }

  const syncResult = await upsertProfileToSupabase(profile);
  if (!syncResult.ok) {
    setProfileMessage(TEXT.messageSavedLocal, true);
    refreshAll();
    return false;
  }

  setProfileMessage(TEXT.messageSaved);
  refreshAll();
  return true;
}

async function editTextField(field) {
  const profile = getCurrentProfile();
  if (!profile) {
    setProfileMessage(TEXT.authInvalidEmail, true);
    return;
  }

  const meta = getFieldMeta(field);
  if (!meta) return;

  const current = String(profile[meta.key] || "");
  const next = window.prompt(meta.title, current);
  if (next === null) return;

  const value = String(next).trim();
  if (meta.key === "name" && !value) {
    setProfileMessage(TEXT.messageNeedName, true);
    return;
  }

  profile[meta.key] = value;
  await saveProfileAndRefresh(profile);
}

async function editPhotoField() {
  const profile = getCurrentProfile();
  if (!profile) {
    setProfileMessage(TEXT.authInvalidEmail, true);
    return;
  }

  const file = await pickFile("image/*");
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    setProfileMessage(TEXT.messagePhotoInvalid, true);
    return;
  }
  if (file.size > PHOTO_MAX_BYTES) {
    setProfileMessage(TEXT.messagePhotoTooLarge, true);
    return;
  }

  try {
    profile.photoData = await readFileAsDataUrl(file);
  } catch {
    setProfileMessage(TEXT.messageSaveError, true);
    return;
  }

  await saveProfileAndRefresh(profile);
}

async function editVideoField() {
  const profile = getCurrentProfile();
  if (!profile) {
    setProfileMessage(TEXT.authInvalidEmail, true);
    return;
  }

  if (videoIsLocked(profile)) {
    setProfileMessage(TEXT.messageVideoLocked, true);
    return;
  }

  const promptText = `${TEXT.fieldVideoTitle}\n${TEXT.fieldVideoHelp}`;
  const nextUrl = window.prompt(promptText, profile.videoUrl || "");
  if (nextUrl === null) return;

  const cleanUrl = String(nextUrl).trim();

  if (cleanUrl) {
    profile.videoUrl = cleanUrl;
    profile.videoFileName = "";
  } else {
    const file = await pickFile("video/*");
    if (!file) return;
    profile.videoUrl = "";
    profile.videoFileName = file.name;
  }

  profile.videoUpdatedAt = nowIso();
  await saveProfileAndRefresh(profile);
}

async function handleFieldEdit(field) {
  if (field === "photo") {
    await editPhotoField();
    return;
  }

  if (field === "video") {
    await editVideoField();
    return;
  }

  await editTextField(field);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("read_error"));
    reader.readAsDataURL(file);
  });
}

function validateProfileForSubmission(profile) {
  if (!profile.name || !profile.name.trim()) return TEXT.messageNeedName;
  if (!profile.videoUrl && !profile.videoFileName) return TEXT.messageNeedVideo;
  if (!profile.termsAccepted) return TEXT.messageNeedTerms;
  return "";
}

async function sendForVerification() {
  const profile = getCurrentProfile();
  if (!profile) return;

  if (!$profileTermsInput?.checked) {
    profile.termsAccepted = false;
    persistCurrentProfile(profile);
    setProfileMessage(TEXT.messageNeedTerms, true);
    syncProfileEditor();
    return;
  }

  profile.termsAccepted = true;
  const validation = validateProfileForSubmission(profile);
  if (validation) {
    setProfileMessage(validation, true);
    syncProfileEditor();
    return;
  }

  const prevStatus = profile.status;
  const prevSubmittedAt = profile.submittedAt;

  profile.status = "pending";
  profile.submittedAt = nowIso();

  if (!persistCurrentProfile(profile)) {
    setProfileMessage(TEXT.messageSaveError, true);
    return;
  }

  const syncResult = await upsertProfileToSupabase(profile);
  if (!syncResult.ok) {
    profile.status = prevStatus;
    profile.submittedAt = prevSubmittedAt;
    persistCurrentProfile(profile);
    setProfileMessage(TEXT.messageServerUnavailable, true);
    refreshAll();
    return;
  }

  setProfileMessage(TEXT.messageSent);
  refreshAll();
}

async function handleProfileLogin() {
  const email = normalizeEmail($profileEmailInput?.value);
  if (!email) {
    setProfileMessage(TEXT.authInvalidEmail, true);
    return;
  }

  sessionEmail = email;
  saveSessionEmail(email);

  let existed = Boolean(profiles[email]);
  let message = "";
  let messageIsError = false;

  const localProfile = getOrCreateProfile(email);
  if (!localProfile) {
    setProfileMessage(TEXT.messageSaveError, true);
    return;
  }

  if (hasSupabase()) {
    try {
      const remoteProfile = await fetchProfileFromSupabase(email);
      if (remoteProfile) {
        profiles[email] = remoteProfile;
        saveProfiles(profiles);
        existed = true;
      }
    } catch {
      message = TEXT.messageProfileLoadError;
      messageIsError = true;
    }
  }

  if (!existed && !message) {
    message = TEXT.messageProfileCreated;
  }

  showEditStep();
  setProfileMessage(message, messageIsError);
  refreshAll();
}

function handleProfileLogout() {
  sessionEmail = "";
  saveSessionEmail("");
  setProfileMessage(TEXT.messageSignedOut);
  showAuthStep();
  refreshAll();
}

$modalClose?.addEventListener("click", closeModal);
$overlay?.addEventListener("click", (event) => {
  if (event.target === $overlay) closeModal();
});

$search?.addEventListener("input", (event) => {
  query = event.target.value;
  renderLimit = 50;
  lastFilteredCacheKey = "";
  renderList();
});

$myAthleteCard?.addEventListener("click", openProfileModal);
$myAthleteCard?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openProfileModal();
  }
});

$profileClose?.addEventListener("click", closeProfileModal);
$profileOverlay?.addEventListener("click", (event) => {
  if (event.target === $profileOverlay) closeProfileModal();
});

$profileLoginBtn?.addEventListener("click", () => {
  void handleProfileLogin();
});
$profileEmailInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    void handleProfileLogin();
  }
});

$profileTermsInput?.addEventListener("change", () => {
  const profile = getCurrentProfile();
  if (!profile) return;
  profile.termsAccepted = Boolean($profileTermsInput.checked);
  if (!persistCurrentProfile(profile)) {
    setProfileMessage(TEXT.messageSaveError, true);
    return;
  }
  void upsertProfileToSupabase(profile);
  syncProfileEditor();
});

$profileSendBtn?.addEventListener("click", () => {
  void sendForVerification();
});
$profileLogoutBtn?.addEventListener("click", handleProfileLogout);

for (const button of document.querySelectorAll("[data-edit-field]")) {
  button.addEventListener("click", () => {
    const field = button.getAttribute("data-edit-field");
    if (!field) return;
    void handleFieldEdit(field);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if ($profileOverlay?.classList.contains("is-open")) {
    closeProfileModal();
    return;
  }

  if ($overlay?.classList.contains("is-open")) {
    closeModal();
  }
});

async function syncSessionProfileFromSupabase() {
  if (!sessionEmail) return;

  const localProfile = getOrCreateProfile(sessionEmail);
  if (!localProfile) {
    sessionEmail = "";
    saveSessionEmail("");
    return;
  }

  if (!hasSupabase()) return;

  try {
    const remoteProfile = await fetchProfileFromSupabase(sessionEmail);
    if (!remoteProfile) return;
    profiles[sessionEmail] = remoteProfile;
    saveProfiles(profiles);
  } catch {
  }
}

async function bootstrap() {
  await syncSessionProfileFromSupabase();
  await loadAthletesDataSource();
  refreshAll();
}

void bootstrap();

setInterval(() => {
  void loadAthletesDataSource().finally(() => {
    refreshAll();
  });
}, 30000);
