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

describe('🗂️ /categories CRUD', () => {
  test('POST → 201 | crée une catégorie', async () => {
    const res = await request(app).post('/categories').send({
      category_name: 'Légumineuses', description: null, visible: 1
    });
    expect([200,201]).toContain(res.statusCode);

    const [[row]] = await p.query('SELECT * FROM `categories` WHERE category_name=?', ['Légumineuses']);
    expect(row).toBeTruthy();
  });

  test('POST (doublon) → 409 | code DUPLICATE', async () => {
    await p.query('INSERT INTO `categories` (category_name, visible) VALUES (?,1)', ['Épices']);
    const res = await request(app).post('/categories').send({ category_name: 'Épices', visible: 1 });
    expect(res.statusCode).toBe(409);
    expect(res.body.code).toBe('DUPLICATE');
  });

  test('GET → 200 | liste', async () => {
    const res = await request(app).get('/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PATCH → 200/204 | met à jour visible', async () => {
    const [ins] = await p.query('INSERT INTO `categories` (category_name, visible) VALUES (?,1)', ['Huiles']);
    const id = ins.insertId;
    const res = await request(app).patch(`/categories/${id}`).send({ visible: 0 });
    expect([200,204]).toContain(res.statusCode);

    const [[row]] = await p.query('SELECT visible FROM `categories` WHERE id_category=?', [id]);
    expect(row.visible).toBe(0);
  });

  test('DELETE (référencée par product) → 409 | code FK_CONSTRAINT', async () => {
    const [cat] = await p.query('INSERT INTO `categories` (category_name, visible) VALUES (?,1)', ['Céréales']);
    const catId = cat.insertId;
    await p.query(
      'INSERT INTO `products` (product_name, short_description, description, price, local_product, visible, id_category) VALUES (?,?,?,?,?,?,?)',
      ['Riz', 'Riz', '', 1.2, 0, 1, catId]
    );

    const res = await request(app).delete(`/categories/${catId}`);
    expect(res.statusCode).toBe(409);
    expect(res.body.code).toBe('FK_CONSTRAINT');
  });

  test('DELETE (orpheline) → 200/204', async () => {
    const [cat] = await p.query('INSERT INTO `categories` (category_name, visible) VALUES (?,1)', ['Orpheline']);
    const id = cat.insertId;
    const res = await request(app).delete(`/categories/${id}`);
    expect([200,204]).toContain(res.statusCode);

    const [[c]] = await p.query('SELECT COUNT(*) c FROM `categories` WHERE id_category=?', [id]);
    expect(c.c).toBe(0);
  });
});
