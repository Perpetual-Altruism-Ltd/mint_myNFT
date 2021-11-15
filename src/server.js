import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import compression from 'compression'
import cors from 'cors'
import dotenv from 'dotenv'

const app = express()

const __filename = fileURLToPath( import.meta.url )
const __dirname = dirname( __filename )

dotenv.config( { path: path.join( __dirname, '.env' ) } )

const https_redirect = function ( req, res, next ) {
  if ( req.headers['x-forwarded-proto'] != 'https' ) {
    return res.redirect( 'https://' + req.headers.host + req.url )
  } else {
    return next()
  }
}

// app.use(https_redirect)
app.use( cors() )
app.use( compression() )

// in the dist directory
app.use( '/', express.static( __dirname + '/ui' ) )
// Start the app by listening on the default
// app.get( '/*', function ( req, res ) {
//   const applicationPath = path.join( __dirname + '/src/ui/index.html' )
//   res.sendFile( applicationPath )
// } )

const PORT = process.env.PORT || 3005

app.listen( PORT, () => {
  console.log( `App listening on port ${PORT}.` )
} )
