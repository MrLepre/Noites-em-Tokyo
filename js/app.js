/* =========================================================
   GUIA RPG — APP.JS
   Remoção automática de fundo + navegação + efeitos
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIGURAÇÕES
       ===================================================== */

    const CONFIG = {
        // Quanto maior, mais cores semelhantes ao fundo serão removidas.
        // Recomendado: 35 a 60.
        tolerancia: 45,

        // Suavização da borda do recorte.
        suavizacao: 12,

        // Quantidade de pixels usada para descobrir a cor do fundo.
        amostraBorda: 8,

        // Ativa/desativa a remoção automática.
        removerFundoAutomaticamente: true
    };


    /* =====================================================
       NAVEGAÇÃO
       ===================================================== */

    const links = document.querySelectorAll(".nav-link");
    const secoes = document.querySelectorAll("section[id]");

    function atualizarNavegacao() {
        let secaoAtual = "";

        secoes.forEach(secao => {
            const topo = secao.offsetTop - 180;

            if (window.scrollY >= topo) {
                secaoAtual = secao.id;
            }
        });

        links.forEach(link => {
            link.classList.remove("active");

            const href = link.getAttribute("href");

            if (href === `#${secaoAtual}`) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", atualizarNavegacao);
    atualizarNavegacao();


    /* =====================================================
       SCROLL SUAVE
       ===================================================== */

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


    /* =====================================================
       ANIMAÇÃO DOS ELEMENTOS
       ===================================================== */

    const elementosAnimados = document.querySelectorAll(
        ".card, .kagune-card, .kakuja-card, .info-box, .matchup, .cycle-item"
    );

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            (entradas, obs) => {

                entradas.forEach(entrada => {

                    if (!entrada.isIntersecting) {
                        return;
                    }

                    entrada.target.classList.add("visible");
                    obs.unobserve(entrada.target);

                });

            },
            {
                threshold: 0.12
            }
        );

        elementosAnimados.forEach(elemento => {
            observer.observe(elemento);
        });

    } else {

        elementosAnimados.forEach(elemento => {
            elemento.classList.add("visible");
        });

    }


    /* =====================================================
       REMOÇÃO AUTOMÁTICA DE FUNDO
       ===================================================== */

    if (CONFIG.removerFundoAutomaticamente) {

        const imagens = document.querySelectorAll(
            "img.remover-fundo"
        );

        imagens.forEach(imagem => {
            processarImagem(imagem);
        });

    }


    /* =====================================================
       FUNÇÃO PRINCIPAL
       ===================================================== */

    function processarImagem(imagem) {

        /*
         * Espera a imagem carregar.
         */
        if (imagem.complete && imagem.naturalWidth > 0) {
            removerFundo(imagem);
        } else {

            imagem.addEventListener(
                "load",
                () => removerFundo(imagem),
                { once: true }
            );

        }

    }


    /* =====================================================
       REMOVER FUNDO
       ===================================================== */

    function removerFundo(imagem) {

        /*
         * Não processa imagens muito pequenas.
         */

        if (
            !imagem.naturalWidth ||
            !imagem.naturalHeight
        ) {
            return;
        }


        /*
         * Canvas temporário.
         */

        const canvas = document.createElement("canvas");

        const largura = imagem.naturalWidth;
        const altura = imagem.naturalHeight;

        canvas.width = largura;
        canvas.height = altura;

        const contexto = canvas.getContext("2d", {
            willReadFrequently: true
        });

        if (!contexto) {
            return;
        }


        /*
         * Desenha a imagem.
         */

        contexto.drawImage(
            imagem,
            0,
            0,
            largura,
            altura
        );


        /*
         * Obtém os pixels.
         */

        let dados;

        try {

            dados = contexto.getImageData(
                0,
                0,
                largura,
                altura
            );

        } catch (erro) {

            console.warn(
                "Não foi possível acessar os pixels da imagem:",
                erro
            );

            return;
        }


        const pixels = dados.data;


        /* =================================================
           DESCOBRIR A COR DO FUNDO
           ================================================= */

        const corFundo = descobrirCorFundo(
            pixels,
            largura,
            altura
        );


        /*
         * Se não conseguiu determinar o fundo,
         * abandona o processamento.
         */

        if (!corFundo) {
            return;
        }


        /* =================================================
           FLOOD FILL
           ================================================= */

        const visitados = new Uint8Array(
            largura * altura
        );

        const fila = [];


        /*
         * Coloca todos os pixels da borda
         * na fila inicial.
         */

        for (let x = 0; x < largura; x++) {

            adicionarPixelFila(
                x,
                0
            );

            adicionarPixelFila(
                x,
                altura - 1
            );

        }


        for (let y = 0; y < altura; y++) {

            adicionarPixelFila(
                0,
                y
            );

            adicionarPixelFila(
                largura - 1,
                y
            );

        }


        /*
         * Percorre o fundo.
         */

        let indiceFila = 0;

        while (indiceFila < fila.length) {

            const ponto = fila[indiceFila++];

            const x = ponto.x;
            const y = ponto.y;

            const indice =
                (y * largura + x) * 4;


            /*
             * Ignora pixels já processados.
             */

            const indicePixel =
                y * largura + x;

            if (visitados[indicePixel]) {
                continue;
            }

            visitados[indicePixel] = 1;


            const r = pixels[indice];
            const g = pixels[indice + 1];
            const b = pixels[indice + 2];
            const a = pixels[indice + 3];


            /*
             * Se já estiver transparente,
             * continua.
             */

            if (a === 0) {
                continue;
            }


            /*
             * Verifica se o pixel pertence ao fundo.
             */

            const distancia = distanciaCor(
                r,
                g,
                b,
                corFundo.r,
                corFundo.g,
                corFundo.b
            );


            if (
                distancia <= CONFIG.tolerancia
            ) {

                /*
                 * Calcula transparência
                 * gradual perto da borda.
                 */

                const alpha = calcularAlpha(
                    distancia
                );

                pixels[indice + 3] =
                    Math.min(
                        pixels[indice + 3],
                        alpha
                    );


                /*
                 * Adiciona vizinhos.
                 */

                adicionarVizinho(
                    x + 1,
                    y
                );

                adicionarVizinho(
                    x - 1,
                    y
                );

                adicionarVizinho(
                    x,
                    y + 1
                );

                adicionarVizinho(
                    x,
                    y - 1
                );

            }

        }


        /* =================================================
           APLICA RESULTADO
           ================================================= */

        contexto.putImageData(
            dados,
            0,
            0
        );


        /*
         * Substitui visualmente a imagem original
         * pelo canvas.
         */

        canvas.className =
            imagem.className;

        canvas.setAttribute(
            "aria-label",
            imagem.alt || ""
        );

        canvas.style.width =
            imagem.style.width || "100%";

        canvas.style.height =
            imagem.style.height || "auto";

        canvas.style.display =
            "block";

        canvas.style.maxWidth =
            "100%";

        canvas.style.objectFit =
            "contain";


        /*
         * Guarda referência ao canvas.
         */

        canvas.dataset.fundoRemovido =
            "true";


        /*
         * Mantém o espaço original.
         */

        imagem.parentNode.insertBefore(
            canvas,
            imagem
        );

        imagem.style.display = "none";


        /* =================================================
           ADICIONA CLASSE
           ================================================= */

        canvas.classList.add(
            "fundo-removido"
        );


        /* =================================================
           CONTROLES OPCIONAIS
           ================================================= */

        canvas.addEventListener(
            "contextmenu",
            event => {
                event.preventDefault();
            }
        );


        /*
         * -------------------------------------------------
         * FUNÇÕES INTERNAS
         * -------------------------------------------------
         */

        function adicionarPixelFila(x, y) {

            if (
                x < 0 ||
                y < 0 ||
                x >= largura ||
                y >= altura
            ) {
                return;
            }

            const idx =
                y * largura + x;

            if (!visitados[idx]) {

                fila.push({
                    x: x,
                    y: y
                });

            }

        }


        function adicionarVizinho(x, y) {

            if (
                x < 0 ||
                y < 0 ||
                x >= largura ||
                y >= altura
            ) {
                return;
            }

            const idx =
                y * largura + x;

            if (!visitados[idx]) {

                fila.push({
                    x: x,
                    y: y
                });

            }

        }

    }


    /* =====================================================
       DESCOBRIR COR DO FUNDO
       ===================================================== */

    function descobrirCorFundo(
        pixels,
        largura,
        altura
    ) {

        const cores = [];


        const tamanho =
            CONFIG.amostraBorda;


        /*
         * Coleta pixels da parte superior.
         */

        for (
            let y = 0;
            y < Math.min(tamanho, altura);
            y++
        ) {

            for (
                let x = 0;
                x < largura;
                x += Math.max(1, Math.floor(largura / 100))
            ) {

                adicionarCor(
                    x,
                    y
                );

            }

        }


        /*
         * Parte inferior.
         */

        for (
            let y = Math.max(
                0,
                altura - tamanho
            );
            y < altura;
            y++
        ) {

            for (
                let x = 0;
                x < largura;
                x += Math.max(1, Math.floor(largura / 100))
            ) {

                adicionarCor(
                    x,
                    y
                );

            }

        }


        /*
         * Lateral esquerda.
         */

        for (
            let x = 0;
            x < Math.min(tamanho, largura);
            x++
        ) {

            for (
                let y = 0;
                y < altura;
                y += Math.max(1, Math.floor(altura / 100))
            ) {

                adicionarCor(
                    x,
                    y
                );

            }

        }


        /*
         * Lateral direita.
         */

        for (
            let x = Math.max(
                0,
                largura - tamanho
            );
            x < largura;
            x++
        ) {

            for (
                let y = 0;
                y < altura;
                y += Math.max(1, Math.floor(altura / 100))
            ) {

                adicionarCor(
                    x,
                    y
                );

            }

        }


        if (cores.length === 0) {
            return null;
        }


        /*
         * Calcula a média das cores.
         */

        let r = 0;
        let g = 0;
        let b = 0;

        cores.forEach(cor => {

            r += cor.r;
            g += cor.g;
            b += cor.b;

        });


        return {
            r: Math.round(r / cores.length),
            g: Math.round(g / cores.length),
            b: Math.round(b / cores.length)
        };


        function adicionarCor(x, y) {

            const indice =
                (y * largura + x) * 4;

            const alpha =
                pixels[indice + 3];

            /*
             * Ignora pixels transparentes.
             */

            if (alpha === 0) {
                return;
            }

            cores.push({
                r: pixels[indice],
                g: pixels[indice + 1],
                b: pixels[indice + 2]
            });

        }

    }


    /* =====================================================
       DISTÂNCIA ENTRE CORES
       ===================================================== */

    function distanciaCor(
        r1,
        g1,
        b1,
        r2,
        g2,
        b2
    ) {

        const dr = r1 - r2;
        const dg = g1 - g2;
        const db = b1 - b2;

        return Math.sqrt(
            dr * dr +
            dg * dg +
            db * db
        );

    }


    /* =====================================================
       ALPHA DA BORDA
       ===================================================== */

    function calcularAlpha(
        distancia
    ) {

        const limite =
            CONFIG.tolerancia;

        const suavizacao =
            Math.min(
                CONFIG.suavizacao,
                limite
            );


        /*
         * Fundo muito próximo:
         * completamente transparente.
         */

        if (
            distancia <=
            limite - suavizacao
        ) {
            return 0;
        }


        /*
         * Região de transição.
         */

        const porcentagem =
            (
                distancia -
                (limite - suavizacao)
            ) /
            suavizacao;


        return Math.round(
            Math.max(
                0,
                Math.min(
                    255,
                    porcentagem * 255
                )
            )
        );

    }


    /* =====================================================
       REPROCESSAR IMAGENS
       ===================================================== */

    window.reprocessarFundos = function (
        novaTolerancia
    ) {

        if (
            typeof novaTolerancia === "number"
        ) {

            CONFIG.tolerancia =
                novaTolerancia;

        }


        /*
         * Remove canvases antigos.
         */

        document
            .querySelectorAll(
                "canvas.fundo-removido"
            )
            .forEach(canvas => {

                const imagem =
                    canvas.previousElementSibling;

                if (
                    imagem &&
                    imagem.tagName === "IMG"
                ) {

                    imagem.style.display =
                        "";

                }

                canvas.remove();

            });


        /*
         * Processa novamente.
         */

        document
            .querySelectorAll(
                "img.remover-fundo"
            )
            .forEach(imagem => {

                imagem.style.display =
                    "";

                processarImagem(imagem);

            });

    };


    /* =====================================================
       ERRO DE IMAGEM
       ===================================================== */

    document
        .querySelectorAll("img")
        .forEach(imagem => {

            imagem.addEventListener(
                "error",
                () => {

                    imagem.classList.add(
                        "imagem-erro"
                    );

                    console.warn(
                        "Não foi possível carregar:",
                        imagem.src
                    );

                }
            );

        });

});
