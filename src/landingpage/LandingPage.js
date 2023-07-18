import { React, useEffect } from 'react'
import LandingNavbar from 'src/landingcomponents/LandingHeader'
import LandingBody from 'src/landingcomponents/LandingBody'
import LandingFooter from 'src/landingcomponents/LandingFooter'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate()
  useEffect(() => {
    const sessionToken = JSON.parse(sessionStorage.getItem('user-info'))?.token

    if (sessionToken) {
      navigate('/Dashboard')
    }
  })

  return (
    <>
      <LandingNavbar />
      <LandingBody />
      <LandingFooter />
    </>
  )
}

export default LandingPage
