const express = require('express')
const path = require('path')
const port = process.env.PORT || 3000
const app = express()

// serve static assets normally
app.use(express.static(__dirname + '/'))
app.listen(port)
console.log("server started on port " + port)