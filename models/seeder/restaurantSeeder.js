const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Restaurant = require("../Restaurant")
const User = require('../user')
const db = require("../../config/mongoose")

// 測試資料
const restaurantList = require("../../restaurant.json").results
const seedUsers = require('./user.json')

db.once('open', () => {
  Promise.all(
    seedUsers.map(seedUser => {
      return bcrypt
        .genSalt(10)

        .then(salt => bcrypt.hash(seedUser.password, salt))

        .then(hash => {
          return User.create({
            name: seedUser.name,
            email: seedUser.email,
            password: hash
          })
            .catch(err => console.log(err))
        })

        .then(user => {
          const userRestaurants = seedUser.userRestaurants.map(item => {
            //Object.assign()只會從來源物件將自身可列舉的屬性複製到目標物件
            return Object.assign(restaurantList[item - 1], { userId: user._id })
          })
          return userRestaurants
        })

        .then(userRestaurants => {
          return Restaurant.create(userRestaurants)
            .catch(err => console.log(err))
        })
    })
  )
    .then(() => {
      console.log('done.')
      process.exit()
    })
})

