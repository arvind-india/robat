const actions = require('../actions');
const {firstEntityValue, translateType} = require('../utils');
const OBAClient = require('../oba');

actions.register('materialAmount', materialAmount);

function materialAmount({context, entities}) {
  const type = firstEntityValue(entities, 'type');

  if (type) {
    context.type = type;
    delete context.missingType;

    return OBAClient.get('search', {
      q: 'id:*',
      facet: `Type(${translateType(type)})`,
      ps: 1,
    })
      .then(res => JSON.parse(res))
      .then(res => {
        const count = res.aquabrowser.meta.count;

        context.count = count;
        return context;

      })
      .catch(err => console.log(err)); // eslint-disable-line no-console

  } else if (!type) {
    context.missingType = true;
    delete context.type;
    return context;
  }
}
