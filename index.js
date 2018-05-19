require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const randomstring = require('randomstring')
const bodyParser = require('body-parser')

const app = express()

const urls = [
  {
    slug: randomstring.generate(8),
    longUrl: 'https://www.naver.com'
  }
]

//어떤 요청 메소드든 간에, 
//static 경로로 요청이 들어왔을 때 미들웨어를 실행시킨다.
app.use('/static', express.static('public'))
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))

// 미들웨어 = 함수
function helloMiddleware(req, res, next) {
  console.log('hello')
  res.set('X-Message','Hello')

  const secret = req.query.secret || req.body.secret
  if (req.query.secret !== process.env.SECRET){
    res.status(403)
    res.send('403 Forbidden')
  }else{
    next() // 다음 미들웨어로 처리과정을 넘김
  }
}

app.use(helloMiddleware)

//get 메소드로 / 경로에 요청이 들어왔을 때 미들웨어를 실행시킨다
app.get('/',(req,res) =>{
  const host = req.get('host')
  res.render('index.ejs',{host,urls})
})

app.get('/new',(req,res) => {
  res.render('new.ejs', {secret: process.env.SECRET})
})

app.post('/new', (req,res) => {
  const urlItem ={
    longUrl: req.body.longUrl,
    slug: randomstring.generate(8)
  }
  urls.push(urlItem);
  res.redirect('/')
})

app.get('/:slug', (req,res,next) => {
  const urlItem = urls.find(item => item.slug === req.params.slug)
  if(urlItem){
    res.redirect(301,urlItem.longUrl)
  } else {
    // res.status(400)
    // res.send('404 NOT FOUND')
    next()
  }
})

app.listen(3000, () => {
  console.log('listening...')
})