const navbarMenu = document.getElementById("navbarMenu");

document.querySelectorAll("#navnarMenu .nav-link").forEach((link)=> {
    link.addEventListener("click", () => {
        const collapseInstance = bootstrap.Collape.getInstance(navbarMenu);
        collapseInstance?.hide();
    });
});