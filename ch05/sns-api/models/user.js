const Sequelize = require('sequelize')

module.exports = class User extends Sequelize.Model {
   static init(sequelize) {
      return super.init(
         {
            email: {
               type: Sequelize.STRING(40),
               allowNull: false,
               unique: true,
            },
            nick: {
               type: Sequelize.STRING(15),
               allowNull: false,
            },
            password: {
               type: Sequelize.STRING(100),
               allowNull: false,
            },
         },
         {
            sequelize,
            timestamps: true, //createAt, updateAt 자동 생성
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true, // deleteAt 자동생성, 소프트 삭제
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
         }
      )
   }

   static associate(db) {
      db.User.hasMany(db.Post, {
         foreignKey: 'user_id', // Post 테이블의 외래키 컬럼
         sourceKey: 'id', // User 테이블의 기준 컬럼
      })

      db.User.belongsToMany(db.User, {
         foreignKey: 'followingId', // Follow 테이블에서 사용할 FK
         as: 'Followers', // User 테이블 별명
         through: 'Follow', // 교차테이블명
      })

      db.User.belongsToMany(db.User, {
         foreignKey: 'followerId', // Follow 테이블에서 사용할 FK
         as: 'Followings', // User 테이블 별명
         through: 'Follow', // 교차테이블명
      })
   }
}
