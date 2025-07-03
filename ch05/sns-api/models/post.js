const Sequelize = require('sequelize')

module.exports = class Post extends Sequelize.Model {
   static init(sequelize) {
      return super.init(
         {
            //글내용
            content: {
               type: Sequelize.TEXT,
               allowNull: false,
            },
            //이미지 경로 및 파일명
            img: {
               type: Sequelize.STRING(200),
               allowNull: true,
            },
         },
         {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
         }
      )
   }

   static associate(db) {
      db.Post.belongsTo(db.User, {
         foreignKey: 'userId', // Post 테이블에 존재하는 컬럼 (외래키)
         targetKey: 'id', // User 테이블의 기준 컬럼 (기본키)
      })

      db.Post.belongsToMany(db.Hashtag, {
         through: 'PostHashtag',
         foreignKey: 'postId',
         otherKey: 'hashtagId',
      })
   }
}
