const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Word = require('./Word'); 

const WordInfo = sequelize.define('WordInfo', { 
  partOfSpeech: {
    type: DataTypes.STRING,
    allowNull: false
  },
  definition: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'WordInfo' 
});

Word.hasMany(WordInfo, { foreignKey: 'wordId', onDelete: 'CASCADE' });
WordInfo.belongsTo(Word, { foreignKey: 'wordId' });

module.exports = WordInfo;
