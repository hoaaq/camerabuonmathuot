const { BaseModel } = require('@models/basemodel');

const relation = (selfclass) => {
  return {
    childs: {
      relation: BaseModel.HasManyRelation,
      modelClass: selfclass,
      join: {
        from: 'menu.id',
        to: 'menu.parent_id',
      },
    },
  };
};

module.exports = relation;
