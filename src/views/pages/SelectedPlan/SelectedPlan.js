import * as React from 'react'
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

const steps = ['Sign Up', 'Payment Details', 'Review']

function getStepContent(step, handleSignUpFormChange, handlePaymentFormChange) {
  switch (step) {
    case 0:
      return <SignUpForm handleSignUpFormChange={handleSignUpFormChange} />
    case 1:
      return <PaymentForm handlePaymentFormChange={handlePaymentFormChange} />
    case 2:
      return <Review />
    default:
      throw new Error('Unknown step')
  }
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()

export default function Checkout() {
  const [activeStep, setActiveStep] = React.useState(0)

  //-----------------
  // SIGN UP COMPANY
  //-----------------
  const [signUpFormData, setSignUpFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [paymentFormData, setPaymentFormData] = React.useState({
    nameOnCard: '',
    cardNumber: '',
    expiryDate: '',
    cVV: '',
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

  const handlePaymentFormChange = (fieldName, value) => {
    setPaymentFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }))
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
      const paymentFormValues = {
        nameOnCard: paymentFormData.nameOnCard,
        cardNumber: paymentFormData.cardNumber,
        expiryDate: paymentFormData.expiryDate,
        cVV: paymentFormData.cVV,
      }
      console.log('paymentFormValues : ', paymentFormValues)
      setActiveStep(activeStep + 1)
    } else if (activeStep === 2) {
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
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
                Thank you Messege for Subscribing Plan
              </Typography>
              <Typography variant="subtitle1">Thank you Messege for Subscribing Plan</Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep, handleSignUpFormChange, handlePaymentFormChange)}
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
            </React.Fragment>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  )
}
