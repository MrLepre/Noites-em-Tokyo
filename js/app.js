document.addEventListener("DOMContentLoaded", () => {

    /*
    =========================================
    NAVEGAÇÃO
    =========================================
    */

    const navLinks = document.querySelectorAll(".nav-link");

    const sections = document.querySelectorAll("section[id]");


    /*
    =========================================
    ATUALIZAR MENU CONFORME A ROLAGEM
    =========================================
    */

    const updateActiveNavigation = () => {

        let currentSection = "";

        sections.forEach(section => {

            const sectionTop = section.offsetTop;

            const sectionHeight = section.offsetHeight;

            if (
                window.scrollY >=
                sectionTop - sectionHeight * 0.25
            ) {
                currentSection = section.id;
            }

        });


        navLinks.forEach(link => {

            link.classList.remove("active");

            const href = link.getAttribute("href");

            if (href === `#${currentSection}`) {

                link.classList.add("active");

            }

        });

    };


    window.addEventListener(
        "scroll",
        updateActiveNavigation
    );


    updateActiveNavigation();



    /*
    =========================================
    FECHAR MENU / NAVEGAÇÃO
    =========================================
    */

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navLinks.forEach(item => {
                item.classList.remove("active");
            });

            link.classList.add("active");

        });

    });



    /*
    =========================================
    ANIMAÇÃO DE ENTRADA
    =========================================
    */

    const cards = document.querySelectorAll(
        ".kagune-card, .kakuja-card, .rule-box"
    );


    const observer = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                }

            });

        },
        {
            threshold: 0.1
        }
    );


    cards.forEach(card => {
        observer.observe(card);
    });



    /*
    =========================================
    FALLBACK PARA IMAGENS
    =========================================
    */

    const images = document.querySelectorAll("img");


    images.forEach(image => {

        image.addEventListener(
            "error",
            () => {

                image.style.display = "none";

                const container =
                    image.parentElement;

                container.classList.add(
                    "image-error"
                );

                console.warn(
                    "Imagem não encontrada:",
                    image.src
                );

            }
        );

    });

});
