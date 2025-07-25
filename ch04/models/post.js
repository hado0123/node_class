const Sequelize = require('sequelize')

module.exports = class Post extends Sequelize.Model {
   static init(sequelize) {
      return super.init(
         {
            content: {
               type: Sequelize.STRING(140),
               allowNull: false,
            },
            img: {
               type: Sequelize.STRING(200),
               allowNull: true,
            },
         },
         { sequelize, timestamps: true, underscored: false, modelName: 'Post', tableName: 'posts', paranoid: false, charset: 'utf8mb4', collate: 'utf8mb4_general_ci' }
      )
   }

   static associate(db) {
      // n:n관계 정의
      // through: 교차테이블 명
      db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' })
   }
}
