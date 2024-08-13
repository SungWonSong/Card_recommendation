const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Benefit = sequelize.define('Benefit', {
    benefit_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    card_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category_name: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    benefit_desc: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    benefit_details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    benefit_ranking: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    tableName: 'Benefit',
    freezeTableName: true,
    timestamps: false,
  });

  Benefit.associate = (models) => {
    Benefit.belongsTo(models.Card, {
      foreignKey: 'card_id',
      targetKey: 'card_id'
    });
  };

  return Benefit;
};