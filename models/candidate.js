export default (sequelize, DataTypes) => {
  const Candidate = sequelize.define('candidate', {
    slug: DataTypes.STRING,
    name: DataTypes.STRING,
    birth_date: DataTypes.DATE,
    hometown: DataTypes.STRING,
    color: DataTypes.STRING,
    avatar: DataTypes.STRING,
    video_url: DataTypes.STRING,
    video_caption: DataTypes.STRING
  });

  Candidate.associate = models => {
    Candidate.belongsTo(models.Election);
    Candidate.hasMany(models.Position);
    Candidate.belongsToMany(models.Message, {
      as: {
        singular: 'party',
        plural: 'parties'
      },
      through: models.CandidateParty
    });

    Candidate.belongsToMany(models.Message, {
      as: {
        singular: 'bio',
        plural: 'bios'
      },
      through: models.CandidateBio
    });

    Candidate.belongsToMany(models.Message, {
      as: {
        singular: 'caption',
        plural: 'captions'
      },
      through: models.CandidateCaption
    });
  };

  return Candidate;
};
