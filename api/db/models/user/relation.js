const { BaseModel } = require('@models/basemodel');

const relation = (selfclass) => {
  return {
    user_token: {
      relation: BaseModel.HasManyRelation,
      modelClass: 'user_token',
      join: {
        from: 'user.id',
        to: 'user_token.user_id',
      },
    },
    role: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'role',
      join: {
        from: 'user.role_id',
        to: 'role.id',
      },
    },
    // hierarchy: {
    //   relation: BaseModel.BelongsToOneRelation,
    //   modelClass: 'hierarchy',
    //   join: {
    //     from: 'user.hierarchy_id',
    //     to: 'hierarchy.id',
    //   },
    // },
    location: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'location',
      join: {
        from: 'user.location_id',
        to: 'location.id',
      },
    },

    childs: {
      relation: BaseModel.HasManyRelation,
      modelClass: selfclass,
      join: {
        from: 'user.id',
        to: 'user.parent_id',
      },
    },
    parent: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: selfclass,
      join: {
        from: 'user.parent_id',
        to: 'user.id',
      },
    },
  };
};

module.exports = relation;
