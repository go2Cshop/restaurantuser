// 引用 Express 與 Express 路由器
const express = require("express")
const router = express.Router()
// 載入 Restaurant model
const Restaurant = require("../../models/Restaurant")

// use switch to decide sort definition

function sortDefinition(sort) {
  switch (sort) {
    case "name_asc":
      return { name_en: "asc" }
    case "name_desc":
      return { name_en: "desc" }
    case "category":
      return { category: "asc" }
    case "location":
      return { location: "asc" }
    default:
      return { _id: "asc" }
  }
}
// 路徑因為index有設定 /restaurants了 router不用再加 /restaurants前綴詞
// 搜尋特定餐廳
router.get("/search", (req, res) => {
  const keywords = req.query.keywords
  const sort = req.query.sort
  const keyword = req.query.keywords.trim().toLowerCase()


  Restaurant.find({})
    .lean()
    .sort(sortDefinition(sort)) //.sort({ _id: "asc" })
    .then(restaurantsData => {
      const filterRestaurantsData = restaurantsData.filter(
        data =>
          data.name.toLowerCase().includes(keyword) ||
          data.name_en.toLowerCase().includes(keyword) ||
          data.category.includes(keyword))
        res.render("index", { restaurantsData: filterRestaurantsData, keywords, sort })     
    })
    .catch(err => console.log(err))
})

// 新增餐廳頁面
router.get("/new", (req, res) => {
  res.render("new")
})


// 瀏覽特定餐廳
router.get("/:restaurantId", (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findById(restaurantId)
    .lean()
    .then(restaurantData => res.render("show", { restaurantData }))
    .catch(err => console.log(err))
})

// 新增餐廳 順序重要！！！ 放後面讀不到
router.post("/restaurants", (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

// 編輯餐廳頁面
router.get("/:restaurantId/edit", (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findById(restaurantId)
    .lean()
    .then(restaurantData => res.render("edit", { restaurantData }))
    .catch(err => console.log(err))
})

// 更新餐廳
router.put("/:restaurantId", (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findByIdAndUpdate(restaurantId, req.body)
    .then(() => res.redirect(`/restaurants/${restaurantId}`))
    .catch(err => console.log(err))
})

// 刪除餐廳
router.delete("/:restaurantId", (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findByIdAndDelete(restaurantId)
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

module.exports = router