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

describe('🏷️ /promoCode CRUD', () => {
  test('POST → 201 | crée un code promo', async () => {
    const res = await request(app).post('/promoCode').send({
      code: 'WELCOME10',
      discount_percent: 10,
      valid_from: '2025-01-01',
      valid_to: '2026-01-01',
      is_active: 1
    });
    expect([200,201]).toContain(res.statusCode);

    const [[row]] = await p.query('SELECT * FROM `promo_code` WHERE code=?', ['WELCOME10']);
    expect(row).toBeTruthy();
    expect(row.discount_percent).toBe(10);
  });

  test('POST (code en doublon) → 409', async () => {
    await p.query('INSERT INTO `promo_code` (code, discount_percent, valid_from, valid_to, is_active) VALUES (?,?,?,?,1)',
      ['UNIQUE20', 20, '2025-01-01', '2026-01-01']);
    const res = await request(app).post('/promoCode').send({
      code: 'UNIQUE20', discount_percent: 15, valid_from: '2025-01-01', valid_to: '2026-01-01', is_active: 1
    });
    expect(res.statusCode).toBe(409);
    expect(res.body.code).toBe('DUPLICATE');
  });

  test('GET → 200 | liste', async () => {
    const res = await request(app).get('/promoCode');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PATCH → 200/204 | active/désactive', async () => {
    const [ins] = await p.query(
      'INSERT INTO `promo_code` (code, discount_percent, valid_from, valid_to, is_active) VALUES (?,?,?,?,1)',
      ['TOGGLE', 5, '2025-01-01', '2026-01-01']
    );
    const id = ins.insertId;

    const res = await request(app).patch(`/promoCode/${id}`).send({ is_active: 0 });
    expect([200,204]).toContain(res.statusCode);

    const [[row]] = await p.query('SELECT is_active FROM `promo_code` WHERE id_promo_code=?', [id]);
    expect(row.is_active).toBe(0);
  });

  test('DELETE → 200/204 | supprime', async () => {
    const [ins] = await p.query(
      'INSERT INTO `promo_code` (code, discount_percent, valid_from, valid_to, is_active) VALUES (?,?,?,?,1)',
      ['DELME', 5, '2025-01-01', '2026-01-01']
    );
    const id = ins.insertId;

    const res = await request(app).delete(`/promoCode/${id}`);
    expect([200,204]).toContain(res.statusCode);

    const [[c]] = await p.query('SELECT COUNT(*) c FROM `promo_code` WHERE id_promo_code=?', [id]);
    expect(c.c).toBe(0);
  });
});
