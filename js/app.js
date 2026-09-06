/* =========================================================
   NOITES EM TOKYO
   APP.JS
   ========================================================= */


document.addEventListener(
    "DOMContentLoaded",
    () => {

        iniciarNavegacao();

        iniciarAnimacoes();

        verificarImagens();

    }
);



/* =========================================================
   NAVEGAÇÃO
   ========================================================= */

function iniciarNavegacao() {

    const links =
        document.querySelectorAll(
            ".nav-link"
        );


    const secoes =
        document.querySelectorAll(
            "section[id]"
        );


    /*
     * Rolagem suave
     */

    links.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const destino =
                    link.getAttribute(
                        "href"
                    );


                if (
                    !destino ||
                    !destino.startsWith("#")
                ) {

                    return;

                }


                const elemento =
                    document.querySelector(
                        destino
                    );


                if (!elemento) {

                    return;

                }


                event.preventDefault();


                elemento.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

            }
        );

    });



    /*
     * Atualizar menu durante a rolagem
     */

    function atualizarMenu() {

        let secaoAtual = "";


        secoes.forEach(secao => {

            const posicao =
                secao.offsetTop - 250;


            if (
                window.scrollY >= posicao
            ) {

                secaoAtual =
                    secao.id;

            }

        });


        links.forEach(link => {

            link.classList.remove(
                "active"
            );


            const destino =
                link.getAttribute(
                    "href"
                );


            if (
                destino ===
                `#${secaoAtual}`
            ) {

                link.classList.add(
                    "active"
                );

            }

        });

    }


    window.addEventListener(
        "scroll",
        atualizarMenu,
        {
            passive: true
        }
    );


    atualizarMenu();

}



/* =========================================================
   ANIMAÇÕES
   ========================================================= */

function iniciarAnimacoes() {

    const elementos =
        document.querySelectorAll(
            ".kagune-entry, " +
            ".kakuja-card, " +
            ".info-box, " +
            ".matchup, " +
            ".cycle-item, " +
            ".intro-panel, " +
            ".rule-card, " +
            ".attribute-card, " +
            ".fome-panel, " +
            ".fome-grid, " +
            ".rules-panel"
        );


    if (
        !("IntersectionObserver" in window)
    ) {

        elementos.forEach(
            elemento => {

                elemento.classList.add(
                    "visible"
                );

            }
        );

        return;

    }


    const observer =
        new IntersectionObserver(
            (entradas, observador) => {

                entradas.forEach(
                    entrada => {

                        if (
                            !entrada.isIntersecting
                        ) {

                            return;

                        }


                        entrada.target.classList.add(
                            "visible"
                        );


                        observador.unobserve(
                            entrada.target
                        );

                    }
                );

            },
            {
                threshold: 0.08
            }
        );


    elementos.forEach(
        elemento => {

            observer.observe(
                elemento
            );

        }
    );

}



/* =========================================================
   VERIFICAÇÃO DAS IMAGENS
   ========================================================= */

function verificarImagens() {

    const imagens =
        document.querySelectorAll(
            "img"
        );


    console.log(
        `[Noites em Tokyo] ${imagens.length} imagens encontradas.`
    );


    imagens.forEach(
        imagem => {


            imagem.addEventListener(
                "load",
                () => {

                    imagem.classList.add(
                        "imagem-carregada"
                    );

                },
                {
                    once: true
                }
            );


            imagem.addEventListener(
                "error",
                () => {

                    console.error(
                        "[Noites em Tokyo] Erro ao carregar:",
                        imagem.src
                    );


                    imagem.classList.add(
                        "imagem-erro"
                    );

                }
            );


            if (
                imagem.complete &&
                imagem.naturalWidth > 0
            ) {

                imagem.classList.add(
                    "imagem-carregada"
                );

            }

        }
    );

}



/* =========================================================
   FIM
   ========================================================= */

console.log(
    "%c NOITES EM TOKYO ",
    "font-weight:bold;font-size:16px;"
);

console.log(
    "Guia do sistema carregado."
);
