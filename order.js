const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const itemList = req.body.items.map(i => i.name + ' x' + i.quantity).join(', ');
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.TO_EMAIL,
      subject: 'Новый заказ на Affinity',
      text: `Имя: ${req.body.name}\nEmail: ${req.body.email}\nАдрес: ${req.body.address}\nТовары: ${itemList}\nСумма: $${req.body.total}`
    });

    res.status(201).json({ message: 'Заказ принят' });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
