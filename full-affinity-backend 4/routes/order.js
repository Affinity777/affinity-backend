const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  try {
    const { name, email, address, items, total } = req.body;
    const newOrder = new Order({ name, email, address, items, total });
    await newOrder.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const itemList = items.map(i => `${i.name} x${i.quantity}`).join(', ');
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.TO_EMAIL,
      subject: 'Новый заказ с сайта Affinity',
      text: `Имя: ${name}\nEmail: ${email}\nАдрес: ${address}\nТовары: ${itemList}\nСумма: $${total}`
    });

    res.status(201).json({ message: 'Заказ принят' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
