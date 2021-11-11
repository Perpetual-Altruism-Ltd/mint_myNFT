

export const genRandomString = ( length = 5 ) => {
  let text = ''
  const possible = '0123456789'
  const charLen = parseInt( length )

  for ( var i = 0; i < charLen; i++ )
    text += possible.charAt( Math.floor( Math.random() * possible.length ) )

  return text.toUpperCase()
}