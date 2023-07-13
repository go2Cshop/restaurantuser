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

router.post("/", (req, res) => {
  const userId = req.user._id
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  return Restaurant.create({ name, name_en, category, image, location, phone, google_map, rating, description, userId })
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

// 瀏覽特定餐廳
router.get("/:id", (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurantData => res.render("show", { restaurantData }))
    .catch(err => console.log(err))
})


// 編輯餐廳頁面
router.get("/:id/edit", (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurantData => res.render("edit", { restaurantData }))
    .catch(err => console.log(err))
})

// 更新餐廳
router.put("/:id", (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Restaurant.findByIdAndUpdate({ _id, userId }, req.body)
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(err => console.log(err))
})


// 刪除餐廳
router.delete("/:id", (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Restaurant.findByIdAndDelete({ _id, userId })
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

module.exports = router