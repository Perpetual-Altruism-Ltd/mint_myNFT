"use strict;"

import Express from 'express'
import Cors from 'cors'

const app = Express()

app.use(Cors())

app.use(Express.static('src/ui'))

app.use(function(req, res, next) {
    res.sendFile('index.html', {root: 'src/ui'});
});


const PORT = process.env.PORT || 3005
app.listen(PORT, () => {
    console.log(`Web server listening on port ${PORT}`)
})
