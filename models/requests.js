module.exports = (sequelize, DataTypes) => {
  const Requests = sequelize.define("Requests", {
    request_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    request_user_id: DataTypes.UUID,
    location: DataTypes.STRING,
    time_requested: DataTypes.STRING
  });

  Requests.associate = function(models) {
    Requests.belongsTo(models.Users, {
      foreignKey: "request_user_id"
    });

    Requests.belongsTo(models.Users, {
      foreignKey: "matched_user_id"
    });
  };

  return Requests;
};
