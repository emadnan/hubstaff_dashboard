import React from 'react'
import LandingPricingSection from './LandingPricingSection'
import LandingHome from 'src/landingcomponents/LandingHome'
import LandingAboutUs from './LandingAboutUs'

function LandingBody() {
  return (
    <>
      <LandingHome />
      <LandingPricingSection />
      <LandingAboutUs />
    </>
  )
}

export default LandingBody
