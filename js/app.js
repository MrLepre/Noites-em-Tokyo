/* =========================================================
   NOITES EM TOKYO
   APP.JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    iniciarNavegacao();
    observarSecoes();
    iniciarTransicaoTema();

});


/* =========================================================
   NAVEGAÇÃO
========================================================= */

function iniciarNavegacao() {

    const links = document.querySelectorAll(".nav-link");

    links.forEach(link => {

        link.addEventListener("click", event => {

            const href = link.getAttribute("href");

            if (!href || !href.startsWith("#")) {
                return;
            }

            const target = document.querySelector(href);

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

}


/* =========================================================
   NAV ATIVA
========================================================= */

function observarSecoes() {

    const sections = document.querySelectorAll(
        "main section[id]"
    );

    const links = document.querySelectorAll(
        ".nav-link"
    );

    const observer = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) {
                    return;
                }

                const id = entry.target.id;

                links.forEach(link => {

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
            rootMargin: "-35% 0px -55% 0px"
        }
    );

    sections.forEach(section => {
        observer.observe(section);
    });

}


/* =========================================================
   TRANSIÇÃO GHOUL → CCG
========================================================= */

function iniciarTransicaoTema() {

    const ccgSections = document.querySelectorAll(
        ".ccg-section, .ccg-section-inner"
    );

    const body = document.body;

    const observer = new IntersectionObserver(
        entries => {

            const ccgVisivel = entries.some(
                entry => entry.isIntersecting
            );

            if (ccgVisivel) {

                body.classList.add("ccg-mode");
                body.classList.remove("ghoul-mode");

            } else {

                body.classList.remove("ccg-mode");
                body.classList.add("ghoul-mode");

            }

        },
        {
            threshold: 0.15
        }
    );

    ccgSections.forEach(section => {
        observer.observe(section);
    });

}


/* =========================================================
   CONTROLE MANUAL DO TEMA
   Útil caso futuramente o guia receba botões.
========================================================= */

function ativarTemaGhoul() {

    document.body.classList.remove("ccg-mode");
    document.body.classList.add("ghoul-mode");

}

function ativarTemaCCG() {

    document.body.classList.remove("ghoul-mode");
    document.body.classList.add("ccg-mode");

}


/* =========================================================
   EXPORTAÇÃO GLOBAL
========================================================= */

window.ativarTemaGhoul = ativarTemaGhoul;
window.ativarTemaCCG = ativarTemaCCG;
