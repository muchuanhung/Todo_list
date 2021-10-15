// 載入 express 並建構應用程式伺服器
const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
const exphbs = require('express-handlebars') //載入 handlebars
const Todo = require ('./models/todo')
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

// 設定首頁路由
app.get('/', (req, res) => {
  //拿到全部 Todo 資料
  Todo.find()
    .lean()
    .then(todos => res.render('index' , { todos }))
    .catch(error => console.error(error))
})


// 設定 port 3000
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})