module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userid: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        freezeTableName: true, 
        timestamps: false 
    });

    User.addHook('beforeValidate', async (user, options) => {
        const existingUserid = await User.findOne({ where: { userid: user.userid } });
        if (existingUserid && existingUserid.id !== user.id) {
            throw new Error('이미 존재하는 아이디입니다.');
        }

        const existingNickname = await User.findOne({ where: { nickname: user.nickname } });
        if (existingNickname && existingNickname.id !== user.id) {
            throw new Error('이미 존재하는 닉네임입니다.');
        }
    });
    User.associate = (models) => {    
        // 유저 1 : 댓글 N
        User.hasMany(models.Comment, {
            onDelete: 'CASCADE', 
            onUpdate: 'CASCADE',
            foreignKey: 'userid',
            sourceKey: 'id'
        });
        // 유저 1 : 카드좋아요 N
        User.hasMany(models.CardLike, {
            onDelete: 'CASCADE', 
            onUpdate: 'CASCADE', 
            foreignKey: 'user_id' 
        });
        // 유저 1 : 댓글좋아요 N
        User.hasMany(models.CommentLike, {
            onDelete: 'CASCADE', 
            onUpdate: 'CASCADE', 
            foreignKey: 'user_id' 
        });
    };
    return User;
    
    // 유저 아이디 & 유저 닉네임 
    // unique : true는 db차원의 중복방지
    // model, controller에서 구현 / 미들웨어에서 구현 방법 존재 
    // model에 구현 (굳이 controller에서 구현해서 router로 넘어가는 로직안에 넣어서 사용할 필요 못느낌)
};
