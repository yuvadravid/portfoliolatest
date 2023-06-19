const adminbtn = document.querySelector(".adminbtn");
const adminmenu = document.querySelector(".adminmenu");
const darkmode = document.querySelector(".darkmode");
adminbtn.addEventListener("click", () => {
  adminmenu.classList.toggle("hidden");
  adminmenu.classList.toggle("flex");
});

const menubtn = document.querySelector(".menubtn");
const menu = document.querySelector(".menu");

menubtn.addEventListener("click", () => {
  menu.classList.toggle("left-[0%]");
  menu.classList.toggle("left-[-100%]");
  menubtn.classList.toggle("fa-bars");
  menubtn.classList.toggle("fa-xmark");
});
darkmode.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  darkmode.classList.toggle("fa-sun");
  darkmode.classList.toggle("fa-moon");
});
