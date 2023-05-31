import { React, useState } from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import PropTypes from 'prop-types'

export default function PaymentForm({ handlePaymentFormChange }) {
  const [nameOnCard, setNameOnCard] = useState()
  const [cardNumber, setCardNumber] = useState()
  const [expiryDate, setExpiryDate] = useState()
  const [cVV, setCVV] = useState()

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="nameOnCard"
            label="Name on card"
            name="nameOnCard"
            value={nameOnCard}
            onChange={(e) => {
              setNameOnCard(e.target.value)
              handlePaymentFormChange('nameOnCard', e.target.value)
            }}
            fullWidth
            autoComplete="cc-name"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardNumber"
            label="Card number"
            name="cardNumber"
            value={cardNumber}
            onChange={(e) => {
              setCardNumber(e.target.value)
              handlePaymentFormChange('cardNumber', e.target.value)
            }}
            fullWidth
            autoComplete="cc-number"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="expDate"
            label="Expiry date"
            name="expiryDate"
            value={expiryDate}
            onChange={(e) => {
              setExpiryDate(e.target.value)
              handlePaymentFormChange('expiryDate', e.target.value)
            }}
            fullWidth
            autoComplete="cc-exp"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cvv"
            label="CVV"
            name="cVV"
            value={cVV}
            onChange={(e) => {
              setCVV(e.target.value)
              handlePaymentFormChange('cVV', e.target.value)
            }}
            helperText="Last three digits on signature strip"
            fullWidth
            autoComplete="cc-csc"
            variant="standard"
          />
        </Grid>
      </Grid>
    </>
  )
}

PaymentForm.propTypes = {
  handlePaymentFormChange: PropTypes.func.isRequired,
}
