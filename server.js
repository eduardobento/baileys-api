const express = require("express")
const cors = require("cors")
const WhatsAppWeb = require("Baileys")
const fs = require("fs")

const fileLogado = "c:/temp/connected.json"

let client = new WhatsAppWeb()

if (fs.existsSync(fileLogado)) {
  const authJSON = JSON.parse(fs.readFileSync(fileLogado))
  console.log(authJSON)
  try {
    client.login(authJSON)
  } catch (error) {
    console.log(error)
    fs.unlink(fileLogado, () => {
      console.log("aqui")
    })
  }
} else {
  client.connect()
}

const app = express()
app.use(express.json())

app.use(cors())
app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With")
  next()
})

client.handlers.onConnected = () => {
  /* when you're successfully authenticated with 
    the WhatsApp Web servers */

  const jsonData = JSON.stringify(client.base64EncodedAuthInfo())
  var fs = require("fs")
  fs.writeFile(fileLogado, jsonData, function (err) {
    if (err) {
      console.log(err)
    }
  })
}

client.handlers.onUnreadMessage = (message) => {
  /* called when you have a pending unread message or recieve a new message */

  console.log(JSON.stringify(message))
}

app.get("/", function (req, res) {
  client.sendTextMessage("554799643507@s.whatsapp.net", "Bom dia")
  res.send("Hello World")
})

app.listen(process.env.PORT || 3000)
