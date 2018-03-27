'use strict';

module.exports = function(Cat) {
  Cat.observe('before save', (context, next) => {
    if (context.instance) context.instance.updated = new Date();
    next();
  });
  Cat.afterRemote('findById', function(context, cat, next) {
    cat.description = cat.name + ' is ' +
      cat.age + ' years old and is a ' + cat.breed;
    next();
  });
  Cat.Adoptable = function(id, cb) {
    Cat.findById(id, function(err, cat) {
      if (err) return cb('Error', null);
      if (!cat) return cb('Cat not found', null);
      let canAdopt = (cat.breed != 'tiger' || (cat.age >= 10)) ? true : false;
      cb(null, canAdopt);
    });
  };
  Cat.remoteMethod('Adoptable', {
    accepts: {arg: 'id', type: 'any'},
    returns: {arg: 'Adoptable', type: 'boolean'},
  });
};
