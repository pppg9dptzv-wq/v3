const revealElements = document.querySelectorAll(".reveal");
const randomImageCards = document.querySelectorAll("[data-random-images]");

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

randomImageCards.forEach((card) => {
  const targetImage = card.querySelector(".card-image--main");
  const imageList = card.dataset.randomImages
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!targetImage || !imageList?.length) {
    return;
  }

  const randomIndex = Math.floor(Math.random() * imageList.length);
  targetImage.src = imageList[randomIndex];
});
