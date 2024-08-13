module.exports = (sequelize, DataTypes) => {
    const CardLike = sequelize.define('CardLike', {
        card_like_id: {
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
        card_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Card',
                key: 'card_id'
            }
        }
    }, {
        tablename: 'CardLike',
        freezeTableName: true,
        timestamps: false,
    });

    return CardLike;
};
