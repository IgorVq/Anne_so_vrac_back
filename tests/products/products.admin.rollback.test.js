const request = require('supertest');
const { p } = require('../../config/bdd');
const app = require('../../src/app');

jest.mock('../../controllers/authControllers', () => {
  const actual = jest.requireActual('../../controllers/authControllers');
  return {
    ...actual,
    verifyToken: (_req, _res, next) => next(),
    requireAdmin: (_req, _res, next) => next(),
  };
});

let errSpy;
beforeAll(() => { errSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); });
afterAll(() => { errSpy.mockRestore(); });

const makeBadProduct = (o = {}) => ({
  product_name: 'Riz basmati',
  short_description: 'Riz',
  description: 'Riz parfumé',
  price: 3.20,
  local_product: 0,
  visible: 1,
  id_category: global.seed.categoryId,
  formats: [{ size: 500, type: null }],
  ...o,
});

describe('🧪 POST /products/admin – rollback', () => {
  test('🚫 400 | type NULL → code NOT_NULL | aucun produit en DB', async () => {
    const res = await request(app).post('/products/admin').send(makeBadProduct());

    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({
      code: 'NOT_NULL',
      error: 'Valeur requise manquante',
    });

    const [rows] = await p.query(
      'SELECT * FROM `products` WHERE product_name = ?',
      ['Riz basmati']
    );
    expect(rows.length).toBe(0);
  });
});
