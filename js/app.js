/* =========================================================
   GUIA RPG — APP.JS
   Navegação, animações e tratamento básico das imagens
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    iniciarNavegacao();
    iniciarAnimacoes();
    iniciarTratamentoDeImagens();

});


/* =========================================================
   NAVEGAÇÃO
   ========================================================= */

function iniciarNavegacao() {

    const links = document.querySelectorAll(".nav-link");
    const secoes = document.querySelectorAll("section[id]");

    /*
     * Rolagem suave ao clicar no menu
     */

    links.forEach(link => {

        link.addEventListener("click", event => {

            const destino = link.getAttribute("href");

            if (!destino || !destino.startsWith("#")) {
                return;
            }

            const elemento = document.querySelector(destino);

            if (!elemento) {
                return;
            }

            event.preventDefault();

            elemento.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /*
     * Atualiza o item ativo do menu
     * conforme a posição da página
     */

    function atualizarNavegacao() {

        let secaoAtual = "";

        secoes.forEach(secao => {

            const topo = secao.offsetTop - 220;

            if (window.scrollY >= topo) {
                secaoAtual = secao.id;
            }

        });


        links.forEach(link => {

            link.classList.remove("active");

            const destino =
                link.getAttribute("href");

            if (
                destino ===
                `#${secaoAtual}`
            ) {

                link.classList.add("active");

            }

        });

    }


    window.addEventListener(
        "scroll",
        atualizarNavegacao,
        {
            passive: true
        }
    );


    atualizarNavegacao();

}


/* =========================================================
   ANIMAÇÕES DE ENTRADA
   ========================================================= */

function iniciarAnimacoes() {

    const elementos =
        document.querySelectorAll(
            ".kagune-section, " +
            ".kakuja-card, " +
            ".info-box, " +
            ".matchup, " +
            ".cycle-item, " +
            ".intro-panel, " +
            ".rules-panel"
        );


    /*
     * Caso o navegador não suporte
     * IntersectionObserver
     */

    if (!("IntersectionObserver" in window)) {

        elementos.forEach(elemento => {

            elemento.classList.add("visible");

        });

        return;
    }


    const observer =
        new IntersectionObserver(
            (entradas, observador) => {

                entradas.forEach(entrada => {

                    if (!entrada.isIntersecting) {
                        return;
                    }

                    entrada.target.classList.add(
                        "visible"
                    );

                    observador.unobserve(
                        entrada.target
                    );

                });

            },
            {
                threshold: 0.08
            }
        );


    elementos.forEach(elemento => {

        observer.observe(elemento);

    });

}


/* =========================================================
   IMAGENS
   ========================================================= */

function iniciarTratamentoDeImagens() {

    const imagens =
        document.querySelectorAll("img");


    console.log(
        `[GUIA RPG] ${imagens.length} imagens encontradas.`
    );


    imagens.forEach(imagem => {

        /*
         * NÃO MODIFICAMOS A IMAGEM.
         *
         * Ela será exibida exatamente como
         * está no arquivo JPEG.
         */


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


        /*
         * Caso a imagem já tenha carregado
         * antes do JavaScript executar.
         */

        if (
            imagem.complete &&
            imagem.naturalWidth > 0
        ) {

            imagem.classList.add(
                "imagem-carregada"
            );

        }


        /*
         * Tratamento de erro.
         */

        imagem.addEventListener(
            "error",
            () => {

                console.error(
                    "[GUIA RPG] Não foi possível carregar:",
                    imagem.src
                );

                imagem.classList.add(
                    "imagem-erro"
                );

            }
        );

    });

}


/* =========================================================
   FINAL
   ========================================================= */

console.log(
    "%c GUIA RPG carregado corretamente ",
    "font-weight: bold;"
);
