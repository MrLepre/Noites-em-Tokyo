/* =========================================================
   NOITES EM TOKYO
   JavaScript principal
   Versão 0.1
========================================================= */


/* =========================
   NAVEGAÇÃO
========================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener('click', function (event) {

        const targetId = this.getAttribute('href');

        if (!targetId || targetId === "#") {
            return;
        }

        const target = document.querySelector(targetId);

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


/* =========================
   OBSERVAR SEÇÃO CCG
========================= */

const ccgSection = document.getElementById("ccg");

const observer = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                document.body.classList.add("ccg-active");

            } else {

                document.body.classList.remove("ccg-active");

            }

        });

    },
    {
        threshold: 0.15
    }
);

if (ccgSection) {
    observer.observe(ccgSection);
}


/* =========================
   ROLAGEM — DESTACAR MENU
========================= */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".sidebar nav a");

const sectionObserver = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) {
                return;
            }

            navLinks.forEach(link => {
                link.classList.remove("active");
            });

            const active = document.querySelector(
                `.sidebar nav a[href="#${entry.target.id}"]`
            );

            if (active) {
                active.classList.add("active");
            }

        });

    },
    {
        rootMargin: "-30% 0px -60% 0px"
    }
);

sections.forEach(section => {
    sectionObserver.observe(section);
});


/* =========================
   CALCULADORA BÁSICA
========================= */

function rolarDado(lados = 10) {

    return Math.floor(
        Math.random() * lados
    ) + 1;

}


function rolar2d10() {

    const dado1 = rolarDado(10);
    const dado2 = rolarDado(10);

    return {
        dado1,
        dado2,
        total: dado1 + dado2,
        critico: dado1 === 10 && dado2 === 10,
        falhaCritica: dado1 === 1 && dado2 === 1
    };

}


/* =========================
   MODIFICADOR DE ATRIBUTO
========================= */

function calcularModificador(valor) {

    const tabela = {
        0: -1,
        1: 0,
        2: 1,
        3: 2,
        4: 3,
        5: 4,
        6: 5,
        7: 6,
        8: 7,
        9: 8,
        10: 9
    };

    return tabela[valor] ?? 0;

}


/* =========================
   CÁLCULO DE CA
========================= */

function calcularCA(agilidade) {

    return 10 + calcularModificador(agilidade);

}


/* =========================
   CÁLCULO DE VIDA
========================= */

function calcularVida(constituicao) {

    return 20 + (constituicao * 2);

}


/* =========================
   CÁLCULO DE FADIGA
========================= */

function calcularFadiga(constituicao) {

    return 5 + calcularModificador(constituicao);

}


/* =========================
   INICIATIVA
========================= */

function rolarIniciativa(agilidade) {

    const resultado = rolar2d10();

    return {
        ...resultado,

        iniciativa:
            resultado.total +
            calcularModificador(agilidade)
    };

}


/* =========================
   ATAQUE
========================= */

function realizarAtaque(atributo, CA) {

    const resultado = rolar2d10();

    const modificador =
        calcularModificador(atributo);

    const total =
        resultado.total +
        modificador;

    return {

        ...resultado,

        total,

        acertou:
            resultado.critico ||
            total >= CA

    };

}


/* =========================
   DANO DESARMADO
========================= */

function danoDesarmado(forca) {

    const dado = rolarDado(6);

    return {
        dado,
        modificador:
            calcularModificador(forca),
        total:
            dado +
            calcularModificador(forca)
    };

}


/* =========================
   REAÇÃO — ESQUIVA
========================= */

function aplicarEsquiva(CA) {

    return CA + 2;

}


/* =========================
   REAÇÃO — DEFESA EMERGENCIAL
========================= */

function defesaEmergencial(dano) {

    const reducao = rolarDado(6);

    return {
        reducao,
        danoFinal:
            Math.max(0, dano - reducao)
    };

}


/* =========================
   TESTE DE SOBREVIVÊNCIA
========================= */

function testeSobrevivencia(constituicao) {

    const resultado = rolar2d10();

    const total =
        resultado.total +
        constituicao;

    return {

        ...resultado,

        total,

        sucesso:
            total >= 10

    };

}


/* =========================
   KAGUNE
========================= */

const kagunes = {

    ukaku: {
        nome: "Ukaku",
        bonus: "+2 Agilidade",
        especialidade: "Ataques à distância",
        fraqueza: "Baixa resistência"
    },

    koukaku: {
        nome: "Koukaku",
        bonus: "+2 Resistência",
        especialidade: "Grande defesa",
        fraqueza: "Movimentos lentos"
    },

    rinkaku: {
        nome: "Rinkaku",
        bonus: "+2 Regeneração",
        especialidade: "Alto dano",
        fraqueza: "Instabilidade emocional"
    },

    bikaku: {
        nome: "Bikaku",
        bonus: "+1 atributos físicos",
        especialidade: "Equilibrado",
        fraqueza: "Nenhuma específica"
    }

};


/* =========================
   CICLO NATURAL
========================= */

const cicloKagune = {

    ukaku: "bikaku",
    bikaku: "rinkaku",
    rinkaku: "koukaku",
    koukaku: "ukaku"

};


/* =========================
   VERIFICAR VANTAGEM
========================= */

function possuiVantagemKagune(atacante, defensor) {

    return cicloKagune[atacante] === defensor;

}


/* =========================
   RC — ESTÁGIO
========================= */

function determinarEstagioRC(rc) {

    if (rc < 1000) {
        return "Ghoul Iniciante";
    }

    if (rc < 3000) {
        return "Ghoul Experiente";
    }

    if (rc < 6000) {
        return "Ghoul Forte";
    }

    if (rc < 10000) {
        return "Elite";
    }

    if (rc < 15000) {
        return "Semi-Kakuja";
    }

    return "Kakuja Completa";

}


/* =========================
   UTILITÁRIOS
========================= */

function limitar(valor, minimo, maximo) {

    return Math.min(
        maximo,
        Math.max(minimo, valor)
    );

}


/* =========================
   API GLOBAL
========================= */

window.NoitesEmTokyo = {

    rolarDado,
    rolar2d10,

    calcularModificador,
    calcularCA,
    calcularVida,
    calcularFadiga,

    rolarIniciativa,
    realizarAtaque,
    danoDesarmado,

    aplicarEsquiva,
    defesaEmergencial,
    testeSobrevivencia,

    kagunes,
    cicloKagune,
    possuiVantagemKagune,

    determinarEstagioRC,
    limitar

};


console.log(
    "%c NOITES EM TOKYO — SISTEMA ONLINE ",
    "color:#d62845;font-weight:bold;font-size:14px;"
);

console.log(
    "Fase 1 — Fundamentos Jogáveis carregada."
);
