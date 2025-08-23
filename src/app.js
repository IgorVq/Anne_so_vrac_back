const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const errorHandler = require('../middleware/errorHandler'); // chemin depuis src/


// importe toutes tes routes existantes
const userRoutes = require('../routes/usersRoutes');
const authRoutes = require('../routes/authRoutes');
const cartRoutes = require('../routes/cartRoutes');
const categoriesRoutes = require('../routes/categoriesRoutes');
const credentialsRoutes = require('../routes/credentialsRoutes');
const discountsRoutes = require('../routes/discountsRoutes');
const formatRoutes = require('../routes/formatRoutes');
const uploadRoutes = require('../routes/uploadRoutes');
const imagesRoutes = require('../routes/imagesRoutes');
const infoMagRoutes = require('../routes/infoMagRoutes');
const productImageRoutes = require('../routes/productImageRoutes');
const productSizesRoutes = require('../routes/productSizesRoutes');
const productsRoutes = require('../routes/productsRoutes');
const promoCodeRoutes = require('../routes/promoCodeRoutes');
const reservationProductsRoutes = require('../routes/reservationProductsRoutes');
const reservationRoutes = require('../routes/reservationRoutes');
const rolesRoutes = require('../routes/rolesRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/categories', categoriesRoutes);
app.use('/credentials', credentialsRoutes);
app.use('/discounts', discountsRoutes);
app.use('/format', formatRoutes);
app.use('/upload', uploadRoutes);
app.use('/images', imagesRoutes);
app.use('/infoMag', infoMagRoutes);
app.use('/productImage', productImageRoutes);
app.use('/productSizes', productSizesRoutes);
app.use('/products', productsRoutes);
app.use('/promoCode', promoCodeRoutes);
app.use('/reservationProducts', reservationProductsRoutes);
app.use('/reservation', reservationRoutes);
app.use('/roles', rolesRoutes);

app.use(errorHandler);

module.exports = app;
