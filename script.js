const revealElements = document.querySelectorAll(".reveal");
const randomImageCards = document.querySelectorAll(
  "[data-random-images], [data-random-folder]"
);
const servicesSection = document.querySelector(".services");
const heroMedia = document.querySelector(".hero-media");

const IMAGE_EXTENSION_REGEX = /\.(avif|gif|jpe?g|png|webp)$/i;
const imageLoadCache = new Map();

const parseCsv = (value) =>
  (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const normalizePath = (path) =>
  path.replace(/\\/g, "/").replace(/^\.\//, "").trim();

const normalizeFolder = (folder) =>
  normalizePath(folder).replace(/\/+$/, "").trim();

const unique = (list) => [...new Set(list)];

const shuffle = (list) => {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const canLoadImage = async (src, timeoutMs = 2500) => {
  if (!src) {
    return false;
  }

  if (imageLoadCache.has(src)) {
    return imageLoadCache.get(src);
  }

  const loadPromise = new Promise((resolve) => {
    const img = new Image();
    let settled = false;

    const finish = (ok) => {
      if (settled) {
        return;
      }
      settled = true;
      img.onload = null;
      img.onerror = null;
      clearTimeout(timer);
      resolve(ok);
    };

    const timer = setTimeout(() => finish(false), timeoutMs);
    img.onload = () => finish(true);
    img.onerror = () => finish(false);
    img.src = src;
  });

  imageLoadCache.set(src, loadPromise);
  return loadPromise;
};

const getImagePathFromHref = (href, folder) => {
  if (!href) {
    return null;
  }

  const cleanedHref = decodeURIComponent(href).split("#")[0].split("?")[0];
  const fileName = cleanedHref.split("/").pop();

  if (!fileName || !IMAGE_EXTENSION_REGEX.test(fileName)) {
    return null;
  }

  return `${folder}/${fileName}`;
};

const extractImagesFromDirectoryHtml = (html, folder) => {
  const found = new Set();

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const links = [...doc.querySelectorAll("a[href]")];

    links.forEach((link) => {
      const parsed = getImagePathFromHref(link.getAttribute("href"), folder);
      if (parsed) {
        found.add(parsed);
      }
    });
  } catch {
    // no-op
  }

  if (!found.size) {
    const matches = html.matchAll(/href=["']([^"']+)["']/gi);
    for (const match of matches) {
      const parsed = getImagePathFromHref(match[1], folder);
      if (parsed) {
        found.add(parsed);
      }
    }
  }

  return [...found];
};

const getDirectoryImages = async (folderName) => {
  const folder = normalizeFolder(folderName);

  if (!folder) {
    return [];
  }

  try {
    const response = await fetch(`${folder}/`, { cache: "no-store" });
    if (!response.ok) {
      return [];
    }

    const html = await response.text();
    return extractImagesFromDirectoryHtml(html, folder);
  } catch {
    return [];
  }
};

const buildCandidates = async ({ folderName, listValue, fallbackValue }) => {
  const fromFolder = await getDirectoryImages(folderName);
  const fromList = parseCsv(listValue).map(normalizePath);
  const fromFallback = parseCsv(fallbackValue).map(normalizePath);

  return unique([...fromFolder, ...fromList, ...fromFallback]);
};

const pickWorkingRandomImage = async (candidates) => {
  const shuffledCandidates = shuffle(unique(candidates));

  for (const candidate of shuffledCandidates) {
    if (await canLoadImage(candidate)) {
      return candidate;
    }
  }

  return null;
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.2,
  }
);

revealElements.forEach((element) => observer.observe(element));

const applyRandomImageToCards = async () => {
  for (const card of randomImageCards) {
    const targetImage = card.querySelector(".card-image--main");

    if (!targetImage) {
      continue;
    }

    const candidates = await buildCandidates({
      folderName: card.dataset.randomFolder,
      listValue: card.dataset.randomImages,
      fallbackValue: targetImage.getAttribute("src") || "",
    });

    const selected = await pickWorkingRandomImage(candidates);

    if (selected) {
      targetImage.src = selected;
    }
  }
};

const applyRandomImageToHero = async () => {
  if (!heroMedia) {
    return;
  }

  const mobileSource = heroMedia.querySelector('source[media*="max-width"]');
  const desktopImage = heroMedia.querySelector("img");

  const mobileCandidates = await buildCandidates({
    folderName: heroMedia.dataset.mobileFolder,
    listValue: heroMedia.dataset.mobileImages,
    fallbackValue: mobileSource?.getAttribute("srcset") || "",
  });

  const desktopCandidates = await buildCandidates({
    folderName: heroMedia.dataset.desktopFolder,
    listValue: heroMedia.dataset.desktopImages,
    fallbackValue: desktopImage?.getAttribute("src") || "",
  });

  const selectedMobile = await pickWorkingRandomImage(mobileCandidates);
  const selectedDesktop = await pickWorkingRandomImage(desktopCandidates);

  if (mobileSource && selectedMobile) {
    mobileSource.srcset = selectedMobile;
  }

  if (desktopImage && selectedDesktop) {
    desktopImage.src = selectedDesktop;
  }
};

void applyRandomImageToHero();
void applyRandomImageToCards();

let userInteracted = false;

const markInteraction = () => {
  userInteracted = true;
};

window.addEventListener("wheel", markInteraction, { passive: true });
window.addEventListener("touchstart", markInteraction, { passive: true });
window.addEventListener("keydown", markInteraction);
window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    userInteracted = true;
  }
});

setTimeout(() => {
  if (!servicesSection || userInteracted || window.scrollY > 20) {
    return;
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  servicesSection.scrollIntoView({
    behavior: reducedMotion ? "auto" : "smooth",
    block: "start",
  });
}, 2000);
