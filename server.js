const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
require("dotenv").config();
const port = process.env.PORT;
const bodyParser = require("body-parser");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello stripe!");
});

app.post("/create-checkout-session", async (req, res) => {

  const line_items = req.body.productData.map((item) => {
    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: item.title,
          images: [item.image],
          description: item.description,
          metadata: {
            id:item._id
          }
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    };
  })
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: `${process.env.CILENT_URL}/checkout-success`,
    cancel_url: `${process.env.CILENT_URL}/cart`,
  });

  res.send({url:session.url});
});

app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});