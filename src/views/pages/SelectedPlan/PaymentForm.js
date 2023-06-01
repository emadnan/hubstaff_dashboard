import { React } from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import PropTypes from 'prop-types'
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js'

export default function PaymentForm({ handlePaymentFormChange }) {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <label htmlFor="card-number">Enter Card Number:</label>
          <CardNumberElement
            id="card-number"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
            onChange={handlePaymentFormChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <label htmlFor="card-expiry">Enter Expiry Date:</label>
          <CardExpiryElement
            id="card-expiry"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
            onChange={handlePaymentFormChange}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <label htmlFor="card-cvc">Enter CVC:</label>
          <CardCvcElement
            id="card-cvc"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
            onChange={handlePaymentFormChange}
          />
        </Grid>
      </Grid>
    </>
  )
}

PaymentForm.propTypes = {
  handlePaymentFormChange: PropTypes.func.isRequired,
}
