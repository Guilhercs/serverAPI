// links https://api.dadosdemercado.com.br/v1/tickers/WEGE3/quotes
// https://api.dadosdemercado.com.br/v1/companies/
//const { data } = await axios('https://api.dadosdemercado.com.br/v1/companies/', {headers: headers});

const cors = require("cors");
const express = require("express");
const app = express();
const axios = require("axios");
const ibovespa = require("./models/ibovespa");
const ifix = require("./models/ifix");

app.use(cors());
const fs = require("fs");
const headers = { Authorization: "" };

//usar para atualizar o db de cotas IBOVESPA
app.get("/quotes", async function (req, res) {
  for (let i = 0; i < ibovespa.length; i++) {
    (function (i) {
      setTimeout(async function () {
        let ticker = ibovespa[i];
        if (ticker) {
          const { data } = await axios(
            `https://api.dadosdemercado.com.br/v1/tickers/${ticker}/quotes`,
            { headers: headers }
          );
          fs.writeFileSync(`./CotasDB/${ticker}.json`, JSON.stringify(data), {
            encoding: "utf-8",
          });
          console.log("carregando ações...");
        } else {
          console.log("Ticker incorreto");
        }
      }, 3000 * i);
    })(i);
  }
});

//atualizar IFIX
app.get("/ifix", async function (req, res) {
  for (let i = 0; i < ifix.length; i++) {
    (function (i) {
      setTimeout(async function () {
        let ticker = ifix[i];
        if (ticker) {
          const { data } = await axios(
            `https://api.dadosdemercado.com.br/v1/tickers/${ticker}/quotes`,
            { headers: headers }
          );
          fs.writeFileSync(`./IfixDB/${ticker}.json`, JSON.stringify(data), {
            encoding: "utf-8",
          });
          console.log("carregando ifix...");
        } else {
          console.log("Ticker incorreto");
        }
      }, 3000 * i);
    })(i);
  }
});

//atualizar dividendos
app.get("/dividendosDDM", async function (req, res) {
  for (let i = 0; i < ibovespa.length; i++) {
    (function (i) {
      setTimeout(async function () {
        let ticker = ibovespa[i];
        if (ticker) {
          const { data } = await axios(
            `https://api.dadosdemercado.com.br/v1/companies/${ticker}/dividends`,
            { headers: headers }
          );
          fs.writeFileSync(
            `./dividendosDB/${ticker}.json`,
            JSON.stringify(data),
            { encoding: "utf-8" }
          );
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
    const { data } = await axios(
      `https://api.dadosdemercado.com.br/v1/macro/focus`,
      { headers: headers }
    );
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
      `https://api.dadosdemercado.com.br/v1/companies/${ticker}/market_ratios`,
      { headers: headers }
    );
    res.json(data);
  } else {
    console.log("Ticker incorreto");
  }
});

//extrair as informações das empresas (ATUALIZAR)
app.get(`/companiesDDM`, async (req, res) => {
  try {
    const { data } = await axios(
      `https://api.dadosdemercado.com.br/v1/companies`,
      { headers: headers }
    );
    return res.json(data);
  } catch (error) {
    console.error(error);
  }
});

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

app.get("/dividendos", function (req, res) {
  let ticker = req.query["ticker"];
  try {
    res.sendFile(
      `C:/Users/guilh/OneDrive/Área de Trabalho/consumirAPI/dividendosDB/${ticker}.json`
    );
  } catch (error) {
    console.error(error);
  }
});

app.listen("4567");
