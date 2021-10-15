//負責資料庫互動元件
const mongoose =  require('mongoose')
const Schema = mongoose.Schema

//定義todo資料結構-schema資料庫綱要
const todoSchema = new Schema({
  name: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Todo', todoSchema)