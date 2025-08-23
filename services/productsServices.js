const { p } = require('../config/bdd');

async function getAllProducts() {
    const results = await p.query('SELECT * FROM products');
    return results[0];
}

async function getAvailableProductsId() {
    const results = await p.query(`SELECT p.id_product, p.id_category, p.price, p.product_name, d.discount_percent
        FROM products p
        LEFT JOIN discounts d ON d.id_product = p.id_product
        WHERE p.visible = 1`);
    return results[0];
}

async function getAvailableProductsByCategoryId(categoryId) {
    const results = await p.query(`SELECT p.id_product, p.id_category
        FROM products p
        INNER JOIN categories c ON c.id_category = p.id_category
        WHERE p.visible = 1 AND c.id_category = ?`, [categoryId]);
    return results[0];
}

async function getAvailablePromoProductsId() {
    const results = await p.query(`SELECT p.id_product
        FROM products p
        INNER JOIN discounts d ON d.id_product = p.id_product
        WHERE p.visible = 1 AND d.discount_percent > 0`);
    return results[0];
}

async function getAvailableLocalProductsId() {
    const results = await p.query(`SELECT p.id_product
        FROM products p
        WHERE p.visible = 1 AND p.local_product = 1`);
    return results[0];
}

async function getProductCardInfoById(id) {
    const results = await p.query(`
        SELECT DISTINCT p.id_product, p.product_name, p.local_product, p.short_description, p.price, ps.type, c.category_name, d.discount_percent, i.image_url
        FROM products p
        LEFT JOIN discounts d ON d.id_product = p.id_product
        INNER JOIN categories c ON c.id_category = p.id_category
        INNER JOIN format f ON f.id_product = p.id_product
        INNER JOIN product_sizes ps ON ps.id_product_size = f.id_product_size
        INNER JOIN product_image pi ON pi.id_product = p.id_product
        INNER JOIN images i ON i.id_image = pi.id_image
        WHERE p.id_product = ? AND pi.order_nb = 1
        LIMIT 1`, [id]);
    return results[0][0];
}

async function createProduct(product) {
    const results = await p.query('INSERT INTO products SET ?', [product]);
    return getProductById(results[0].insertId);
}

async function getProductById(id) {
    const results = await p.query('SELECT products.*, discounts.discount_percent FROM products left join discounts on discounts.id_product = products.id_product WHERE products.id_product = ?', [id]);
    return results[0][0];
}

async function updateProduct(id, product) {
    await p.query('UPDATE products SET ? WHERE id_product = ?', [product, id]);
    return getProductById(id);
}

async function deleteProduct(id) {
    const result = await p.query('DELETE FROM products WHERE id_product = ?', [id]);
    return result[0].affectedRows > 0;
}

// ===== NOUVELLES MÉTHODES ADMIN =====

async function getAllProductsForAdmin() {
    const query = `
        SELECT 
            p.*,
            c.id_category as category_id,
            c.category_name,
            c.description as category_description,
            c.visible as category_visible
        FROM products p
        LEFT JOIN categories c ON p.id_category = c.id_category
        ORDER BY p.id_product
    `;
    
    const [products] = await p.query(query);
    
    // Pour chaque produit, récupérer ses relations
    for (let product of products) {
        // Récupérer les formats actifs seulement
        const [formats] = await p.query(`
            SELECT 
                ps.id_product_size,
                ps.size,
                ps.type,
                f.default_selected
            FROM format f
            INNER JOIN product_sizes ps ON f.id_product_size = ps.id_product_size
            WHERE f.id_product = ? AND ps.active = 1
            ORDER BY f.default_selected DESC, ps.id_product_size
        `, [product.id_product]);
        
        // Récupérer les images
        const [images] = await p.query(`
            SELECT 
                i.id_image,
                i.image_url,
                pi.order_nb
            FROM product_image pi
            INNER JOIN images i ON pi.id_image = i.id_image
            WHERE pi.id_product = ?
            ORDER BY pi.order_nb
        `, [product.id_product]);
        
        // Récupérer les discounts
        const [discounts] = await p.query(`
            SELECT 
                id_discount,
                discount_percent
            FROM discounts
            WHERE id_product = ?
        `, [product.id_product]);
        
        // Structurer la catégorie
        product.category = product.category_id ? {
            id_category: product.category_id,
            category_name: product.category_name,
            description: product.category_description,
            visible: product.category_visible
        } : null;
        
        // Nettoyer les champs temporaires
        delete product.category_id;
        delete product.category_name;
        delete product.category_description;
        delete product.category_visible;
        
        // Ajouter les relations
        product.formats = formats;
        product.images = images;
        product.discounts = discounts;
    }
    
    return products;
}

async function getProductForAdmin(id) {
    const query = `
        SELECT 
            p.*,
            c.id_category as category_id,
            c.category_name,
            c.description as category_description,
            c.visible as category_visible
        FROM products p
        LEFT JOIN categories c ON p.id_category = c.id_category
        WHERE p.id_product = ?
    `;
    
    const [products] = await p.query(query, [id]);
    
    if (products.length === 0) {
        return null;
    }
    
    const product = products[0];
    
    // Récupérer les formats actifs seulement
    const [formats] = await p.query(`
        SELECT 
            ps.id_product_size,
            ps.size,
            ps.type,
            f.default_selected
        FROM format f
        INNER JOIN product_sizes ps ON f.id_product_size = ps.id_product_size
        WHERE f.id_product = ? AND ps.active = 1
        ORDER BY f.default_selected DESC, ps.id_product_size
    `, [id]);
    
    // Récupérer les images
    const [images] = await p.query(`
        SELECT 
            i.id_image,
            i.image_url,
            pi.order_nb
        FROM product_image pi
        INNER JOIN images i ON pi.id_image = i.id_image
        WHERE pi.id_product = ?
        ORDER BY pi.order_nb
    `, [id]);
    
    // Récupérer les discounts
    const [discounts] = await p.query(`
        SELECT 
            id_discount,
            discount_percent
        FROM discounts
        WHERE id_product = ?
    `, [id]);
    
    // Structurer la catégorie
    product.category = product.category_id ? {
        id_category: product.category_id,
        category_name: product.category_name,
        description: product.category_description,
        visible: product.category_visible
    } : null;
    
    // Nettoyer les champs temporaires
    delete product.category_id;
    delete product.category_name;
    delete product.category_description;
    delete product.category_visible;
    
    // Ajouter les relations
    product.formats = formats;
    product.images = images;
    product.discounts = discounts;
    
    return product;
}

async function createProductAdmin(productData) {
    const connection = p;
    
    try {
        await connection.beginTransaction();
        
        // 1. Créer le produit principal
        const productFields = {
            product_name: productData.product_name,
            short_description: productData.short_description || '',
            description: productData.description || '',
            price: productData.price,
            local_product: productData.local_product || 0,
            visible: productData.visible !== undefined ? productData.visible : 1,
            allergen: productData.allergen || null,
            composition: productData.composition || null,
            additive: productData.additive || null,
            id_category: productData.id_category,
            origin: productData.origin || null,
            cooking_tips: productData.cooking_tips || null,
            supplier: productData.supplier || null
        };
        
        const [productResult] = await connection.query('INSERT INTO products SET ?', [productFields]);
        const productId = productResult.insertId;
        
        // 2. Créer les formats si fournis
        if (productData.formats && productData.formats.length > 0) {
            for (let i = 0; i < productData.formats.length; i++) {
                const format = productData.formats[i];
                
                // Créer l'entrée dans product_sizes
                const [sizeResult] = await connection.query(
                    'INSERT INTO product_sizes (size, type) VALUES (?, ?)',
                    [format.size, format.type]
                );
                
                // Créer l'entrée dans format
                await connection.query(
                    'INSERT INTO format (id_product, id_product_size, default_selected) VALUES (?, ?, ?)',
                    [productId, sizeResult.insertId, format.default_selected || (i === 0 ? 1 : 0)]
                );
            }
        }
        
        // 3. Créer les images si fournies
        if (productData.images && productData.images.length > 0) {
            for (const imageData of productData.images) {
                // Créer l'entrée dans images
                const [imageResult] = await connection.query(
                    'INSERT INTO images (image_url) VALUES (?)',
                    [imageData.image_url]
                );
                
                // Créer l'entrée dans product_image
                await connection.query(
                    'INSERT INTO product_image (id_product, id_image, order_nb) VALUES (?, ?, ?)',
                    [productId, imageResult.insertId, imageData.order_nb]
                );
            }
        }
        
        // 4. Créer les discounts si fournis
        if (productData.discounts && productData.discounts.length > 0) {
            for (const discount of productData.discounts) {
                await connection.query(
                    'INSERT INTO discounts (id_product, discount_percent) VALUES (?, ?)',
                    [productId, discount.discount_percent]
                );
            }
        }
        
        await connection.commit();
        
        // Retourner le produit complet créé
        return await getProductForAdmin(productId);
        
    } catch (error) {
        await connection.rollback();
        throw error;
    }
}

async function updateProductAdmin(id, productData) {
  const connection = p;

  try {
    await connection.beginTransaction();

    // 1) Mettre à jour uniquement les champs présents dans productData
    const allowed = [
      'product_name', 'short_description', 'description', 'price', 'local_product',
      'visible', 'allergen', 'composition', 'additive', 'id_category', 'origin',
      'cooking_tips', 'supplier'
    ];
    const productFields = {};
    for (const k of allowed) {
      if (Object.prototype.hasOwnProperty.call(productData, k)) {
        productFields[k] = productData[k]; // conserve null si explicitement envoyé
      }
    }
    if (Object.keys(productFields).length > 0) {
      await connection.query('UPDATE `products` SET ? WHERE id_product = ?', [productFields, id]);
    }

    // 2) Gestion "intelligente" des formats (ne toucher que si formats est fourni)
    if (productData.formats !== undefined) {
      // Récupérer les formats existants
      const [existingFormats] = await connection.query(`
        SELECT 
          f.id_product,
          f.id_product_size,
          f.default_selected,
          ps.size,
          ps.type
        FROM \`format\` f
        INNER JOIN \`product_sizes\` ps ON f.id_product_size = ps.id_product_size
        WHERE f.id_product = ?
        ORDER BY f.default_selected DESC, ps.id_product_size
      `, [id]);

      const newFormats = productData.formats || [];

      // Comparaison simple
      const formatsChanged =
        existingFormats.length !== newFormats.length ||
        existingFormats.some((existing, index) => {
          const nf = newFormats[index];
          return !nf || existing.size != nf.size || existing.type !== nf.type;
        });

      if (formatsChanged) {
        // "Soft delete" des anciennes tailles
        const oldProductSizeIds = existingFormats.map(f => f.id_product_size);
        for (const sizeId of oldProductSizeIds) {
          await connection.query('UPDATE `product_sizes` SET `active` = 0 WHERE `id_product_size` = ?', [sizeId]);
        }

        // Créer/réactiver les nouvelles tailles + lier via format
        for (let i = 0; i < newFormats.length; i++) {
          const f = newFormats[i];

          // Existe déjà ?
          const [existingSize] = await connection.query(
            'SELECT `id_product_size` FROM `product_sizes` WHERE `size` = ? AND `type` = ?',
            [f.size, f.type]
          );

          let sizeId;
          if (existingSize.length > 0) {
            sizeId = existingSize[0].id_product_size;
            await connection.query('UPDATE `product_sizes` SET `active` = 1 WHERE `id_product_size` = ?', [sizeId]);
          } else {
            const [sizeResult] = await connection.query(
              'INSERT INTO `product_sizes` (`size`, `type`, `active`) VALUES (?, ?, 1)',
              [f.size, f.type]
            );
            sizeId = sizeResult.insertId;
          }

          // Lien format : update si existe, sinon insert
          const [existingFormat] = await connection.query(
            'SELECT `id_product`, `id_product_size` FROM `format` WHERE `id_product` = ? AND `id_product_size` = ?',
            [id, sizeId]
          );

          const defaultSelected = f.default_selected ?? (i === 0 ? 1 : 0);

          if (existingFormat.length > 0) {
            await connection.query(
              'UPDATE `format` SET `default_selected` = ? WHERE `id_product` = ? AND `id_product_size` = ?',
              [defaultSelected, id, sizeId]
            );
          } else {
            await connection.query(
              'INSERT INTO `format` (`id_product`, `id_product_size`, `default_selected`) VALUES (?, ?, ?)',
              [id, sizeId, defaultSelected]
            );
          }
        }
      } else {
        // Rien à faire
      }
    }

    // 3) Images (ne toucher que si images est fourni)
    if (productData.images !== undefined) {
      const [existingImages] = await connection.query(`
        SELECT 
          pi.id_image,
          pi.order_nb,
          i.image_url
        FROM \`product_image\` pi
        INNER JOIN \`images\` i ON pi.id_image = i.id_image
        WHERE pi.id_product = ?
        ORDER BY pi.order_nb
      `, [id]);

      const newImages = productData.images || [];

      const imagesChanged =
        existingImages.length !== newImages.length ||
        existingImages.some((existing, index) => {
          const ni = newImages[index];
          return !ni || existing.order_nb !== ni.order_nb || existing.image_url !== ni.image_url;
        });

      if (imagesChanged) {
        // Supprimer anciennes relations
        await connection.query('DELETE FROM `product_image` WHERE `id_product` = ?', [id]);
        // Supprimer anciennes images
        const oldImageIds = existingImages.map(img => img.id_image);
        for (const imageId of oldImageIds) {
          await connection.query('DELETE FROM `images` WHERE `id_image` = ?', [imageId]);
        }
        // Créer les nouvelles
        for (const img of newImages) {
          const [imgRes] = await connection.query(
            'INSERT INTO `images` (`image_url`) VALUES (?)',
            [img.image_url]
          );
          await connection.query(
            'INSERT INTO `product_image` (`id_product`, `id_image`, `order_nb`) VALUES (?, ?, ?)',
            [id, imgRes.insertId, img.order_nb ?? 0]
          );
        }
      } else {
        // Rien à faire
      }
    }

    // 4) Discounts (ne toucher que si discounts est fourni)
    if (productData.discounts !== undefined) {
      await connection.query('DELETE FROM `discounts` WHERE `id_product` = ?', [id]);
      for (const d of (productData.discounts || [])) {
        await connection.query(
          'INSERT INTO `discounts` (`id_product`, `discount_percent`) VALUES (?, ?)',
          [id, d.discount_percent]
        );
      }
    }

    await connection.commit();
    return await getProductForAdmin(id);
  } catch (error) {
    await connection.rollback();
    throw error;
  }
}


async function deleteProductAdmin(id) {
    const connection = p;
    
    try {
        await connection.beginTransaction();
        
        // 1. Récupérer les IDs des ressources liées pour les supprimer
        const [formats] = await connection.query('SELECT id_product_size FROM format WHERE id_product = ?', [id]);
        const [images] = await connection.query('SELECT id_image FROM product_image WHERE id_product = ?', [id]);
        
        // 2. Supprimer les discounts
        await connection.query('DELETE FROM discounts WHERE id_product = ?', [id]);
        
        // 3. Supprimer les relations et images
        await connection.query('DELETE FROM product_image WHERE id_product = ?', [id]);
        for (const image of images) {
            await connection.query('DELETE FROM images WHERE id_image = ?', [image.id_image]);
        }
        
        // 4. Supprimer les formats
        await connection.query('DELETE FROM format WHERE id_product = ?', [id]);
        for (const format of formats) {
            await connection.query('DELETE FROM product_sizes WHERE id_product_size = ?', [format.id_product_size]);
        }
        
        // 5. Supprimer le produit
        const [result] = await connection.query('DELETE FROM products WHERE id_product = ?', [id]);
        
        await connection.commit();
        
        return result.affectedRows > 0;
        
    } catch (error) {
        await connection.rollback();
        throw error;
    }
}

module.exports = {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    getAvailableProductsId,
    getProductCardInfoById,
    getAvailablePromoProductsId,
    getAvailableLocalProductsId,
    getAvailableProductsByCategoryId,
    // Nouvelles méthodes admin
    getAllProductsForAdmin,
    getProductForAdmin,
    createProductAdmin,
    updateProductAdmin,
    deleteProductAdmin
};