// Промяна на менюто при скрол
window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

// Плавно превъртане
document.getElementById("exploreBtn").addEventListener("click", () => {
    document.getElementById("features").scrollIntoView({ behavior: "smooth" });
});

// Анимации при скрол
const fadeElems = document.querySelectorAll(".fade-in");
window.addEventListener("scroll", () => {
    fadeElems.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            el.classList.add("visible");
        }
    });
});

// Бутон контакт
document.getElementById("contactBtn").addEventListener("click", () => {
    alert("Изпращаме те в бъдещето! 🚀");
});
