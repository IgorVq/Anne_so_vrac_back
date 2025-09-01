const request = require('supertest');
const { p } = require('../../config/bdd');
const app = require('../../src/app');

jest.mock('../../controllers/authControllers', () => {
  const actual = jest.requireActual('../../controllers/authControllers');
  return { ...actual, verifyToken: (_r,_s,n)=>n(), requireAdmin: (_r,_s,n)=>n() };
});

let errSpy;
beforeAll(() => { errSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); });
afterAll(() => { errSpy.mockRestore(); });

async function createProduct(name='Produit avec discount') {
  const [ins] = await p.query(
    'INSERT INTO `products` (product_name, short_description, description, price, local_product, visible, id_category) VALUES (?,?,?,?,?,?,?)',
    [name, name, '', 9.99, 0, 1, global.seed.categoryId]
  );
  return ins.insertId;
}

describe('🏷️ /discounts CRUD', () => {
  test('POST → 201 | crée un discount pour un produit', async () => {
    const productId = await createProduct();
    const res = await request(app).post('/discounts').send({
      id_product: productId, discount_percent: 10
    });
    expect([200,201]).toContain(res.statusCode);

    const [[row]] = await p.query('SELECT * FROM `discounts` WHERE id_product=?', [productId]);
    expect(row).toBeTruthy();
    expect(row.discount_percent).toBe(10);
  });

  test('POST (même produit) → 409 | UNIQUE id_product', async () => {
    const productId = await createProduct('Produit unique');
    await p.query('INSERT INTO `discounts` (discount_percent, id_product) VALUES (10, ?)', [productId]);

    const res = await request(app).post('/discounts').send({
      id_product: productId, discount_percent: 15
    });
    expect(res.statusCode).toBe(409);
    expect(res.body.code).toBe('DUPLICATE');
  });

  test('POST (FK produit invalide) → 409', async () => {
    const res = await request(app).post('/discounts').send({
      id_product: 999999, discount_percent: 5
    });
    expect(res.statusCode).toBe(409);
    expect(res.body.code).toBe('FK_CONSTRAINT');
  });

  test('PATCH → 200/204 | met à jour le pourcentage', async () => {
    const productId = await createProduct('Produit patch');
    const [ins] = await p.query('INSERT INTO `discounts` (discount_percent, id_product) VALUES (10, ?)', [productId]);
    const id = ins.insertId;

    const res = await request(app).patch(`/discounts/${id}`).send({ discount_percent: 25 });
    expect([200,204]).toContain(res.statusCode);

    const [[row]] = await p.query('SELECT discount_percent FROM `discounts` WHERE id_discount=?', [id]);
    expect(row.discount_percent).toBe(25);
  });

  test('DELETE → 200/204 | supprime le discount', async () => {
    const productId = await createProduct('Produit delete disc');
    const [ins] = await p.query('INSERT INTO `discounts` (discount_percent, id_product) VALUES (20, ?)', [productId]);
    const id = ins.insertId;

    const res = await request(app).delete(`/discounts/${id}`);
    expect([200,204]).toContain(res.statusCode);

    const [[c]] = await p.query('SELECT COUNT(*) c FROM `discounts` WHERE id_discount=?', [id]);
    expect(c.c).toBe(0);
  });
});
