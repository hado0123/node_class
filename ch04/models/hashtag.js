const Sequelize = require('sequelize')

module.exports = class Hashtag extends Sequelize.Model {
   static init(sequelize) {
      return super.init(
         {
            title: {
               type: Sequelize.STRING(15),
               allowNull: false,
               unique: true,
            },
         },
         { sequelize, timestamps: true, underscored: false, modelName: 'Hashtag', tableName: 'hashtags', paranoid: false, charset: 'utf8mb4', collate: 'utf8mb4_general_ci' }
      )
   }

   static associate(db) {
      // n:n관계 정의
      // through: 교차테이블 명
      db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' })
   }
}
