const express = require("express");
const bodyParser = require("body-parser");
const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const router = express.Router();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/validate', (req, res, next) => {
  if (!req.body.numbers || req.body.numbers.length < 1) {
    return next();
  }
  const {
    numbers
  } = req.body;

  const parsedNumbers = numbers.map((n) => {
    if (n.length < 1) return "";
    return n;
  }).map((n) => {
    if (n === "" || !n) {
      return {
        original: n,
        number: '',
        valid: false
      }
    }
    if (n.indexOf('03') === 0) {
      if (n.length > 10) {
        n = n.replace('03', 3);
      }
    }
    if (n[0] !== '3' && n[0] !== '0' && n[0] !== '+') {
      n = `0${n}`;
    }
    const number = phoneUtil.parseAndKeepRawInput(n, 'IT');
    const r = {
      original: n,
      number: phoneUtil.format(number, PNF.E164),
      valid: phoneUtil.isValidNumberForRegion(number, 'IT')
    }
    return r;
    // return number.getNationalNumber();
  });

  res.json({
    numbers: parsedNumbers
  });
});

app.listen(process.env.PORT || 3000,() => {
  console.log(`Started on PORT ${process.env.PORT || 3000}`);
})