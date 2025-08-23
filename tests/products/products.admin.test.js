const request = require('supertest');
const { p } = require('../../config/bdd');
const app = require('../../src/app');

// Mock partiel : on garde login/register..., on bypass seulement l'admin
jest.mock('../../controllers/authControllers', () => {
  const actual = jest.requireActual('../../controllers/authControllers');
  return {
    ...actual,
    verifyToken: (_req, _res, next) => next(),
    requireAdmin: (_req, _res, next) => next(),
  };
});

// Optionnel: rendre la sortie propre (on ne mute QUE les erreurs)
let errSpy;
beforeAll(() => { errSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); });
afterAll(() => { errSpy.mockRestore(); });

const makeProduct = (o = {}) => ({
  product_name: 'Riz basmati',
  short_description: 'Riz',
  description: 'Riz parfumé',
  price: 3.20,
  local_product: 0,
  visible: 1,
  id_category: global.seed.categoryId, // FK valide
  formats: [{ size: 500, type: 'g', default_selected: 1 }],
  ...o,
});

describe('🧪 POST /products/admin', () => {
  test('✅ 201 | crée un produit + un format', async () => {
    const res = await request(app).post('/products/admin').send(makeProduct());
    expect(res.statusCode).toBe(201); // on attend précisément 201
    // structure minimale attendue
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('id_product');
    expect(res.body.data).toHaveProperty('formats');
    expect(Array.isArray(res.body.data.formats)).toBe(true);

    // Vérif DB
    const [[row]] = await p.query(
      'SELECT id_product FROM `products` WHERE product_name = ?',
      ['Riz basmati']
    );
    expect(row).toBeTruthy();
    const productId = row.id_product;

    const [fmt] = await p.query(
      'SELECT * FROM `format` WHERE id_product = ?',
      [productId]
    );
    expect(fmt.length).toBe(1);
  });

  test('🚫 409 | FK catégorie invalide → code FK_CONSTRAINT', async () => {
    const payload = makeProduct({ product_name: 'Farine', id_category: 999999 });
    const res = await request(app).post('/products/admin').send(payload);

    expect(res.statusCode).toBe(409);
    expect(res.body).toMatchObject({
      code: 'FK_CONSTRAINT',
      error: 'Clé étrangère invalide',
    });

    // Rien inséré
    const [rows] = await p.query(
      'SELECT * FROM `products` WHERE product_name = ?',
      ['Farine']
    );
    expect(rows.length).toBe(0);
  });
});
