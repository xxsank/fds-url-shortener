const express = require('express')
const morgan = require('morgan')
const randomstring = require('randomstring');

const app = express()

const urls = [
  {
    slug: randomstring.generate(8),
    longUrl: 'https://www.naver.com'
  }
]

app.use('/static', express.static('public'))
app.use(morgan('dev'))

app.get('/',(req,res) =>{
  const host = req.get('host')
  res.render('index.ejs',{host,urls})
})

app.get('/:slug', (req,res) => {
  const urlItem = urls.find(item => item.slug === req.params.slug)
  if(urlItem){
    res.redirect(301,urlItem.longUrl)
  } else {
    res.status(400)
    res.send('404 NOT FOUND')
  }
})

app.listen(3000, () => {
  console.log('listening...')
})