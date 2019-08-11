const request = require('supertest');
const faker = require('faker');
const app = require('../../src/app');

faker.locale = 'pt_BR';

describe('Controller User', () => {
  it('should be able to register a new user', async () => {
    const user = {
      name: 'Juliana Hernandes',
      email: 'juliana.hernandes@gmail.com',
      password: '123123',
      phones: [
        {
          number: faker.phone.phoneNumber('#########'),
          ddd: 11,
        },
      ],
    };

    const response = await request(app)
      .post('/signup')
      .send(user);

    expect(response.status).toBe(201);
  });

  it('should not contain a user password in created data', async () => {
    const user = {
      name: 'Daniel Oliveira',
      email: 'daniel.oliveira@gmail.com',
      password: '123123',
      phones: [
        {
          number: faker.phone.phoneNumber('#########'),
          ddd: 11,
        },
      ],
    };

    const response = await request(app)
      .post('/signup')
      .send(user);

    expect(response.body).not.toHaveProperty('password');
  });

  it('should return the user token when successfully created', async () => {
    const user = {
      name: 'Luciano Amaral',
      email: 'luciano.amaral@gmail.com',
      password: '123123',
      phones: [
        {
          number: faker.phone.phoneNumber('#########'),
          ddd: 11,
        },
      ],
    };

    const response = await request(app)
      .post('/signup')
      .send(user);

    expect(response.body).toHaveProperty('token');
  });

  it('should not be able to register a new user when there another user with same e-mail', async () => {
    const user = {
      name: 'Diego Oliveira',
      email: 'luciano.amaral@gmail.com',
      password: '123123',
      phones: [
        {
          number: faker.phone.phoneNumber('#########'),
          ddd: 11,
        },
      ],
    };

    const response = await request(app)
      .post('/signup')
      .send(user);

    expect(response.status).toBe(400);
  });

  it('should not be able to register without email', async () => {
    const user = {
      name: 'Eduardo Sukeda',
      password: '123123',
      phones: [
        {
          number: faker.phone.phoneNumber('#########'),
          ddd: 11,
        },
      ],
    };

    const response = await request(app)
      .post('/signup')
      .send(user);

    expect(response.status).toBe(400);
  });

  it('should not be able to register without password', async () => {
    const user = {
      name: 'Eduardo Sukeda',
      email: 'sukeda.eduardo@live.com',
      phones: [
        {
          number: faker.phone.phoneNumber('#########'),
          ddd: 11,
        },
      ],
    };

    const response = await request(app)
      .post('/signup')
      .send(user);

    expect(response.status).toBe(400);
  });
});
