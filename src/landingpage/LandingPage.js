import { React, useState } from 'react'
import LandingBody from 'src/landingcomponents/LandingBody'
import LandingFooter from 'src/landingcomponents/LandingFooter'
import LandingHeader from 'src/landingcomponents/LandingHeader'

function LandingPage() {
  return (
    <>
      <LandingHeader />
      <LandingBody />
      <LandingFooter />
    </>
  )
}

export default LandingPage
