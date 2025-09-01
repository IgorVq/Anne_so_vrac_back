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

describe('🔐 /credentials CRUD', () => {
  test('POST → 201 | crée des credentials', async () => {
    const res = await request(app).post('/credentials').send({
      email: 'john.doe@test.dev',
      phone: '0600000001',
      password: 'Secret!123'
    });
    expect([200,201]).toContain(res.statusCode);

    const [[row]] = await p.query('SELECT * FROM `credentials` WHERE email=?', ['john.doe@test.dev']);
    expect(row).toBeTruthy();
  });

  test('POST (email doublon) → 409 | DUPLICATE', async () => {
    await p.query('INSERT INTO `credentials` (email, phone, password) VALUES (?,?,?)',
      ['dup@test.dev', '0600000002', 'x']);
    const res = await request(app).post('/credentials').send({
      email: 'dup@test.dev', phone: '0600000003', password: 'x'
    });
    expect(res.statusCode).toBe(409);
    expect(res.body.code).toBe('DUPLICATE');
  });

  test('PATCH → 200/204 | met à jour le phone', async () => {
    const [ins] = await p.query('INSERT INTO `credentials` (email, phone, password) VALUES (?,?,?)',
      ['patch@test.dev', '0600000099', 'x']);
    const id = ins.insertId;

    const res = await request(app).patch(`/credentials/${id}`).send({ phone: '0600000010' });
    expect([200,204]).toContain(res.statusCode);

    const [[row]] = await p.query('SELECT phone FROM `credentials` WHERE id_credential=?', [id]);
    expect(row.phone).toBe('0600000010');
  });

  test('DELETE (référencé par user) → 409 | FK_CONSTRAINT', async () => {
    const [c] = await p.query('INSERT INTO `credentials` (email, phone, password) VALUES (?,?,?)',
      ['link@test.dev', '0600000011', 'x']);
    const credId = c.insertId;
    const [r] = await p.query('INSERT INTO `roles` (admin) VALUES (0)');
    const roleId = r.insertId;
    await p.query('INSERT INTO `users` (first_name,last_name,id_role,id_credential) VALUES (?,?,?,?)',
      ['A','B', roleId, credId]);

    const res = await request(app).delete(`/credentials/${credId}`);
    expect(res.statusCode).toBe(409);
    expect(res.body.code).toBe('FK_CONSTRAINT');
  });
});
