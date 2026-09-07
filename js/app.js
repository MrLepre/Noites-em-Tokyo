/* =========================================================
   NOITES EM TOKYO
   MOTOR BÁSICO DO SISTEMA
   ========================================================= */


/* =========================================================
   DADOS
   ========================================================= */

const sistema = {

    dadoBase: "2d10",

    movimento: 6,

    vidaBase: 20,

    danoDesarmado: "1d6",

    caBase: 10

};


const kagunes = {

    ukaku: {

        nome: "Ukaku",

        bonus: "+2 Agilidade",

        especialidade: "Ataques à distância",

        limitacao: "Baixa resistência"

    },

    koukaku: {

        nome: "Koukaku",

        bonus: "+2 Resistência",

        especialidade: "Grande defesa",

        limitacao: "Movimentos lentos"

    },

    rinkaku: {

        nome: "Rinkaku",

        bonus: "+2 Regeneração",

        especialidade: "Alto dano",

        limitacao: "Instável emocionalmente"

    },

    bikaku: {

        nome: "Bikaku",

        bonus: "+1 em todos os atributos físicos",

        especialidade: "Equilibrado",

        limitacao: "Nenhuma específica"

    }

};


/* =========================================================
   MODIFICADORES
   ========================================================= */

function calcularModificador(valor) {

    const atributo = Number(valor);

    if (atributo <= 0) return -1;

    return atributo - 1;

}


/* =========================================================
   DADOS
   ========================================================= */

function rolarDado(lados = 10) {

    return Math.floor(Math.random() * lados) + 1;

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


/* =========================================================
   TESTE BÁSICO
   ========================================================= */

function teste2d10(valorAtributo, dificuldade) {

    const modificador =
        calcularModificador(valorAtributo);

    const rolagem =
        rolar2d10();

    const resultado =
        rolagem.total + modificador;

    return {

        ...rolagem,

        modificador,

        resultado,

        sucesso: resultado >= dificuldade

    };

}


/* =========================================================
   CA
   ========================================================= */

function calcularCA(agilidade) {

    return sistema.caBase +
        calcularModificador(agilidade);

}


/* =========================================================
   VIDA
   ========================================================= */

function calcularVida(constituicao) {

    return sistema.vidaBase +
        (Number(constituicao) * 2);

}


/* =========================================================
   FADIGA
   ========================================================= */

function calcularFadiga(constituicao) {

    return 5 +
        calcularModificador(constituicao);

}


/* =========================================================
   INICIATIVA
   ========================================================= */

function rolarIniciativa(agilidade) {

    const rolagem =
        rolar2d10();

    const modificador =
        calcularModificador(agilidade);

    return {

        dado1: rolagem.dado1,

        dado2: rolagem.dado2,

        modificador,

        total:
            rolagem.total + modificador

    };

}


/* =========================================================
   ATAQUE
   ========================================================= */

function realizarAtaque(atributo, defesa) {

    const modificador =
        calcularModificador(atributo);

    const rolagem =
        rolar2d10();

    const total =
        rolagem.total + modificador;


    return {

        dado1: rolagem.dado1,

        dado2: rolagem.dado2,

        modificador,

        total,

        acerto:
            total >= defesa,

        critico:
            rolagem.critico,

        falhaCritica:
            rolagem.falhaCritica

    };

}


/* =========================================================
   DANO DESARMADO
   ========================================================= */

function danoDesarmado(forca) {

    const dado =
        rolarDado(6);

    const modificador =
        calcularModificador(forca);

    return {

        dado,

        modificador,

        total:
            Math.max(0, dado + modificador)

    };

}


/* =========================================================
   CRÍTICO
   ========================================================= */

function danoCritico(lados, modificador = 0) {

    return {

        dano:
            lados + modificador,

        maximizado: true

    };

}


/* =========================================================
   ESQUIVA
   ========================================================= */

function aplicarEsquiva(caAtual) {

    return caAtual + 2;

}


/* =========================================================
   DEFESA EMERGENCIAL
   ========================================================= */

function defesaEmergencial(danoRecebido) {

    const reducao =
        rolarDado(6);

    return {

        reducao,

        danoFinal:
            Math.max(0, danoRecebido - reducao)

    };

}


/* =========================================================
   SOBREVIVÊNCIA
   ========================================================= */

function testeSobrevivencia(constituicao) {

    const rolagem =
        rolar2d10();

    const resultado =
        rolagem.total +
        Number(constituicao);

    return {

        ...rolagem,

        resultado

    };

}


/* =========================================================
   REGENERAÇÃO
   ========================================================= */

function regeneracaoGhoul(fome) {

    const dado =
        rolarDado(6);

    const modificador =
        calcularModificador(fome);

    return {

        dado,

        modificador,

        total:
            Math.max(0, dado + modificador)

    };

}


/* =========================================================
   RANK DE GHOUL
   ========================================================= */

function determinarRankGhoul(rc) {

    rc = Number(rc);


    if (rc >= 10000)
        return "SS/SSS";


    if (rc >= 6000)
        return "Elite";


    if (rc >= 3000)
        return "Ghoul Forte";


    if (rc >= 1000)
        return "Ghoul Comum";


    return "Ghoul Fraco";

}


/* =========================================================
   ESTÁGIO DE RC
   ========================================================= */

function determinarEstagioRC(rc) {

    rc = Number(rc);


    if (rc >= 15000) {

        return "Kakuja Completa";

    }


    if (rc >= 10000) {

        return "Semi-Kakuja";

    }


    if (rc >= 6000) {

        return "Elite";

    }


    if (rc >= 3000) {

        return "Ghoul Forte";

    }


    if (rc >= 1000) {

        return "Ghoul Experiente";

    }


    return "Ghoul Iniciante";

}


/* =========================================================
   ALIMENTAÇÃO
   ========================================================= */

const alimentacao = {

    cadaverRuim: 20,

    desnutrido: 30,

    humanoComum: 50,

    humanoSaudavel: 60,

    atletaMilitar: 75,

    investigadorCCG: 100

};


const consumoGhoul = {

    fraco: 150,

    rankC: 200,

    rankB: 300,

    rankA: 450,

    rankSS: 700,

    rankSSS: 1000

};


/* =========================================================
   FOME
   ========================================================= */

function aumentarFome(fomeAtual, missoesSemComer = 1) {

    return Number(fomeAtual) +
        Number(missoesSemComer);

}


function verificarFrenesi(fome, dificuldade = 15) {

    if (fome < 10) {

        return {

            necessario: false,

            sucesso: true

        };

    }


    const teste =
        teste2d10(fome, dificuldade);


    return {

        necessario: true,

        sucesso: teste.sucesso,

        resultado: teste.resultado

    };

}


/* =========================================================
   SEMI-KAKUJA
   ========================================================= */

function ativarSemiKakuja(vontade, dificuldade = 15) {

    const teste =
        teste2d10(vontade, dificuldade);


    return {

        ativada: true,

        controlada: teste.sucesso,

        resultado: teste.resultado,

        frenesi: !teste.sucesso

    };

}


/* =========================================================
   GHOUL DE UM OLHO
   ========================================================= */

function rolarGhoulUmOlho() {

    const resultado =
        rolarDado(100);

    return {

        resultado,

        umOlho:
            resultado >= 96

    };

}


/* =========================================================
   CICLO DE KAGUNES
   ========================================================= */

function vantagemKagune(atacante, defensor) {

    const ciclo = {

        ukaku: "bikaku",

        bikaku: "rinkaku",

        rinkaku: "koukaku",

        koukaku: "ukaku"

    };


    return ciclo[atacante] === defensor;

}


/* =========================================================
   UTILITÁRIOS
   ========================================================= */

function limitar(valor, minimo, maximo) {

    return Math.min(
        maximo,
        Math.max(minimo, valor)
    );

}


function formatarNumero(numero) {

    return Number(numero)
        .toLocaleString("pt-BR");

}


/* =========================================================
   EXPORTAÇÃO
   ========================================================= */

window.NoitesEmTokyo = {

    sistema,

    kagunes,

    alimentacao,

    consumoGhoul,

    calcularModificador,

    rolarDado,

    rolar2d10,

    teste2d10,

    calcularCA,

    calcularVida,

    calcularFadiga,

    rolarIniciativa,

    realizarAtaque,

    danoDesarmado,

    danoCritico,

    aplicarEsquiva,

    defesaEmergencial,

    testeSobrevivencia,

    regeneracaoGhoul,

    determinarRankGhoul,

    determinarEstagioRC,

    aumentarFome,

    verificarFrenesi,

    ativarSemiKakuja,

    rolarGhoulUmOlho,

    vantagemKagune,

    limitar,

    formatarNumero

};


console.log(
    "Noites em Tokyo — Sistema carregado."
);
