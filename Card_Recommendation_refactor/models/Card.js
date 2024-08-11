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
        },
        card_traffic: {
            type: DataTypes.STRING(40),
            allowNull: true
        },
        traffic_details: {
            type: DataTypes.TEXT, 
            // details 내용이 많기 때문에 text 사용, TEXT 타입의 데이터는 다른 속성들과 별도로 다른 페이지에 저장되기 때문에 데이터 제한이 없음. 따라서 일반적으로 긴 텍스트 데이터를 저장할 때는 TEXT 타입을 사용함
            allowNull: true
        },
        traffic_ox: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        traffic_ranking: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        card_store: {
            type: DataTypes.STRING(100), // varchar(40)은 데이터에 비해 크기가 너무 작다고 나와서 100으로 수정
            allowNull: true
        },
        store_details: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        store_ox: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        store_ranking: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        card_cafe: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        cafe_details: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        cafe_ox: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        cafe_ranking: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        card_sub: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        sub_details: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        sub_ox: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        sub_ranking: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        card_book: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        book_details: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        book_ox: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        book_ranking: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        performance: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        performance_details: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        performance_ox: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        tablename: 'Card',
        freezeTableName: true,
        timestamps: false,
    });

    return Card;
};
