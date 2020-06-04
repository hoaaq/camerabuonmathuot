async function getMenu(user) {
  let Menu = (await user.$relatedQuery('role')).$relatedQuery('menu');
  return await Menu.orderBy('menu.order');
}

module.exports = {
  getMenu,
};
