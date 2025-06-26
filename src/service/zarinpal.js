const axios = require("axios");

const zarinpal = axios.create({
  baseURL: process.env.ZARINPAL_API_BASE_URL,
});

const createPayment = async function ({ amountInRial, description, mobile }) {
  try {
    const response = await zarinpal.post("/request.json", {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      callback_url: process.env.ZARINPAL_PAYMENT_CALLBACK_URL,
      amount: amountInRial,
      description,
      metadata: {
        mobile,
      },
    });

    const data = response.data.data;

    return {
      authority: data.authority,
      paymentUrl: process.env.ZARINPAL_PAYMENT_BASE_URL + data.authority,
    };
  } catch (err) {
    console.log(err);
    throw new Error(err?.response?.data?.errors?.message || "Zarinpal error");
  }
};

const verifyPayment = async function ({ amountInRial, authority }) {
  try {
    const response = await zarinpal.post(
      "/verify.json",
      {
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        amount: amountInRial,
        authority,
      },
      {
        validateStatus: (status) => status <= 500,
      }
    );

    return response.data.data;
  } catch (err) {
    console.log(err);
    throw new Error(err?.response?.data?.errors?.message || "Zarinpal error");
  }
};

module.exports = {
  createPayment,
  verifyPayment,
};
