const header = document.querySelector("header");
const title = document.querySelector(".headerTxt");
const logo = document.querySelector(".logo");

window.addEventListener("scroll", () => {
  if (window.scrollY > 0) {
    header.classList.add("transparent-bg");
    title.classList.add("hidden");
  } else {
    header.classList.remove("transparent-bg");
    title.classList.remove("hidden");
  }
});

logo.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
