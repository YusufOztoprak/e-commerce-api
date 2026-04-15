const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../config/database');

let adminToken;
let customerToken;
let categoryId;
let productId;

beforeAll(async () => {
    await sequelize.sync({ force: true });

    const adminRes = await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'Admin', email: 'admin@test.com', password: '123456' });
    adminToken = adminRes.body.data.accessToken;

    await sequelize.query(`UPDATE "Users" SET role = 'admin' WHERE email = 'admin@test.com'`);

    const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'admin@test.com', password: '123456' });
    adminToken = loginRes.body.data.accessToken;

    const customerRes = await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'Customer', email: 'customer@test.com', password: '123456' });
    customerToken = customerRes.body.data.accessToken;

    const catRes = await request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Electronics', description: 'Electronic products' });
    categoryId = catRes.body.data.id;
});

afterAll(async () => {
    await sequelize.close();
});

describe('POST /api/v1/products', () => {
    it('should create a product as admin', async () => {
        const res = await request(app)
            .post('/api/v1/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'iPhone 15',
                description: 'Apple iPhone 15',
                price: 999.99,
                stock: 50,
                category_id: categoryId,
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        productId = res.body.data.id;
    });

    it('should return 403 if customer tries to create product', async () => {
        const res = await request(app)
            .post('/api/v1/products')
            .set('Authorization', `Bearer ${customerToken}`)
            .send({
                name: 'iPhone 15',
                price: 999.99,
                category_id: categoryId,
            });

        expect(res.status).toBe(403);
    });

    it('should return 401 if no token', async () => {
        const res = await request(app)
            .post('/api/v1/products')
            .send({ name: 'iPhone 15', price: 999.99, category_id: categoryId });

        expect(res.status).toBe(401);
    });
});

describe('GET /api/v1/products', () => {
    it('should list all products', async () => {
        const res = await request(app).get('/api/v1/products');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.pagination).toBeDefined();
    });

    it('should get product by id', async () => {
        const res = await request(app).get(`/api/v1/products/${productId}`);

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe('iPhone 15');
    });

    it('should return 404 for invalid product id', async () => {
        const res = await request(app)
            .get('/api/v1/products/00000000-0000-0000-0000-000000000000');

        expect(res.status).toBe(404);
    });
});
