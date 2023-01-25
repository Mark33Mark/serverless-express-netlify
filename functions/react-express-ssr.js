import serverless from "serverless-http";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from 'axios'
import React from "react";
import { renderToString } from "react-dom/server";
import App from "./react-app/App";


const functionName = 'react-express-ssr'
const app = express()

// app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(express.static(path.resolve(__dirname, "./public")))

const Html = ({ body, styles, title }) => {
  const stylesheet = (styles) ? `<style>${styles}</style>` : ''
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        ${stylesheet}
        <link rel="shortcut icon" href="../../favicon.svg">
      </head>
      <body style="margin:0">
        <div id="root">${body}</div>

      </body>
    </html>
  `
}
const routerBasePath = (process.env.NODE_ENV === 'dev') ? `/${functionName}` : `/.netlify/functions/${functionName}/`

app.get(routerBasePath, (req, res) => {

  const getUserData = async () => {
    try{  

      const userData = await axios.get('https://jsonplaceholder.typicode.com/users');
      return userData.data;

    } catch (error) {

      console.error("The axios data fetch from jsonplacehodler.typicode.com has failed: ", error);

    }
  }

  getUserData().then(users => {

    const reactAppHtml = renderToString(<App data={users} />)

    const html = Html({
      title: 'React SSR!',
      body: reactAppHtml,
      styles: "body{background: gray;}"
    });
      
    res.send(html);
  })

});

exports.handler = serverless(app);
