/* =========================================================
   NOITES EM TOKYO
   FASE 2 — CRIAÇÃO DE PERSONAGEM
========================================================= */


/* =========================================================
   MODIFICADORES
========================================================= */

function calcularModificador(valor) {

    valor = Number(valor);

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

    return tabela[Math.max(0, Math.min(10, valor))] ?? 0;
}


/* =========================================================
   DADOS
========================================================= */

function rolarDado(lados = 10) {

    return Math.floor(Math.random() * lados) + 1;
}


function rolar2d10() {

    return rolarDado(10) + rolarDado(10);
}


/* =========================================================
   ATRIBUTOS
========================================================= */

function obterAtributos() {

    return {

        forca:
            Number(document.getElementById("attrForca").value),

        agilidade:
            Number(document.getElementById("attrAgilidade").value),

        constituicao:
            Number(document.getElementById("attrConstituicao").value),

        inteligencia:
            Number(document.getElementById("attrInteligencia").value),

        sabedoria:
            Number(document.getElementById("attrSabedoria").value),

        carisma:
            Number(document.getElementById("attrCarisma").value),

        fome:
            Number(document.getElementById("attrFome").value)

    };
}


/* =========================================================
   KAGUNES
========================================================= */

const kagunes = {

    none: {

        nome: "Nenhuma",

        bonus:
            "Nenhuma Kagune selecionada.",

        descricao:
            "Personagem sem Kagune.",

        ca: 0

    },


    ukaku: {

        nome: "Ukaku",

        bonus:
            "+2 Agilidade. Especialização em ataques à distância.",

        descricao:
            "Kagune leve e veloz, especializada em ataques à distância. Sua principal limitação é a baixa resistência.",

        ca: 0

    },


    koukaku: {

        nome: "Koukaku",

        bonus:
            "+2 Resistência. Grande capacidade defensiva.",

        descricao:
            "Kagune extremamente resistente, capaz de assumir formas de escudo ou lâmina. Seus movimentos são mais lentos.",

        ca: 2

    },


    rinkaku: {

        nome: "Rinkaku",

        bonus:
            "+2 Regeneração. Alto potencial de dano.",

        descricao:
            "Kagune extremamente ofensiva, com forte regeneração. Sua principal fraqueza é a instabilidade emocional.",

        ca: 0

    },


    bikaku: {

        nome: "Bikaku",

        bonus:
            "+1 em todos os atributos físicos.",

        descricao:
            "Kagune equilibrada, normalmente semelhante a uma cauda.",

        ca: 1

    }

};


/* =========================================================
   ORIGENS
========================================================= */

const origens = {

    humano: {

        nome: "Humano",

        bonus:
            "Nenhum bônus sobrenatural.",

        sanidade:
            10,

        rc:
            0

    },


    ghoul: {

        nome: "Ghoul",

        bonus:
            "Acesso à Kagune, alimentação por carne humana e regeneração.",

        sanidade:
            10,

        rc:
            500

    },


    "one-eyed": {

        nome: "Ghoul de Um Olho",

        bonus:
            "+2 em todos os atributos físicos, RC muito elevado e evolução mais rápida.",

        sanidade:
            10,

        rc:
            1000

    }

};


/* =========================================================
   ORIGEM
========================================================= */

function atualizarOrigem() {

    atualizarFicha();

}


/* =========================================================
   VIDA
========================================================= */

function calcularVida(constituicao) {

    return 20 + (Number(constituicao) * 2);
}


/* =========================================================
   FADIGA
========================================================= */

function calcularFadiga(constituicao) {

    return 5 + calcularModificador(constituicao);
}


/* =========================================================
   CA
========================================================= */

function calcularCA(agilidade, bonusKagune = 0) {

    return 10 +
        calcularModificador(agilidade) +
        Number(bonusKagune);

}


/* =========================================================
   INICIATIVA
========================================================= */

function valorIniciativa(agilidade) {

    return calcularModificador(agilidade);

}


/* =========================================================
   SANIDADE
========================================================= */

function calcularSanidade(sabedoria, origem) {

    let base =
        10 + calcularModificador(sabedoria);

    if (origem === "one-eyed") {

        base += 1;

    }

    return Math.max(1, base);

}


/* =========================================================
   ATUALIZAR MODIFICADORES VISUAIS
========================================================= */

function atualizarModificadores() {

    const atributos = obterAtributos();


    document.getElementById("modForca").textContent =
        formatarMod(calcularModificador(atributos.forca));


    document.getElementById("modAgilidade").textContent =
        formatarMod(calcularModificador(atributos.agilidade));


    document.getElementById("modConstituicao").textContent =
        formatarMod(calcularModificador(atributos.constituicao));


    document.getElementById("modInteligencia").textContent =
        formatarMod(calcularModificador(atributos.inteligencia));


    document.getElementById("modSabedoria").textContent =
        formatarMod(calcularModificador(atributos.sabedoria));


    document.getElementById("modCarisma").textContent =
        formatarMod(calcularModificador(atributos.carisma));


    document.getElementById("modFome").textContent =
        formatarMod(calcularModificador(atributos.fome));

}


function formatarMod(valor) {

    return valor >= 0
        ? `+${valor}`
        : `${valor}`;

}


/* =========================================================
   APLICAR BÔNUS DA ORIGEM
========================================================= */

function aplicarBonusOrigem(atributos, origem) {

    const resultado = {
        ...atributos
    };


    if (origem === "one-eyed") {

        resultado.forca += 2;

        resultado.agilidade += 2;

        resultado.constituicao += 2;

    }


    return resultado;

}


/* =========================================================
   ATUALIZAR FICHA
========================================================= */

function atualizarFicha() {

    atualizarModificadores();


    const atributosBase =
        obterAtributos();


    const origem =
        document.getElementById("charOrigin").value;


    const kagune =
        document.getElementById("charKagune").value;


    const atributos =
        aplicarBonusOrigem(
            atributosBase,
            origem
        );


    const dadosOrigem =
        origens[origem] ||
        origens.humano;


    const dadosKagune =
        kagunes[kagune] ||
        kagunes.none;


    const vida =
        calcularVida(
            atributos.constituicao
        );


    const fadiga =
        calcularFadiga(
            atributos.constituicao
        );


    const ca =
        calcularCA(
            atributos.agilidade,
            dadosKagune.ca
        );


    const iniciativa =
        valorIniciativa(
            atributos.agilidade
        );


    const sanidade =
        calcularSanidade(
            atributos.sabedoria,
            origem
        );


    document.getElementById("sheetVida").textContent =
        vida;


    document.getElementById("sheetFadiga").textContent =
        fadiga;


    document.getElementById("sheetCA").textContent =
        ca;


    document.getElementById("sheetInitiative").textContent =
        `2d10 ${formatarMod(iniciativa)}`;


    document.getElementById("sheetSanidade").textContent =
        sanidade;


    document.getElementById("sheetFome").textContent =
        atributos.fome;


    document.getElementById("sheetRC").textContent =
        dadosOrigem.rc;


    document.getElementById("originBonus").textContent =
        dadosOrigem.bonus;


    document.getElementById("kaguneBonus").textContent =
        dadosKagune.bonus;


    document.getElementById("kagune-description").textContent =
        dadosKagune.descricao;


    document.getElementById("sheetOrigin").textContent =
        dadosOrigem.nome;

}


/* =========================================================
   GERAR FICHA
========================================================= */

function gerarFicha() {

    const nome =
        document.getElementById("charName").value.trim();


    const origem =
        document.getElementById("charOrigin").value;


    document.getElementById("sheetName").textContent =
        nome || "Personagem";


    if (!origem) {

        document.getElementById("sheetOrigin").textContent =
            "Humano";

    }


    atualizarFicha();


    const ficha =
        document.querySelector(".character-sheet");


    ficha.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}


/* =========================================================
   RESET
========================================================= */

function resetarFicha() {

    document.getElementById("charName").value = "";

    document.getElementById("charAge").value = "";

    document.getElementById("charDistrict").value = "";

    document.getElementById("charOrigin").value = "";

    document.getElementById("charKagune").value = "none";


    document.getElementById("attrForca").value = 1;

    document.getElementById("attrAgilidade").value = 1;

    document.getElementById("attrConstituicao").value = 1;

    document.getElementById("attrInteligencia").value = 1;

    document.getElementById("attrSabedoria").value = 1;

    document.getElementById("attrCarisma").value = 1;

    document.getElementById("attrFome").value = 0;


    document.getElementById("sheetName").textContent =
        "Personagem";


    atualizarFicha();

}


/* =========================================================
   TESTE DE ATRIBUTO
========================================================= */

function testeAtributo(valor) {

    const resultado =
        rolar2d10() +
        calcularModificador(valor);

    return resultado;

}


/* =========================================================
   ATAQUE
========================================================= */

function realizarAtaque(atributo, CA) {

    const dado1 = rolarDado(10);

    const dado2 = rolarDado(10);

    const modificador =
        calcularModificador(atributo);

    const total =
        dado1 +
        dado2 +
        modificador;


    return {

        dado1,

        dado2,

        modificador,

        total,

        critico:
            dado1 === 10 &&
            dado2 === 10,

        falhaCritica:
            dado1 === 1 &&
            dado2 === 1,

        acertou:
            total >= CA ||
            (dado1 === 10 && dado2 === 10)

    };

}


/* =========================================================
   DANO DESARMADO
========================================================= */

function danoDesarmado(forca) {

    return
        rolarDado(6) +
        calcularModificador(forca);

}


/* =========================================================
   REAÇÃO — ESQUIVA
========================================================= */

function aplicarEsquiva(caAtual) {

    return Number(caAtual) + 2;

}


/* =========================================================
   DEFESA EMERGENCIAL
========================================================= */

function defesaEmergencial(dano) {

    const reducao =
        rolarDado(6);

    return Math.max(
        0,
        Number(dano) - reducao
    );

}


/* =========================================================
   TESTE DE SOBREVIVÊNCIA
========================================================= */

function testeSobrevivencia(constituicao) {

    return
        rolar2d10() +
        calcularModificador(constituicao);

}


/* =========================================================
   REGENERAÇÃO GHOUL
========================================================= */

function regeneracaoGhoul(fome) {

    return
        rolarDado(6) +
        calcularModificador(fome);

}


/* =========================================================
   ESTÁGIO RC
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
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        atualizarFicha();

    }
);
