// controllers/reservationControllers.js
const ReservationServices = require('../services/reservationServices');
const CartServices = require('../services/cartServices');
const ReservationProductServices = require('../services/reservationProductsServices');
const PromoCodeServices = require('../services/promoCodeServices');
const UserServices = require('../services/usersServices');
const transporter = require('../config/nodemailer');

async function getAllReservations(_req, res, next) {
  try {
    const reservations = await ReservationServices.getAllReservations();
    return res.status(200).json(reservations);
  } catch (error) {
    return next(error);
  }
}

async function sendAvailableOrderEmail(reservation, reservationProducts, user) {
  try {
    await transporter.sendMail({
      from: 'VERQUAIN Igor <igor.verquain@gmail.com>',
      to: user.email,
      subject: "Votre commande est disponible en boutique  – Anne So'Vrac",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #2C3E50;">Votre commande est disponible en boutique</h2>
          <p>Bonjour <strong>${user.first_name} ${user.last_name}</strong>,</p>
          <p>Nous avons le plaisir de vous informer que votre commande est désormais prête et vous attend en boutique Anne So'Vrac. Voici un rappel des détails :</p>
          <ul>
            <li>Numéro de commande : ${reservation.id_reservation}</li>
          </ul>
          <p>Vous pouvez venir la retirer dès maintenant aux horaires d'ouverture. Toutes les informations sont également disponibles dans votre espace client.</p>
          <button style="background-color: #3498db; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer;">
            <a href="https://anne-so-vrac.com/mon-compte/reservations" style="color: white; text-decoration: none;">Voir ma commande</a>
          </button>
          <p>Merci pour votre confiance et à très bientôt en boutique !</p>
        </div>
      `,
    });
  } catch (error) {
    // On log juste, on ne bloque pas la requête pour l'e-mail.
    console.error("Erreur lors de l'envoi de l'email de disponibilité:", error);
  }
}

async function updateReservationStatus(req, res, next) {
  try {
    const { status } = req.body;
    const id = req.params.id;

    const reservation = await ReservationServices.getReservationById(id);
    if (!reservation) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Réservation non trouvée' });
    }

    const reservationProducts = await ReservationProductServices.getAllReservationProductsByReservationId(id);
    const updatedReservation = await ReservationServices.updateReservation(id, { status });

    // Envoi e-mail informatif (exemple: statut devient "available")
    if (updatedReservation && req.user) {
      await sendAvailableOrderEmail(reservation, reservationProducts, req.user);
    }

    return res.status(200).json(updatedReservation);
  } catch (error) {
    return next(error);
  }
}

async function createReservation(req, res, next) {
  try {
    const reservation = await ReservationServices.createReservation(req.body);
    return res.status(201).json(reservation);
  } catch (error) {
    return next(error);
  }
}

async function applyPromoCode(req, res, next) {
  try {
    if (!req.body.promoCode) {
      return next({ status: 400, code: 'VALIDATION', message: 'Aucun code promo fourni' });
    }
    const promoCodeData = await PromoCodeServices.checkPromoCodeIsValid(req.body.promoCode, req.user.id);
    if (!promoCodeData) {
      // comportement existant : 200 avec message informatif
      return res.status(200).json({ message: 'Code promo invalide ou déjà utilisé' });
    }

    const updatedReservation = await ReservationServices.updateReservation(
      req.body.reservationId,
      { id_promo_code: promoCodeData.id_promo_code }
    );

    const updatedTotal = parseFloat(
      (updatedReservation.total_price * (1 - promoCodeData.discount_percent / 100)).toFixed(2)
    );

    const paymentIntent = await ReservationServices.createPaymentIntent(Math.round(updatedTotal * 100));

    return res.status(200).json({
      valid: true,
      message: 'Code promo valide',
      promoCode: promoCodeData,
      paymentIntent,
      updatedTotal,
    });
  } catch (error) {
    return next(error);
  }
}

async function sendConfirmationEmail(reservation, reservationData, user) {
  try {
    await transporter.sendMail({
      from: 'VERQUAIN Igor <igor.verquain@gmail.com>',
      to: user.email,
      subject: "Confirmation de commande  – Anne So'Vrac",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #2C3E50;">Confirmation de votre commande</h2>
          <p>Bonjour <strong>${user.first_name} ${user.last_name}</strong>,</p>
          <p>Merci d'avoir passé commande chez Anne So'Vrac. Voici les détails de votre commande :</p>
          <ul>
            <li>ID de commande : ${reservation.id_reservation}</li>
            <li>Prix : ${reservationData.amount}€</li>
            <li>Référence du paiement : ${reservationData.paymentIntentId}</li>
          </ul>
          <p>Vous pouvez consulter votre commande dans votre espace client.</p>
          <button style="background-color: #3498db; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer;">
            <a href="https://anne-so-vrac.com/mon-compte/reservations" style="color: white; text-decoration: none;">Voir ma commande</a>
          </button>
          <p>Nous vous remercions et espérons vous voir bientôt !</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de confirmation:", error);
  }
}

async function confirmPayment(req, res, next) {
  try {
    const { reservationId, reservationData } = req.body;

    const reservation = await ReservationServices.getReservationById(reservationId);
    if (!reservation) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Réservation non trouvée' });
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.retrieve(reservationData.paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return next({ status: 400, code: 'PAYMENT_NOT_CONFIRMED', message: "Le paiement n'a pas été confirmé" });
    }

    const user = await UserServices.getUserById(reservation.id_user);
    await sendConfirmationEmail(reservation, reservationData, user);

    const updatedReservation = await ReservationServices.updateReservation(reservationId, {
      status: 'confirmed',
      id_payment_intent: reservationData.paymentIntentId,
    });

    const reservationProducts = await ReservationProductServices.getAllReservationProductsByReservationId(reservationId);
    await CartServices.deleteCartByUserId(reservation.id_user);

    return res.status(200).json({
      message: 'Paiement confirmé et réservation mise à jour',
      reservation: updatedReservation,
      reservationProducts,
    });
  } catch (error) {
    return next(error);
  }
}

async function getMyReservationById(req, res, next) {
  try {
    const reservation = await ReservationServices.getMyReservationById(req.params.id, req.user.id);
    if (!reservation) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Réservation non trouvée' });
    }
    return res.status(200).json(reservation);
  } catch (error) {
    return next(error);
  }
}

async function getAllReservationsByState(req, res, next) {
  try {
    const state = req.params.state;
    const reservations = await ReservationServices.getAllReservationsByState(state);
    if (!reservations || reservations.length === 0) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Aucune réservation trouvée pour cet état' });
    }
    return res.status(200).json(reservations);
  } catch (error) {
    return next(error);
  }
}

async function getMyReservations(req, res, next) {
  try {
    const reservations = await ReservationServices.getMyReservations(req.user.id);
    if (!reservations || reservations.length === 0) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Aucune réservation trouvée' });
    }
    return res.status(200).json(reservations);
  } catch (error) {
    return next(error);
  }
}

async function getMyLastReservation(req, res, next) {
  try {
    const reservation = await ReservationServices.getMyLastReservation(req.user.id);
    if (!reservation) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Aucune réservation trouvée' });
    }
    return res.status(200).json(reservation);
  } catch (error) {
    return next(error);
  }
}

async function getReservationById(req, res, next) {
  try {
    const reservation = await ReservationServices.getReservationById(req.params.id);
    if (!reservation) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Réservation non trouvée' });
    }
    return res.status(200).json(reservation);
  } catch (error) {
    return next(error);
  }
}

async function updateReservation(req, res, next) {
  try {
    const reservation = await ReservationServices.updateReservation(req.params.id, req.body);
    if (!reservation) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Réservation non trouvée' });
    }
    return res.status(200).json(reservation);
  } catch (error) {
    return next(error);
  }
}

async function deleteReservation(req, res, next) {
  try {
    const result = await ReservationServices.deleteReservation(req.params.id);
    if (!result) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Réservation non trouvée' });
    }
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

async function removeMyPastReservations(req, res, next) {
  try {
    await ReservationServices.deletePendingReservationByUserId(req.user.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

async function createReservationIntent(req, res, next) {
  try {
    const Cart = await CartServices.getCartByUserId(req.user.id);

    if (!Cart || Cart.length === 0) {
      return next({ status: 400, code: 'EMPTY_CART', message: 'Votre panier est vide' });
    }

    const productDetailsPromises = Cart.map((element) =>
      CartServices.getCartInfoByCartId(element.id_cart)
    );
    const productDetails = await Promise.all(productDetailsPromises);

    let total = 0;
    productDetails.forEach((productDetail) => {
      const product = productDetail.data || productDetail;
      if (product.type === 'unit') {
        if (product.discount_percent != null && product.discount_percent > 0) {
          const productTotal = parseFloat((product.price * product.quantity * (1 - product.discount_percent / 100)).toFixed(2));
          total += productTotal;
        } else {
          const productTotal = parseFloat((product.price * product.quantity).toFixed(2));
          total += productTotal;
        }
      } else {
        if (product.discount_percent != null && product.discount_percent > 0) {
          const productTotal = parseFloat((product.price * (product.size / 1000) * product.quantity * (1 - product.discount_percent / 100)).toFixed(2));
          total += productTotal;
        } else {
          const productTotal = parseFloat((product.price * (product.size / 1000) * product.quantity).toFixed(2));
          total += productTotal;
        }
      }
    });

    const reservationData = await ReservationServices.createReservation({
      id_user: req.user.id,
      total_price: parseFloat(total.toFixed(2)),
      status: 'pending',
      validated: false,
    });

    for (const cartProduct of Cart) {
      await ReservationProductServices.createReservationProduct({
        id_reservation: reservationData.id_reservation,
        id_product: cartProduct.id_product,
        id_product_size: cartProduct.id_product_size,
        quantity: cartProduct.quantity,
      });
    }

    const paymentIntent = await ReservationServices.createPaymentIntent(Math.round(reservationData.total_price * 100));

    return res.status(201).json({ paymentIntent, reservation: reservationData });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getAllReservations,
  createReservation,
  getReservationById,
  updateReservation,
  deleteReservation,
  getMyReservationById,
  createReservationIntent,
  removeMyPastReservations,
  applyPromoCode,
  confirmPayment,
  getMyReservations,
  getMyLastReservation,
  getAllReservationsByState,
  updateReservationStatus,
};
