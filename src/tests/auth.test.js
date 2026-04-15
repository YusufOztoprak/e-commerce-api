const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../config/database');
const { User } = require('../models');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'Test User',
                email: 'test@test.com',
                password: '123456',
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.user.email).toBe('test@test.com');
        expect(res.body.data.accessToken).toBeDefined();
    });

    it('should return 409 if email already exists', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'Test User',
                email: 'test@test.com',
                password: '123456',
            });

        expect(res.status).toBe(409);
        expect(res.body.success).toBe(false);
    });

    it('should return 400 if email is invalid', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'Test User',
                email: 'invalid-email',
                password: '123456',
            });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });
});

describe('POST /api/v1/auth/login', () => {
    it('should login successfully', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'test@test.com',
                password: '123456',
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.accessToken).toBeDefined();
    });

    it('should return 401 with wrong password', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'test@test.com',
                password: 'wrongpassword',
            });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it('should return 401 with wrong email', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'wrong@test.com',
                password: '123456',
            });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });
});