/* =========================================================
   NOITES EM TOKYO
   JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ANO AUTOMÁTICO
    ====================================================== */

    const year = document.getElementById("current-year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    /* =====================================================
       NAVEGAÇÃO ATIVA
    ====================================================== */

    const navLinks = document.querySelectorAll(".nav-link");

    const sections = document.querySelectorAll(
        "main section[id]"
    );


    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                const id = entry.target.getAttribute("id");

                navLinks.forEach((link) => {

                    link.classList.remove("active");

                    if (
                        link.getAttribute("href") === `#${id}`
                    ) {
                        link.classList.add("active");
                    }

                });

            });

        },
        {
            rootMargin: "-30% 0px -60% 0px",
            threshold: 0
        }
    );


    sections.forEach((section) => {
        observer.observe(section);
    });


    /* =====================================================
       SCROLL SUAVE
    ====================================================== */

    navLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId =
                link.getAttribute("href");

            if (!targetId.startsWith("#")) {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* =====================================================
       REVELAÇÃO DOS ELEMENTOS
    ====================================================== */

    const revealElements = document.querySelectorAll(
        ".feature-card, " +
        ".attribute-card, " +
        ".kagune-entry, " +
        ".kakuja-card, " +
        ".small-panel, " +
        ".rank-card, " +
        ".district-grid article, " +
        ".investigation-grid article"
    );


    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("revealed");

                observer.unobserve(entry.target);

            });

        },
        {
            threshold: 0.08
        }
    );


    revealElements.forEach((element) => {

        element.style.opacity = "0";
        element.style.transform = "translateY(16px)";
        element.style.transition =
            "opacity .6s ease, transform .6s ease";

        revealObserver.observe(element);

    });


    /* =====================================================
       CSS DA REVELAÇÃO
    ====================================================== */

    const style = document.createElement("style");

    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;

    document.head.appendChild(style);


    /* =====================================================
       LOG INICIAL
    ====================================================== */

    console.log(
        "%c NOITES EM TOKYO ",
        "color:#d83243;font-weight:bold;"
    );

    console.log(
        "Manual carregado."
    );

});
