import { React } from 'react'
import LandingNavbar from 'src/landingcomponents/LandingHeader'
import LandingBody from 'src/landingcomponents/LandingBody'
import LandingFooter from 'src/landingcomponents/LandingFooter'

function LandingPage() {
  return (
    <>
      <LandingNavbar />
      <LandingBody />
      <LandingFooter />
    </>
  )
}

export default LandingPage
