const { BaseModel } = require('@models/basemodel');

const relation = (selfclass) => {
  return {
    childs: {
      relation: BaseModel.HasManyRelation,
      modelClass: selfclass,
      join: {
        from: 'location.id',
        to: 'location.parent_id',
      },
    },
    parent: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: selfclass,
      join: {
        from: 'location.parent_id',
        to: 'location.id',
      },
    },
    camera: {
      relation: BaseModel.HasManyRelation,
      modelClass: 'camera',
      join: {
        from: 'location.id',
        to: 'camera.location_id',
      },
    },
  };
};

module.exports = relation;
