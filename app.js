// 載入 express 並建構應用程式伺服器
const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
const exphbs = require('express-handlebars') //載入 handlebars
const Todo = require ('./models/todo') //載入Todo model
const bodyParser = require('body-parser') //載入bodyParser
const app = express()

mongoose.connect('mongodb://localhost/todo_list', { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

// 取得資料庫連線狀態
const db = mongoose.connection

// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

//建立一個名為hbs的樣板引擎並傳入exphbs與相關參數~多了extname才能把預設長檔名改為短檔名
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs'}))
//啟用樣板引擎hbs
app.set('view engine', 'hbs')
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 設定首頁路由 Controller所執行的動作類似中控台負責串聯Model跟view
app.get('/', (req, res) => {
  Todo.find() //從todo model資料庫查找出資料
    .lean() //把mongoose 的model物件轉換成乾淨的 javascript資料陣列
    .then(todos => res.render('index' , { todos })) //將資料傳給index前端樣板
    .catch(error => console.error(error)) //錯誤處理
})

//新增一筆to-do
app.get('/todos/new', (req, res) => {
  return res.render('new')
})

//create功能: 資料庫新增資料
app.post('/todos', (req, res) => {
  const name = req.body.name       // 從 req.body 拿出表單裡的 name 資料
  return Todo.create({ name })     // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id) //用this_id來動態捕捉每筆資料編號
    .lean() //把mongoose 的model物件轉換成乾淨的 javascript資料陣列
    .then((todo) => res.render('detail', { todo })) //將資料傳給index前端樣板
    .catch(error => console.log(error)) //錯誤處理
})


// 設定 port 3000
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})