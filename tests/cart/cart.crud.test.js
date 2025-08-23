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

// Helper: crée un produit + 1 size + lien format
async function createProductWithFormat() {
  const [prod] = await p.query(
    'INSERT INTO `products` (product_name, short_description, description, price, local_product, visible, id_category) VALUES (?,?,?,?,?,?,?)',
    ['Pois chiches', 'Pois chiches', '', 2.1, 0, 1, global.seed.categoryId]
  );
  const productId = prod.insertId;

  const [size] = await p.query('INSERT INTO `product_sizes` (size, type, active) VALUES (?,?,1)', [250, 'g']);
  const sizeId = size.insertId;

  await p.query('INSERT INTO `format` (id_product, id_product_size, default_selected) VALUES (?,?,1)', [productId, sizeId]);

  return { productId, sizeId };
}

describe('🛒 /cart CRUD', () => {
  test('POST → 201 | ajoute un item au panier', async () => {
    const { productId, sizeId } = await createProductWithFormat();
    const res = await request(app).post('/cart').send({
      id_user: global.seed.userId,
      id_product: productId,
      id_product_size: sizeId,
      quantity: 2,
    });
    expect([200,201]).toContain(res.statusCode);

    const [[row]] = await p.query(
      'SELECT * FROM `cart` WHERE id_user=? AND id_product=? AND id_product_size=?',
      [global.seed.userId, productId, sizeId]
    );
    expect(row).toBeTruthy();
    expect(row.quantity).toBe(2);
  });

  test('POST (FK user invalide) → 409', async () => {
    const { productId, sizeId } = await createProductWithFormat();
    const res = await request(app).post('/cart').send({
      id_user: 999999, id_product: productId, id_product_size: sizeId, quantity: 1
    });
    expect(res.statusCode).toBe(409);
    expect(res.body.code).toBe('FK_CONSTRAINT');
  });

  test('PATCH → 200/204 | met à jour la quantité', async () => {
    const { productId, sizeId } = await createProductWithFormat();
    const [ins] = await p.query(
      'INSERT INTO `cart` (quantity, id_product_size, id_product, id_user) VALUES (?,?,?,?)',
      [1, sizeId, productId, global.seed.userId]
    );
    const id_cart = ins.insertId;

    const res = await request(app).patch(`/cart/${id_cart}`).send({ quantity: 5 });
    expect([200,204]).toContain(res.statusCode);

    const [[row]] = await p.query('SELECT quantity FROM `cart` WHERE id_cart=?', [id_cart]);
    expect(row.quantity).toBe(5);
  });

  test('DELETE → 200/204 | supprime l’item', async () => {
    const { productId, sizeId } = await createProductWithFormat();
    const [ins] = await p.query(
      'INSERT INTO `cart` (quantity, id_product_size, id_product, id_user) VALUES (?,?,?,?)',
      [1, sizeId, productId, global.seed.userId]
    );
    const id_cart = ins.insertId;

    const res = await request(app).delete(`/cart/${id_cart}`);
    expect([200,204]).toContain(res.statusCode);

    const [[c]] = await p.query('SELECT COUNT(*) c FROM `cart` WHERE id_cart=?', [id_cart]);
    expect(c.c).toBe(0);
  });
});
