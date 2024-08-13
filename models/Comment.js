module.exports = (sequelize, DataTypes) => {

  // 모델 정의
  const Comment = sequelize.define('Comment', {
    userid: {
      type: DataTypes.INTEGER, 
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
    }
    },
    comment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    comment_contents: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    card_id: { // 카드 ID 외래 키 추가
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Card',
        key: 'card_id'
      }
    }
  }, {
    tablename: 'Comment',
    freezeTableName: true,
    timestamps: true,
    // 내보낼때 tablename을 안해주면 대소문자 구별이 안됨(필요)
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      foreignKey: 'userid',
      targetKey: 'id'
    });
    
    Comment.belongsTo(models.Card, {
      foreignKey: 'card_id'
    });
    
    // 댓글 1 : 댓글좋아요 N
    Comment.hasMany(models.CommentLike, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      foreignKey: 'comment_id'
    });
  };

  return Comment;
};
