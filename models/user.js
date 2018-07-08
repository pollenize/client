import jwt from 'jsonwebtoken';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING
  });

  User.associate = models => {
    User.belongsTo(models.Organization);
  };

  User.prototype.toJWT = function(expiresIn = '7 days') {
    const payload = this.get();
    delete payload.password;

    return jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn,
      subject: payload.id.toString()
    });
  };

  return User;
};
