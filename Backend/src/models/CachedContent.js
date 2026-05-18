import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CachedContent = sequelize.define('CachedContent', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  type: {
    type: DataTypes.ENUM('email', 'blog'),
    allowNull: false
  },
  prompt: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  optimizedPrompt: {
    type: DataTypes.TEXT,
    allowNull: true    // ← stores what was sent to Gemini
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  promptHash: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'cached_contents',
  timestamps: true
});

export default CachedContent;