import { React } from 'react'
import LandingNavbar from 'src/landingcomponents/LandingNavbar'
import LandingBody from 'src/landingcomponents/LandingBody'
import LandingFooter from 'src/landingcomponents/LandingFooter'
import LandingHeader from 'src/landingcomponents/LandingHeader'

function LandingPage() {
  return (
    <>
      <LandingNavbar />
      <LandingHeader />
      <LandingBody />
      <LandingFooter />
    </>
  )
}

export default LandingPage
