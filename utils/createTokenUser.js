const createTokenUser = (user) => {
  return {name: user.name, email: user.email};
}

module.exports = createTokenUser;