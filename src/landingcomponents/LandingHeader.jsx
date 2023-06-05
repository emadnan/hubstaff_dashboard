import React from 'react'
import landingPageImg1 from '../assets/images/landingPageImg1.png'

function LandingHeader() {
  return (
    <div id="main">
      <section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
            <img className="object-cover object-center rounded" alt="hero" src={landingPageImg1} />
          </div>
          <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900 text-left">
              WorkLog
            </h1>
            <p className="mb-8 leading-relaxed text-left">
              WorkLog boosts productivity for remote teams with comprehensive team management and
              time-tracking software. It enables easy monitoring of work hours, efficient task
              assignment, and effective team performance management.
            </p>
            <div className="flex justify-center">
              <button className="inline-flex text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded text-lg">
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingHeader
