import { React, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import SignUpForm from './SignUpForm'
import PaymentForm from './PaymentForm'
import Review from './Review'
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import axios from 'axios'

const steps = ['Sign Up', 'Payment Details', 'Review']

function getStepContent(step, handleSignUpFormChange, handlePaymentFormChange, paymentDetails) {
  switch (step) {
    case 0:
      return <SignUpForm handleSignUpFormChange={handleSignUpFormChange} />
    case 1:
      return <PaymentForm handlePaymentFormChange={handlePaymentFormChange} />
    case 2:
      return <Review paymentDetails={paymentDetails} />
    default:
      throw new Error('Unknown step')
  }
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()

export default function Checkout() {
  const [paymentDetails, setPaymentDetails] = useState()
  const stripe = useStripe()
  const elements = useElements()

  const [activeStep, setActiveStep] = useState(0)
  //-----------------
  // SIGN UP COMPANY
  //-----------------
  const [signUpFormData, setSignUpFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }

  const handleSignUpFormChange = (fieldName, value) => {
    setSignUpFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }))
  }
  const [paymentFormData, setPaymentFormData] = useState()
  const handlePaymentFormChange = () => {
    const card = elements.getElement(CardCvcElement, CardExpiryElement, CardNumberElement)
    setPaymentFormData(card)
  }

  const handleNext = async () => {
    if (activeStep === 0) {
      const signUpFormValues = {
        name: signUpFormData.name,
        email: signUpFormData.email,
        password: signUpFormData.password,
        confirmPassword: signUpFormData.confirmPassword,
      }
      console.log('signUpFormValues : ', signUpFormValues)
      setActiveStep(activeStep + 1)
    } else if (activeStep === 1) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: paymentFormData,
      })

      setPaymentDetails(paymentMethod)
      if (error) {
        console.log('[error]', error)
      } else {
        console.log('[PaymentMethod]', paymentMethod)
      }

      setActiveStep(activeStep + 1)
    } else if (activeStep === 2) {
      try {
        const { id } = paymentDetails
        const response = await axios.post('URL', {
          ammout: 'will be fetch when we SELECT the plan',
          id,
        }) // http://localhost:4000/payment
        if (response.data.success) {
          console.log('Successfull Payment')
        }
      } catch (error) {
        console.log(error)
      }
      setActiveStep(activeStep + 1)
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center">
            PRICING
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <>
              <Typography variant="h5" gutterBottom>
                Thank you Messege for Subscribing Plan
              </Typography>
              <Typography variant="subtitle1">Thank you Messege for Subscribing Plan</Typography>
            </>
          ) : (
            <>
              {getStepContent(
                activeStep,
                handleSignUpFormChange,
                handlePaymentFormChange,
                paymentDetails,
              )}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}

                <Button variant="contained" onClick={handleNext} sx={{ mt: 3, ml: 1 }}>
                  {activeStep === steps.length - 1 ? 'Done' : 'Next'}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  )
}
