const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true, // sequelize validation
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dietary_options: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    bios: {
      type: DataTypes.STRING,
      defaultValue: 'Do not have a bios yet!',
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      defaultValue: 'Unspecified',
      allowNull: false,
<<<<<<< HEAD
    },
    age: {
=======
    },      
      age: {
>>>>>>> add_db
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  });

  // this is a Sequelize lifecycle hook
  Users.beforeCreate(user => new sequelize.Promise((resolve) => {
<<<<<<< HEAD
    bcrypt.hash(user.password_hash, null, null, (err, hashedPassword) => {
      resolve(hashedPassword);
    });
  }).then((hashedPw) => {
    user.password_hash = hashedPw;
  }));
=======
      bcrypt.hash(user.password_hash, null, null, (err, hashedPassword) => {
        resolve(hashedPassword);
      });
    }).then((hashedPw) => {
      user.password_hash = hashedPw;
    }),);
>>>>>>> add_db

  Users.associate = function (models) {
    Users.hasMany(models.Requests, {
      foreignKey: 'request_user_id',
      as: 'request_user_id',
    });

    Users.hasMany(models.Requests, {
      foreignKey: 'matched_user_id',
      as: 'matched_user_id',
    });
  };

  return Users;
};
