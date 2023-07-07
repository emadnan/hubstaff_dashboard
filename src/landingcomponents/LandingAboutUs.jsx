import React from 'react'
import landingPageImg2 from './images/feature_3.png'

const LandingAboutUs = () => {
  return (
    <section className="text-gray-600 body-font">
      <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
            ABOUT US
          </h1>
          <p className="mb-8 leading-relaxed text-left">
            Welcome to WorkLog, a revolutionary productivity application designed to transform the
            way you manage your work. Our mission is to streamline and optimize work processes,
            eliminating the need for manual paperwork and providing a more efficient solution. With
            WorkLog, you can effortlessly track your tasks, monitor progress, and collaborate
            seamlessly with your team. Our intuitive interface and powerful features empower you to
            stay organized and focused, ensuring timely completion of projects. By utilizing
            WorkLog, you save time, improve efficiency, and enhance your professional productivity.
            Whether you&apos;re a remote worker, project manager, or part of a distributed team, our
            application offers a convenient and effective way to manage work tasks. At WorkLog, we
            are committed to providing innovative solutions that help individuals and teams maximize
            their potential. Our goal is to create technology that is user-friendly, reliable, and
            enhances your overall work experience. Experience the difference with WorkLog, and
            unlock your true productivity potential.
          </p>
          <div className="flex justify-center">
            <button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
              <a
                href="http://effy.biafotech.com/releases/WorkLogSetup.zip"
                target="blank"
                style={{ textDecoration: 'none', color: 'white' }}
              >
                Download for Windows
              </a>
            </button>
          </div>
        </div>
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
          <img className="object-cover object-center rounded" alt="hero" src={landingPageImg2} />
        </div>
      </div>
    </section>
  )
}

export default LandingAboutUs
