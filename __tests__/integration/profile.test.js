const request = require('supertest');
const faker = require('faker');
const app = require('../../src/app');
const User = require('../../src/models/User');

faker.locale = 'pt_BR';

describe('Profile Controller', () => {
  it('should return user data when profile route accessed', async () => {
    const { id, token } = await User.create({
      name: 'Filipe Deschamps',
      email: 'filipe.deschamps@gmail.com',
      password: '123123',
      phones: [
        {
          number: faker.phone.phoneNumber('#########'),
          ddd: 11,
        },
      ],
    });

    const response = await request(app)
      .get(`/user/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('should return error when passed a id with invalid format', async () => {
    const { token } = await User.create({
      name: 'Selena Gomez',
      email: 'selena@selenagomez.com',
      password: '123123',
      phones: [
        {
          number: faker.phone.phoneNumber('#########'),
          ddd: 11,
        },
      ],
    });

    const response = await request(app)
      .get('/user/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(500);
  });

  it('should return error 404 when passed invalid user', async () => {
    const { token } = await User.create({
      name: 'Nienke Helthuis',
      email: 'nienke.helthuis@gmail.com',
      password: '123123',
      phones: [
        {
          number: faker.phone.phoneNumber('#########'),
          ddd: 11,
        },
      ],
    });

    const response = await request(app)
      .get('/user/5d4ba4a8f154f70e751d4cf2')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it('should not return password property with user data', async () => {
    const { id, token } = await User.create({
      name: 'Bruna Tourais',
      email: 'bruna.tourais@gmail.com',
      password: '123123',
      phones: [
        {
          number: faker.phone.phoneNumber('#########'),
          ddd: 11,
        },
      ],
    });

    const response = await request(app)
      .get(`/user/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).not.toHaveProperty('password');
  });
});
