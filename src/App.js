import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import './scss/style.scss'

import "primereact/resources/themes/lara-light-indigo/theme.css";    
import "primereact/resources/primereact.min.css";                                      
import 'primeicons/primeicons.css';
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY
const stripePromise = loadStripe(PUBLIC_KEY)

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Changepassword = React.lazy(() => import('./views/pages/changepassword/Changepassword'))
const LandingPage = React.lazy(() => import('./landingpage/LandingPage'))
const SelectedPlan = React.lazy(() => import('./views/pages/SelectedPlan/SelectedPlan'))
const ForgetPassword = React.lazy(() => import('./views/pages/forgetpassword/ForgetPassword'))

const SelectedPlanWrapper = () => {
  const location = useLocation()
  const selectedPlanAmount = location.state?.selectedPlanAmount || 0
  const selectedPlanTitle = location.state?.selectedPlanTitle || ''
  const selectedPlanId = location.state?.selectedPlanId || 0

  return (
    <Elements stripe={stripePromise}>
      <SelectedPlan
        selectedPlanTitle={selectedPlanTitle}
        selectedPlanAmount={selectedPlanAmount}
        selectedPlanId={selectedPlanId}
      />
    </Elements>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route exact path="/" name="Landing Page" element={<LandingPage />} />
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/selectedPlan" name="Login Page" element={<SelectedPlanWrapper />} />
          <Route exact path="/changepassword" name="Change Password" element={<Changepassword />} />
          <Route exact path="/forgetpassword" name="Forget Password" element={<ForgetPassword />} />

          <Route path="*" name="Home" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
