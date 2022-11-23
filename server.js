// links https://api.dadosdemercado.com.br/v1/tickers/WEGE3/quotes
// https://api.dadosdemercado.com.br/v1/companies/
//const { data } = await axios('https://api.dadosdemercado.com.br/v1/companies/', {headers: headers});

const cors = require("cors");
const express = require("express");
const app = express();
const axios = require("axios");
app.use(cors());
const fs = require("fs");
const headers = { Authorization: "Token aqui" };
const ibovespa = [
  "TAEE4",
  "KLBN4",
  "RRRP3",
  "ALPA4",
  "ABEV3",
  "ARZZ3",
  "ASAI3",
  "AZUL4",
  "B3SA3",
  "BPAN4",
  "BBSE3",
  "BRML3",
  "BBDC3",
  "BBDC4",
  "BRAP4",
  "BBAS3",
  "BRKM5",
  "BRFS3",
  "BPAC11",
  "CRFB3",
  "CCRO3",
  "CMIG4",
  "CIEL3",
  "COGN3",
  "CPLE6",
  "CSAN3",
  "CPFE3",
  "CMIN3",
  "CVCB3",
  "CYRE3",
  "DXCO3",
  "ECOR3",
  "ELET3",
  "ELET6",
  "EMBR3",
  "ENBR3",
  "ENGI11",
  "ENEV3",
  "EGIE3",
  "EQTL3",
  "EZTC3",
  "FLRY3",
  "GGBR4",
  "GOAU4",
  "GOLL4",
  "NTCO3",
  "ITUB3",
  "SOMA3",
  "HAPV3",
  "HYPE3",
  "IRBR3",
  "ITSA4",
  "ITUB4",
  "JBSS3",
  "KLBN11",
  "RENT3",
  "LWSA3",
  "LREN3",
  "MGLU3",
  "MRFG3",
  "CASH3",
  "BEEF3",
  "MRVE3",
  "MULT3",
  "PCAR3",
  "PETR3",
  "PETR4",
  "PRIO3",
  "PETZ3",
  "POSI3",
  "QUAL3",
  "RADL3",
  "RAIZ4",
  "RDOR3",
  "RAIL3",
  "SBSP3",
  "SANB11",
  "SMTO3",
  "CSNA3",
  "SLCE3",
  "SULA11",
  "SUZB3",
  "TAEE11",
  "VIVT3",
  "TIMS3",
  "TOTS3",
  "UGPA3",
  "USIM5",
  "VALE3",
  "VIIA3",
  "WEGE3",
  "YDUQ3",
];
//usar para atualizar o db
app.get("/quotes", async function (req, res) {
  for (let i = 0; i < ibovespa.length; i++) {
    (function (i) {
      setTimeout(async function () {
        let ticker = ibovespa[i];
        if (ticker) {
          const { data } = await axios(`https://api.dadosdemercado.com.br/v1/tickers/${ticker}/quotes`,{ headers: headers });
          fs.writeFileSync(`./CotasDB/${ticker}.json`, JSON.stringify(data), {encoding: "utf-8",});
          console.log("carregando ações...");
        } else {
          console.log("Ticker incorreto");
        }
      }, 3000 * i);
    })(i);
  }
});
//atualizar dividendos
app.get("/dividendos", async function (req, res) {
  for (let i = 0; i < ibovespa.length; i++) {
    (function (i) {
      setTimeout(async function () {
        let ticker = ibovespa[i];
        if (ticker) {
          const { data } = await axios(`https://api.dadosdemercado.com.br/v1/companies/${ticker}/dividends`,{ headers: headers });
          fs.writeFileSync(`./dividendosDB/${ticker}.json`, JSON.stringify(data), {encoding: "utf-8",});
          console.log("carregando dividendos...");
        } else {
          console.log("Ticker incorreto");
        }
      }, 3000 * i);
    })(i);
  }
});

//Macro
app.get("/macroDDM", async function (req, res) {
  try {
    const { data } = await axios(`https://api.dadosdemercado.com.br/v1/macro/focus`, {headers: headers});
    fs.writeFileSync(`./indicesDB/indices.json`, JSON.stringify(data), {encoding: "utf-8",});
    res.json(data);
  } catch (error) {
    console.error(error);
  }
});

//Indicadores financeiros 
app.get("/indicadores", async function (req, res) {
  let ticker = req.query["ticker"];
  if (ticker) {
    const { data } = await axios(
      `https://api.dadosdemercado.com.br/v1/companies/${ticker}/market_ratios`,{ headers: headers });
      res.json(data);
  } else {
    console.log("Ticker incorreto");
  }
});

//extrair as informações das empresas (ATUALIZAR)
setTimeout(() => {
    function getData() {
        app.get(`/companies`, async (req, res) => {
            try {
                const { data } = await axios(`https://api.dadosdemercado.com.br/v1/companies`, {headers: headers});
                return res.json(data)
            } catch (error) {
                console.error(error);
            }
        });
    }
    getData()
},3000)

//exportar dados
app.get("/precos", function (req, res) {
  let ticker = req.query["ticker"];
  if (ticker) {
    res.sendFile(
      `C:/Users/guilh/OneDrive/Área de Trabalho/consumirAPI/CotasDB/${ticker}.json`
    );
  } else {
    console.log("Nome Inválido");
  }
});

// exportar info companias
app.get("/companies", function (req, res) {
  try {
    res.sendFile(
      "C:/Users/guilh/OneDrive/Área de Trabalho/consumirAPI/companiesDB/companies.json"
    );
  } catch (error) {
    console.error(error);
  }
});

app.get("/macro", function (req, res) {
  try {
    res.sendFile(
      "C:/Users/guilh/OneDrive/Área de Trabalho/consumirAPI/indicesDB/indices.json"
    );
  } catch (error) {
    console.error(error);
  }
});

app.listen("4567");
