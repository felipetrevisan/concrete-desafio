const request = require('supertest');
const faker = require('faker');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const User = require('../../src/models/User');

faker.locale = 'pt_BR';

describe('Authentication Controller', () => {
  it('should authenticate with valid credentials', async () => {
    const { email } = await User.create({
      name: 'Felipe Trevisan',
      email: 'felipejs@gmail.com',
      password: '123123',
      phones: [
        {
          number: faker.phone.phoneNumber('#########'),
          ddd: 11,
        },
      ],
    });

    const response = await request(app)
      .post('/signin')
      .send({
        email,
        password: '123123',
      });

    expect(response.status).toBe(200);
  });

  it('should not authenticate with invalid credentials', async () => {
    const response = await request(app)
      .post('/signin')
      .send({
        email: 'felipejs2@gmail.com',
        password: '123456',
      });

    expect(response.status).toBe(401);
  });

  it('should not be able sign in with a invalid password', async () => {
    const response = await request(app)
      .post('/signin')
      .send({
        email: 'felipejs@gmail.com',
        password: '123456',
      });

    expect(response.status).toBe(401);
  });

  it('should return jwt token when authenticated', async () => {
    const response = await request(app)
      .post('/signin')
      .send({
        email: 'felipejs@gmail.com',
        password: '123123',
      });

    expect(response.body).toHaveProperty('token');
  });

  it('should be able to access private routes when authenticated', async () => {
    const { id, token } = await User.create({
      name: 'Nadia Costa',
      email: 'nadia.tour@gmail.com',
      password: '123123',
      phones: [
        {
          number: faker.phone.phoneNumber('#########'),
          ddd: 65,
        },
      ],
    });

    const response = await request(app)
      .get(`/user/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('should not be able to access private routes without jwt token', async () => {
    const response = await request(app).get(
      '/user/5d4ba4a8f154f70e751d4cf2',
    );

    expect(response.status).toBe(401);
  });

  it('should not be able to access private routes with invalid jwt token', async () => {
    const response = await request(app)
      .get('/user/5d4ba4a8f154f70e751d4cf2')
      .set('Authorization', 'Bearer 123123');

    expect(response.status).toBe(401);
  });

  it('should not return password property when authenticated', async () => {
    const response = await request(app)
      .post('/signin')
      .send({
        email: 'felipejs@gmail.com',
        password: '123123',
      });

    expect(response.body).not.toHaveProperty('user.password');
  });

  it('should return expires property when authenticated sucessfully', async () => {
    const response = await request(app)
      .post('/signin')
      .send({
        email: 'felipejs@gmail.com',
        password: '123123',
      });

    expect(response.body).toHaveProperty('expiresIn');
  });

  it('should not be able to access private routes with a expired token', async () => {
    const user = await User.create({
      name: 'Amanda Baccaro',
      email: 'amanda_baccaro@hotmail.com',
      password: '123123',
      phones: [
        {
          number: faker.phone.phoneNumber('#########'),
          ddd: 11,
        },
      ],
    });

    // expired token
    const token = await jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: '-10s',
    });

    const response = await request(app)
      .get(`/user/${user.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
  });
});
