const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Form = sequelize.define('Form', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'draft',
      validate: {
        isIn: [['draft', 'published', 'archived']]
      }
    },
    settings: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'forms'
  });

  // Define associations
  Form.associate = (models) => {
    Form.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'owner',
      onDelete: 'CASCADE'
    });
  };

  return Form;
};
