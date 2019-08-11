const { compareSync } = require('bcryptjs');
const User = require('../../src/models/User');

describe('User', () => {
  it('should encrypt user password', async () => {
    const { password } = await User.create({
      name: 'Raphael',
      email: 'fadubas@gmail.com',
      password: '123123',
    });

    const compareHash = await compareSync('123123', password);

    expect(compareHash).toBe(true);
  });
});
