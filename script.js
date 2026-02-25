const INDICATOR_STORAGE_KEY = "calisthenics_ranked_indicators_v2";
const LEGACY_PREV_POSITIONS_KEY = "calisthenics_ranked_prev_positions_v1";
const PROFILE_STORAGE_KEY = "calisthenics_ranked_profiles_v1";
const SESSION_STORAGE_KEY = "calisthenics_ranked_session_v1";
const ATHLETES_DB_PATH = "data/athletes-db.json";
const VIDEO_LOCK_MS = 30 * 24 * 60 * 60 * 1000;
const INDICATOR_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;
const PHOTO_MAX_BYTES = 4 * 1024 * 1024;
const VIDEO_MAX_BYTES = 200 * 1024 * 1024;
const ACCEPTED_VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".webm", ".m4v"]);
const PROFILE_MESSAGE_TIMEOUT_MS = 4500;
const SUPABASE_DEFAULT_CONFIG = {
  url: "",
  anonKey: "",
  table: "athletes",
  storageBucket: "athletes-media",
  confirmationFunction: "send-submission-confirmation",
};
const SUPABASE_CONFIG = window.CALI_SUPABASE_CONFIG || SUPABASE_DEFAULT_CONFIG;
const SUPABASE_URL = String(SUPABASE_CONFIG.url || "").trim();
const SUPABASE_ANON_KEY = String(SUPABASE_CONFIG.anonKey || "").trim();
const SUPABASE_TABLE = String(SUPABASE_CONFIG.table || SUPABASE_DEFAULT_CONFIG.table).trim() || SUPABASE_DEFAULT_CONFIG.table;
const SUPABASE_STORAGE_BUCKET = String(SUPABASE_CONFIG.storageBucket || SUPABASE_DEFAULT_CONFIG.storageBucket).trim();
const SUPABASE_CONFIRMATION_FUNCTION = String(
  SUPABASE_CONFIG.confirmationFunction || SUPABASE_DEFAULT_CONFIG.confirmationFunction
).trim();
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
    messagePhotoTooLarge: "Photo is too large. Maximum size is 4MB.",
    messagePhotoInvalid: "Select a valid image file.",
    messagePhotoMissing: "Choose an image file first.",
    messageVideoMissing: "Add a video URL or select a video file.",
    messageVideoInvalid: "Select a valid video file (MP4, MOV or WEBM).",
    messageVideoTooLarge: "Video is too large. Maximum size is 200MB.",
    messagePhotoUploading: "Uploading photo...",
    messageVideoUploading: "Uploading video...",
    messageStorageUnavailable: "File upload is not available now. Configure Supabase Storage bucket.",
    messageDeletingProfile: "Deleting your form...",
    messageProfileDeleted: "Your form has been deleted.",
    messageDeleteError: "Could not delete your form.",
    confirmDeleteProfile: "Delete all your submitted data? This action cannot be undone.",
    messageProfileCreated: "Profile ready. Complete your fields and send for verification.",
    messageProfileLoadError: "Could not load your profile from Supabase. Local draft loaded.",
    fieldPhotoTitle: "Edit profile photo",
    fieldPhotoHelp: "Upload JPG or PNG up to 4MB.",
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
    messagePhotoTooLarge: "La foto es demasiado grande. Máximo 4MB.",
    messagePhotoInvalid: "Selecciona una imagen válida.",
    messagePhotoMissing: "Elige primero un archivo de imagen.",
    messageVideoMissing: "Añade una URL de video o selecciona un archivo de video.",
    messageVideoInvalid: "Selecciona un video válido (MP4, MOV o WEBM).",
    messageVideoTooLarge: "El video es demasiado grande. Máximo 200MB.",
    messagePhotoUploading: "Subiendo foto...",
    messageVideoUploading: "Subiendo video...",
    messageStorageUnavailable: "La subida de archivos no está disponible ahora. Configura el bucket de Supabase Storage.",
    messageDeletingProfile: "Eliminando tu formulario...",
    messageProfileDeleted: "Tu formulario ha sido eliminado.",
    messageDeleteError: "No se pudo eliminar tu formulario.",
    confirmDeleteProfile: "¿Eliminar todos tus datos enviados? Esta acción no se puede deshacer.",
    messageProfileCreated: "Perfil listo. Completa tus campos y envíalo a verificación.",
    messageProfileLoadError: "No se pudo cargar tu perfil desde Supabase. Se cargó el borrador local.",
    fieldPhotoTitle: "Editar foto de perfil",
    fieldPhotoHelp: "Sube JPG o PNG hasta 4MB.",
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

const baseAthletes = [];

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
const $profileDeleteBtn = document.getElementById("profileDeleteBtn");
const $profileLogoutBtn = document.getElementById("profileLogoutBtn");

const $profilePhotoValue = document.getElementById("profilePhotoValue");
const $profileNameValue = document.getElementById("profileNameValue");
const $profileLinkValue = document.getElementById("profileLinkValue");
const $profileVideoValue = document.getElementById("profileVideoValue");

let ranked = [];
let query = "";
let indicatorState = loadIndicatorState();
let renderLimit = 50;
let lastFilteredCacheKey = "";
let filteredCache = [];
let profiles = loadProfiles();
let sessionEmail = loadSessionEmail();
let fileAthletes = [];
let supabaseClient = createSupabaseClient();
let profileMessageTimer = 0;
let profileBusy = false;

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

function hasSupabaseStorage() {
  return hasSupabase() && Boolean(SUPABASE_STORAGE_BUCKET);
}

function fileExtension(fileName) {
  const name = String(fileName || "").toLowerCase();
  const index = name.lastIndexOf(".");
  if (index < 0) return "";
  return name.slice(index);
}

function isValidVideoFile(file) {
  if (!file) return false;
  if (String(file.type || "").startsWith("video/")) return true;
  return ACCEPTED_VIDEO_EXTENSIONS.has(fileExtension(file.name));
}

function sanitizeStorageSegment(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "file";
}

function buildStoragePath(kind, email, fileName) {
  const safeKind = kind === "video" ? "videos" : "photos";
  const safeEmail = sanitizeStorageSegment(email).replaceAll(".", "-");
  const safeName = sanitizeStorageSegment(fileName);
  return `${safeKind}/${safeEmail}/${Date.now()}-${safeName}`;
}

async function uploadFileToSupabaseStorage(file, kind, email) {
  if (!hasSupabaseStorage()) return { ok: false, reason: "storage_unavailable" };

  const path = buildStoragePath(kind, email, file.name);
  const bucket = supabaseClient.storage.from(SUPABASE_STORAGE_BUCKET);

  const { error } = await bucket.upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type || undefined,
  });

  if (error) return { ok: false, reason: "upload_error", error };

  const { data } = bucket.getPublicUrl(path);
  const publicUrl = String(data?.publicUrl || "").trim();
  if (!publicUrl) return { ok: false, reason: "no_public_url" };

  return { ok: true, url: publicUrl, path };
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

function getConfirmationFunctionUrl() {
  if (!hasSupabase()) return "";
  if (!SUPABASE_CONFIRMATION_FUNCTION) return "";
  return `${SUPABASE_URL}/functions/v1/${SUPABASE_CONFIRMATION_FUNCTION}`;
}

async function sendSubmissionConfirmationEmail(profile) {
  const endpoint = getConfirmationFunctionUrl();
  if (!endpoint) return;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        email: profile.email,
        name: profile.name || profile.email.split("@")[0] || "Athlete",
        submittedAt: profile.submittedAt || nowIso(),
        lang: LANG,
      }),
    });

    if (!response.ok) {
      console.warn("[CALI] Submission confirmation email failed", response.status);
    }
  } catch (error) {
    console.warn("[CALI] Submission confirmation email request failed", error);
  }
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

function defaultIndicatorState() {
  return {
    version: 2,
    computedAt: "",
    sourceSignature: "",
    positions: {},
    indicators: {},
  };
}

function normalizePositionsMap(value) {
  if (!value || typeof value !== "object") return {};

  const map = {};
  for (const [id, raw] of Object.entries(value)) {
    const position = Number(raw);
    if (!Number.isFinite(position) || position <= 0) continue;
    map[id] = position;
  }
  return map;
}

function normalizeIndicatorsMap(value) {
  if (!value || typeof value !== "object") return {};

  const map = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!raw || typeof raw !== "object") continue;
    map[id] = {
      isTie: Boolean(raw.isTie),
      isUp: Boolean(raw.isUp),
      previousPosition: Number(raw.previousPosition) > 0 ? Number(raw.previousPosition) : 0,
    };
  }

  return map;
}

function loadLegacyPositions() {
  try {
    const raw = localStorage.getItem(LEGACY_PREV_POSITIONS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return normalizePositionsMap(parsed);
  } catch {
    return {};
  }
}

function loadIndicatorState() {
  try {
    const raw = localStorage.getItem(INDICATOR_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return {
          version: 2,
          computedAt: String(parsed.computedAt || ""),
          sourceSignature: String(parsed.sourceSignature || ""),
          positions: normalizePositionsMap(parsed.positions),
          indicators: normalizeIndicatorsMap(parsed.indicators),
        };
      }
    }
  } catch {
  }

  return {
    ...defaultIndicatorState(),
    positions: loadLegacyPositions(),
  };
}

function saveIndicatorState(nextState) {
  try {
    localStorage.setItem(INDICATOR_STORAGE_KEY, JSON.stringify(nextState));
    localStorage.removeItem(LEGACY_PREV_POSITIONS_KEY);
    return true;
  } catch {
    return false;
  }
}

function buildScoreSignature(sortedAthletes) {
  return sortedAthletes
    .map((athlete) => `${athlete.id}:${athlete.points}`)
    .join("|");
}

function shouldRecomputeIndicators(sortedAthletes, sourceSignature) {
  if (!indicatorState || typeof indicatorState !== "object") return true;
  if (!indicatorState.computedAt) return true;
  if (!indicatorState.sourceSignature) return true;
  if (indicatorState.sourceSignature !== sourceSignature) return true;

  const computedAt = new Date(indicatorState.computedAt).getTime();
  if (!Number.isFinite(computedAt)) return true;
  if (Date.now() - computedAt >= INDICATOR_RETENTION_MS) return true;

  const positions = normalizePositionsMap(indicatorState.positions);
  const indicators = normalizeIndicatorsMap(indicatorState.indicators);

  for (const athlete of sortedAthletes) {
    if (!positions[athlete.id]) return true;
    if (!indicators[athlete.id]) return true;
  }

  return false;
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

  const sourceSignature = buildScoreSignature(sorted);
  const recomputeIndicators = shouldRecomputeIndicators(sorted, sourceSignature);
  const previousPositions = normalizePositionsMap(indicatorState.positions);
  const cachedIndicators = normalizeIndicatorsMap(indicatorState.indicators);

  const pointsCount = new Map();
  for (const athlete of sorted) {
    pointsCount.set(athlete.points, (pointsCount.get(athlete.points) ?? 0) + 1);
  }

  const nextIndicators = {};

  ranked = sorted.map((athlete, index) => {
    const position = index + 1;
    const prev = Number(previousPositions[athlete.id] ?? position);
    const liveIsTie = (pointsCount.get(athlete.points) ?? 0) >= 2;
    const liveIsUp = prev > position;
    const cached = cachedIndicators[athlete.id];

    const previousPosition = !recomputeIndicators && Number(cached?.previousPosition) > 0
      ? Number(cached.previousPosition)
      : prev;
    const isTie = !recomputeIndicators && typeof cached?.isTie === "boolean"
      ? cached.isTie
      : liveIsTie;
    const isUp = !recomputeIndicators && typeof cached?.isUp === "boolean"
      ? cached.isUp
      : liveIsUp;

    nextIndicators[athlete.id] = {
      previousPosition,
      isTie,
      isUp,
    };

    return {
      ...athlete,
      position,
      previousPosition,
      isTie,
      isUp,
      photo: athlete.photo || makeAvatarDataUri(athlete.name)
    };
  });

  if (recomputeIndicators) {
    const nextPositions = {};
    for (const athlete of ranked) nextPositions[athlete.id] = athlete.position;

    indicatorState = {
      version: 2,
      computedAt: nowIso(),
      sourceSignature,
      positions: nextPositions,
      indicators: nextIndicators,
    };
    saveIndicatorState(indicatorState);
  }

  lastFilteredCacheKey = "";
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

function setProfileMessage(message, isError = false, sticky = false) {
  if (profileMessageTimer) {
    clearTimeout(profileMessageTimer);
    profileMessageTimer = 0;
  }

  if (!$profileMessage) return;
  $profileMessage.textContent = message || "";
  $profileMessage.classList.toggle("profile-message--error", Boolean(isError));

  if (!message || sticky) return;

  profileMessageTimer = window.setTimeout(() => {
    if (!$profileMessage) return;
    if ($profileMessage.textContent !== message) return;
    setProfileMessage("", false, true);
  }, PROFILE_MESSAGE_TIMEOUT_MS);
}

function resetProfileEditorTransientState() {
  if ($profileTermsInput) $profileTermsInput.checked = false;
  setProfileMessage("", false, true);
}

function setProfileBusyState(isBusy) {
  profileBusy = Boolean(isBusy);

  if ($profileLoginBtn) $profileLoginBtn.disabled = profileBusy;
  if ($profileSendBtn) $profileSendBtn.disabled = profileBusy;
  if ($profileDeleteBtn) $profileDeleteBtn.disabled = profileBusy;
  if ($profileLogoutBtn) $profileLogoutBtn.disabled = profileBusy;

  for (const button of document.querySelectorAll("[data-edit-field]")) {
    button.disabled = profileBusy;
  }
}

async function removeAllProfileStorageObjects(email) {
  if (!hasSupabaseStorage()) return;

  const safeEmail = sanitizeStorageSegment(email).replaceAll(".", "-");
  const bucket = supabaseClient.storage.from(SUPABASE_STORAGE_BUCKET);
  const prefixes = [`photos/${safeEmail}`, `videos/${safeEmail}`];

  for (const prefix of prefixes) {
    let offset = 0;

    while (true) {
      const { data, error } = await bucket.list(prefix, {
        limit: 100,
        offset,
        sortBy: { column: "name", order: "asc" },
      });

      if (error) {
        console.warn("[CALI] Supabase storage list failed", error);
        break;
      }

      const rows = Array.isArray(data) ? data : [];
      if (rows.length === 0) break;

      const paths = rows
        .filter((row) => row && typeof row.name === "string" && row.name)
        .map((row) => `${prefix}/${row.name}`);

      if (paths.length > 0) {
        const { error: removeError } = await bucket.remove(paths);
        if (removeError) {
          console.warn("[CALI] Supabase storage remove failed", removeError);
        }
      }

      if (rows.length < 100) break;
      offset += 100;
    }
  }
}

function clearLocalSessionState() {
  sessionEmail = "";
  saveSessionEmail("");
  resetProfileEditorTransientState();
  if ($profileEmailInput) $profileEmailInput.value = "";
  showAuthStep();
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
    resetProfileEditorTransientState();
    syncProfileEditor();
  } else {
    showAuthStep();
    resetProfileEditorTransientState();
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
  if (profileBusy) return false;
  setProfileBusyState(true);

  try {
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
  } finally {
    setProfileBusyState(false);
  }
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
  if (profileBusy) return;

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

  setProfileBusyState(true);
  setProfileMessage(TEXT.messagePhotoUploading, false, true);

  try {
    if (hasSupabaseStorage()) {
      const uploaded = await uploadFileToSupabaseStorage(file, "photo", profile.email);
      if (!uploaded.ok) {
        setProfileMessage(TEXT.messageServerUnavailable, true);
        return;
      }
      profile.photoData = uploaded.url;
    } else {
      profile.photoData = await readFileAsDataUrl(file);
    }
  } catch {
    setProfileMessage(TEXT.messageSaveError, true);
    return;
  } finally {
    setProfileBusyState(false);
  }

  await saveProfileAndRefresh(profile);
}

async function editVideoField() {
  if (profileBusy) return;

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

    if (!isValidVideoFile(file)) {
      setProfileMessage(TEXT.messageVideoInvalid, true);
      return;
    }
    if (file.size > VIDEO_MAX_BYTES) {
      setProfileMessage(TEXT.messageVideoTooLarge, true);
      return;
    }
    if (!hasSupabaseStorage()) {
      setProfileMessage(TEXT.messageStorageUnavailable, true);
      return;
    }

    setProfileBusyState(true);
    setProfileMessage(TEXT.messageVideoUploading, false, true);

    try {
      const uploaded = await uploadFileToSupabaseStorage(file, "video", profile.email);
      if (!uploaded.ok) {
        setProfileMessage(TEXT.messageServerUnavailable, true);
        return;
      }
      profile.videoUrl = uploaded.url;
      profile.videoFileName = file.name;
    } finally {
      setProfileBusyState(false);
    }
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

function validateProfileForSubmission(profile, termsAccepted) {
  if (!profile.name || !profile.name.trim()) return TEXT.messageNeedName;
  if (!profile.videoUrl && !profile.videoFileName) return TEXT.messageNeedVideo;
  if (!termsAccepted) return TEXT.messageNeedTerms;
  return "";
}

async function sendForVerification() {
  if (profileBusy) return;

  const profile = getCurrentProfile();
  if (!profile) return;

  const termsAccepted = Boolean($profileTermsInput?.checked);
  if (!termsAccepted) {
    setProfileMessage(TEXT.messageNeedTerms, true);
    syncProfileEditor();
    return;
  }

  const validation = validateProfileForSubmission(profile, termsAccepted);
  if (validation) {
    setProfileMessage(validation, true);
    syncProfileEditor();
    return;
  }

  const prevStatus = profile.status;
  const prevSubmittedAt = profile.submittedAt;

  setProfileBusyState(true);
  profile.status = "pending";
  profile.submittedAt = nowIso();
  profile.termsAccepted = true;

  try {
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
    if ($profileTermsInput) $profileTermsInput.checked = false;
    refreshAll();
    void sendSubmissionConfirmationEmail(profile);
  } finally {
    setProfileBusyState(false);
  }
}

function removeLocalProfile(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) return;
  if (!profiles[normalized]) return;
  delete profiles[normalized];
  saveProfiles(profiles);
}

async function completeProfileLogin(email) {
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
  resetProfileEditorTransientState();
  setProfileMessage(message, messageIsError);
  refreshAll();
}

async function handleProfileLogin() {
  if (profileBusy) return;

  const email = normalizeEmail($profileEmailInput?.value);
  if (!email) {
    setProfileMessage(TEXT.authInvalidEmail, true);
    return;
  }

  setProfileBusyState(true);

  try {
    await completeProfileLogin(email);
  } finally {
    setProfileBusyState(false);
  }
}

async function handleDeleteProfile() {
  if (profileBusy) return;

  const profile = getCurrentProfile();
  if (!profile) {
    setProfileMessage(TEXT.authInvalidEmail, true);
    return;
  }

  if (!window.confirm(TEXT.confirmDeleteProfile)) return;

  setProfileBusyState(true);
  setProfileMessage(TEXT.messageDeletingProfile, false, true);

  try {
    if (hasSupabase()) {
      const { error } = await supabaseClient
        .from(SUPABASE_TABLE)
        .delete()
        .eq("email", profile.email);

      if (error) {
        console.warn("[CALI] Supabase delete failed", error);
        setProfileMessage(TEXT.messageDeleteError, true);
        return;
      }

      await removeAllProfileStorageObjects(profile.email);
    }

    removeLocalProfile(profile.email);
    clearLocalSessionState();
    refreshAll();
    setProfileMessage(TEXT.messageProfileDeleted);
  } finally {
    setProfileBusyState(false);
  }
}

async function handleProfileLogout() {
  if (profileBusy) return;

  setProfileBusyState(true);

  try {
    clearLocalSessionState();
    refreshAll();
    setProfileMessage(TEXT.messageSignedOut);
  } finally {
    setProfileBusyState(false);
  }
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
  if (profileBusy) return;
  if (!$profileTermsInput?.checked) return;
  setProfileMessage("");
});

$profileSendBtn?.addEventListener("click", () => {
  void sendForVerification();
});
$profileDeleteBtn?.addEventListener("click", () => {
  void handleDeleteProfile();
});
$profileLogoutBtn?.addEventListener("click", () => {
  void handleProfileLogout();
});

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
