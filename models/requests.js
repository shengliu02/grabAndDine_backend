module.exports = (sequelize, DataTypes) => {
  const Requests = sequelize.define("Requests", {
    request_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    is_matched: DataTypes.BOOLEAN,
    request_user_id: DataTypes.UUID,
    location: DataTypes.STRING,
  });

  Requests.associate = function(models) {
    Requests.belongsTo(models.Users, {
      foreignKey: "request_user_id"
    });

  };

  return Requests;
};
