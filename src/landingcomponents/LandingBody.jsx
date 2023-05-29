import React from 'react'
import LandingPricingSection from './LandingPricingSection'
import landingPageImg2 from './images/feature_3.png'

function LandingBody() {
  return (
    <>
      {/*About Us */}
      <section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow lg:pr-24 md:pr-16 flex flex-col md:items-start md:textLeft mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900 text-left">
              About Us
            </h1>
            <p className="mb-8 leading-relaxed text-left">
              Copper mug try-hard pitchhtmlFork pour-over freegan heirloom neutra air plant
              cold-pressed tacos poke beard tote bag. Heirloom echo park mlkshk tote bag selvage hot
              chicken authentic tumeric truffaut hexagon try-hard chambray.
            </p>
            <div className="flex justify-center">
              <button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded textLg">
                Next
              </button>
            </div>
          </div>
          <div className="lg:maxWLg lg:w-full md:w-1/2 w-5/6">
            <img
              className="object-cover object-center rounded"
              alt="ABOUT US"
              src={landingPageImg2}
            />
          </div>
        </div>
      </section>
      <LandingPricingSection />
    </>
  )
}

export default LandingBody
