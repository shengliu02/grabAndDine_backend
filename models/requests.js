module.exports = (sequelize, DataTypes) => {
    const Requests = sequelize.define('Requests', {
        request_id : {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        user_id: DataTypes.UUID,
        matched_user_id: DataTypes.UUID,
        location: DataTypes.STRING,
        time_requested: DataTypes.STRING, 
    });

    Requests.associate = function(models){
        Requests.belongsTo(models.Users, {
            foreignKey: 'user_id',
        })

        Requests.belongsTo(models.Users, {
            foreignKey: '_user_id',
        })

    };
    
    return Requests;
};