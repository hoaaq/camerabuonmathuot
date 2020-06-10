const { BaseModel } = require('@models/basemodel');

const relation = (selfclass) => {
  return {
    dvr: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'dvr',
      join: {
        from: 'camera.dvrconfig_id',
        to: 'dvrconfig.id',
      },
    },
  };
};

module.exports = relation;
