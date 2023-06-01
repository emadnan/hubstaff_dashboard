import * as React from 'react'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import PropTypes from 'prop-types'

export default function Review({ paymentDetails }) {
  const { card } = paymentDetails
  const capitalizedCardBrand = card.brand.charAt(0).toUpperCase() + card.brand.slice(1)

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Review Your Selected Plan
      </Typography>
      <List disablePadding>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Your Selected Plan" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Desk Pro
          </Typography>
        </ListItem>

        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            $34.06
          </Typography>
        </ListItem>
      </List>
      <Typography variant="h6" gutterBottom>
        Payment details
      </Typography>

      <List disablePadding>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Card Brand:" />{' '}
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {capitalizedCardBrand}
          </Typography>
        </ListItem>
        {/* <Divider /> */}
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Expiry Date:" />{' '}
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {card.exp_month}/{card.exp_year}
          </Typography>
        </ListItem>
        {/* <Divider /> */}
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Last 4 digits of Card:" />{' '}
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            XXXX XXXX XXXX {card.last4}
          </Typography>
        </ListItem>
      </List>
    </React.Fragment>
  )
}

Review.propTypes = {
  paymentDetails: PropTypes.shape({
    card: PropTypes.shape({
      brand: PropTypes.string,
      last4: PropTypes.string,
      exp_month: PropTypes.number,
      exp_year: PropTypes.number,
    }),
  }).isRequired,
}
