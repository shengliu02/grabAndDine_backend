module.exports = (sequelize, DataTypes) => {
  const Matches = sequelize.define('Matches', {
    match_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    user1_id: DataTypes.UUID,
    user2_id: DataTypes.UUID,

  });


  Matches.associate = function (models) {
    Matches.belongsTo(models.Users, {
      foreignKey: 'user1_id',
    });

    Matches.belongsTo(models.Users, {
      foreignKey: 'user2_id',
    });
  };

  return Matches;
};
