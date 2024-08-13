module.exports = (sequelize, DataTypes) => {
    const CommentLike = sequelize.define('CommentLike', {
        comment_like_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
            }
        },
        comment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Comment',
                key: 'comment_id'
            }
        },
        card_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'Card',
              key: 'card_id'
            }
          }
    }, {
        tablename: 'CommentLike',
        freezeTableName: true,
        timestamps: false,
    });
    CommentLike.associate = (models) => {
        CommentLike.belongsTo(models.User, { 
            foreignKey: 'user_id' 
        });
        
        CommentLike.belongsTo(models.Comment, {
            foreignKey: 'comment_id'
        });
      };
    
    return CommentLike;
};
