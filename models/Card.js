module.exports = (sequelize, DataTypes) => {
    const Card = sequelize.define('Card', {
        card_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        card_corp: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
        card_name: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
        card_image: {
            type: DataTypes.STRING(500), // URL을 저장할 수 있도록 BLOB 대신 VARCHAR로 변경
            allowNull: true
        }
        ,
        performance:{
            type: DataTypes.STRING(50),
            allowNull: true
        },
        performance_details:{
            type: DataTypes.STRING(500),
            allowNull: true
        },
    }, {
        tablename: 'Card',
        freezeTableName: true,
        timestamps: false,
    });
    Card.associate = (models) => {
        // 카드 1 : 카드좋아요 N
        Card.hasMany(models.CardLike, { 
            onDelete: 'CASCADE', 
            onUpdate: 'CASCADE',
            foreignKey: 'card_id' 
        });
        // 카드 1 : 댓글좋아요 N
        Card.hasMany(models.CommentLike, { 
            onDelete: 'CASCADE', 
            onUpdate: 'CASCADE',
            foreignKey: 'card_id' 
        });
        // 카드 1 : 댓글 N = 카드별 댓글 작성을 위해서 ! 
        Card.hasMany(models.Comment, { 
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            foreignKey: 'card_id'
        });        
        Card.hasMany(models.Benefit, {
            foreignKey: 'card_id'
        });
      };
    return Card;
};
