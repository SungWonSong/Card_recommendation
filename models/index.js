const { Sequelize } = require('sequelize');
const config = require('../config/config.js')[process.env.NODE_ENV || 'development'];
const db = {};

const sequelize = new Sequelize(
    config.database, 
    config.username, 
    config.password, 
    config
);

// 모델 불러오기
const User = require('./User.js')(sequelize, Sequelize); 
const Comment = require('./Comment.js')(sequelize, Sequelize); 
const Card = require('./Card.js')(sequelize, Sequelize); 
const CardLike = require('./CardLike.js')(sequelize, Sequelize); 
const CommentLike = require('./commentLike.js')(sequelize, Sequelize); 
const Benefit = require('./Benefit.js')(sequelize, Sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Benefit = Benefit;
db.User = User;
db.Comment = Comment;
db.Card = Card;
db.CardLike = CardLike;
db.CommentLike = CommentLike; // 여기 수정
// 모델간 관계 연결 

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});



module.exports = db;
