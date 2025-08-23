const request = require('supertest');
const { p } = require('../../config/bdd');
const app = require('../../src/app');

jest.mock('../../controllers/authControllers', () => {
  const actual = jest.requireActual('../../controllers/authControllers');
  return { ...actual, verifyToken: (_r,_s,n)=>n(), requireAdmin: (_r,_s,n)=>n() };
});

const createFullProduct = async () => {
  const payload = {
    product_name: 'Huile',
    short_description: 'Huile',
    description: '',
    price: 5,
    local_product: 0,
    visible: 1,
    id_category: global.seed.categoryId,
    formats: [{ size: 1, type: 'L', default_selected: 1 }],
    images: [{ image_url: 'https://x/y.jpg', order_nb: 1 }],
    discounts: [{ discount_percent: 10 }],
  };
  const res = await request(app).post('/products/admin').send(payload);
  return res.body.data?.id_product || res.body.id_product;
};

describe('🧪 DELETE /products/admin/:id', () => {
  test('✅ 200/204 | supprime produit + relations', async () => {
    const id = await createFullProduct();

    const res = await request(app).delete(`/products/admin/${id}`);
    expect([200,204]).toContain(res.statusCode);

    const [[pCount]]  = await p.query('SELECT COUNT(*) c FROM `products` WHERE id_product=?', [id]);
    const [[fCount]]  = await p.query('SELECT COUNT(*) c FROM `format` WHERE id_product=?', [id]);
    const [[piCount]] = await p.query('SELECT COUNT(*) c FROM `product_image` WHERE id_product=?', [id]);
    const [[dCount]]  = await p.query('SELECT COUNT(*) c FROM `discounts` WHERE id_product=?', [id]);
    expect(pCount.c).toBe(0);
    expect(fCount.c).toBe(0);
    expect(piCount.c).toBe(0);
    expect(dCount.c).toBe(0);
  });
});
