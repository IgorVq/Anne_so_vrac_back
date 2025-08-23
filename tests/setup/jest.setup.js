const { p } = require('../../config/bdd');

const TABLES = [
  'cart','reservation_products','reservation','format','product_image',
  'discounts','products','product_sizes','images','categories',
  'users','credentials','roles','promo_code','info_mag',
];

beforeAll(async () => {
  await p.query('SELECT 1');
});

beforeEach(async () => {
  // 🔧 Utilise p (Connection en mode promise), pas getConnection()
  await p.query('SET FOREIGN_KEY_CHECKS=0');
  for (const t of TABLES) {
    await p.query(`TRUNCATE TABLE \`${t}\``);
  }
  await p.query('SET FOREIGN_KEY_CHECKS=1');

  // Seeds minimaux
  const [rRes] = await p.query('INSERT INTO roles (admin) VALUES (0)');
  const roleId = rRes.insertId;

  const [cRes] = await p.query(
    'INSERT INTO credentials (password, phone, email) VALUES (?,?,?)',
    ['hashed_test_pwd', '0000000000', 'test@example.com']
  );
  const credId = cRes.insertId;

  const [uRes] = await p.query(
    'INSERT INTO users (first_name,last_name,id_role,id_credential) VALUES (?,?,?,?)',
    ['Test','User', roleId, credId]
  );
  const userId = uRes.insertId;

  const [catRes] = await p.query(
    'INSERT INTO categories (category_name, description, visible) VALUES (?,?,?)',
    ['Épicerie', null, 1]
  );
  const categoryId = catRes.insertId;

  const [sizeRes] = await p.query(
    'INSERT INTO product_sizes (size, type, active) VALUES (?,?,?)',
    [500, 'g', 1]
  );
  const sizeId = sizeRes.insertId;

  global.seed = { roleId, credId, userId, categoryId, sizeId };
});

afterAll(async () => {
  await p.end(); // ok avec mysql2 en mode promise
});
