const request = require('supertest');
const { p } = require('../../config/bdd');
const app = require('../../src/app');

jest.mock('../../controllers/authControllers', () => {
  const actual = jest.requireActual('../../controllers/authControllers');
  return { ...actual, verifyToken: (_r,_s,n)=>n(), requireAdmin: (_r,_s,n)=>n() };
});

const createProduct = async () => {
  const payload = {
    product_name: 'Lentilles',
    short_description: 'Lentilles',
    description: '',
    price: 2.1,
    local_product: 0,
    visible: 1,
    id_category: global.seed.categoryId,
    formats: [{ size: 500, type: 'g', default_selected: 1 }],
  };
  const res = await request(app).post('/products/admin').send(payload);
  return res.body.data?.id_product || res.body.id_product;
};

describe('🧪 PATCH /products/admin/:id', () => {
  test('✅ 200/204 | met à jour le prix', async () => {
    const id = await createProduct();
    const res = await request(app).patch(`/products/admin/${id}`).send({ price: 2.5 });
    expect([200,204]).toContain(res.statusCode);

    const [[row]] = await p.query('SELECT price FROM `products` WHERE id_product=?', [id]);
    expect(parseFloat(row.price)).toBe(2.5);
  });

  test('🚫 409 | FK catégorie invalide', async () => {
    const id = await createProduct();
    const res = await request(app).patch(`/products/admin/${id}`).send({ id_category: 999999 });
    expect(res.statusCode).toBe(409);
    expect(res.body.code).toBe('FK_CONSTRAINT');
  });
});
