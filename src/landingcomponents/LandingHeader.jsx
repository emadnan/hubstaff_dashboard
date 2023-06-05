import { React, Fragment, useState } from 'react'
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import logo_workLog from '../assets/images/workLogBlack.png'
import { useNavigate } from 'react-router-dom'

const features = [
  {
    name: 'Employee Monitoring',
    description:
      'WorkLog employee monitoring feature allows you to monitor your team`s activity, track time, and improve productivity.',
    href: '#',
  },
  {
    name: 'Project management',
    description:
      'WorkLog project management feature allows users to create projects, set deadlines, and assign tasks to team members.',
    href: '#',
  },
  {
    name: 'Team management',
    description:
      'The WorkLog Team Management feature is designed to help Team Leads effectively manage their projects and task, set deadlines, and assign tasks to team members.',
    href: '#',
  },
  {
    name: 'Weekly and Monthly Reports',
    description:
      'WorkLog provides detailed weekly and monthly reports for a comprehensive overview of your team&#39;s activities, productivity, and progress. These reports offer insights into work hours, task completion rates, and team performance, empowering you to optimize productivity and identify areas for improvement in your remote team.',
    href: '#',
  },
  {
    name: 'Functional Specification Form.',
    description:
      'The WorkLog functional specification form has been enhanced for an intuitive experience. Users can effortlessly enter detailed task specifications, improving communication and task management. This streamlining promotes seamless collaboration and efficient goal achievement for teams.',
    href: '#',
  },
]
const how_its_works = [
  {
    name: 'Analytics',
    description: 'Get a better understanding of your traffic',
    href: '#',
  },
  {
    name: 'Security',
    description: 'Your customers’ data will be safe and secure',
    href: '#',
  },
  {
    name: 'Integrations',
    description: 'Connect with third-party tools',
    href: '#',
  },
]
const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const gotoSignIn = () => {
    navigate('/login')
  }

  const gotoSignUp = () => {
    navigate('/register')
  }

  return (
    <header className="bg-white" style={{ position: 'sticky', top: 0, zIndex: 999 }}>
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img className="h-10 w-auto" src={logo_workLog} alt="Hubstaff" />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          <Popover className="relative">
            <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
              Features
              <ChevronDownIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="fixed inset-x-0 top-[4.5rem] z-10">
                <div className="max-w-full w-screen max-h-screen overflow-y-auto bg-white">
                  <hr />
                  <div className="p-4">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                      {features.map((item) => (
                        <div
                          key={item.name}
                          className="group relative flex items-baseline gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                        >
                          <div className="flex-auto">
                            <a
                              href={item.href}
                              className="block font-semibold text-gray-900 no-underline"
                            >
                              {item.name}
                              <span className="absolute inset-0" />
                            </a>
                            <hr /> {/* Add the line element here */}
                            <p className="mt-1 text-gray-600">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>

          <Popover className="relative">
            <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
              How its work
              <ChevronDownIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="fixed inset-x-0 top-[4.5rem] z-10">
                <div className="max-w-full w-screen max-h-screen overflow-y-auto bg-white">
                  <hr />
                  <div className="p-4">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                      {how_its_works.map((item) => (
                        <div
                          key={item.name}
                          className="group relative flex items-baseline gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                        >
                          <div className="flex-auto">
                            <a
                              href={item.href}
                              className="block font-semibold text-gray-900 no-underline"
                            >
                              {item.name}
                              <span className="absolute inset-0" />
                            </a>
                            <hr />
                            <p className="mt-1 text-gray-600">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>

          <a href="#" className="text-sm font-semibold leading-6 text-gray-900 no-underline">
            Pricing
          </a>
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900 no-underline">
            About Us
          </a>
        </Popover.Group>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <button
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-md"
            onClick={gotoSignUp}
          >
            Sign Up
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
            onClick={gotoSignIn}
          >
            Sign In
          </button>
        </div>
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img className="h-8 w-auto" src={logo_workLog} alt="" />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                        Features
                        <ChevronDownIcon
                          className={classNames(open ? 'rotate-180' : '', 'h-5 w-5 flex-none')}
                          aria-hidden="true"
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-2 space-y-2">
                        {[...features, ...callsToAction].map((item) => (
                          <Disclosure.Button
                            key={item.name}
                            as="a"
                            href={item.href}
                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50 no-underline"
                          >
                            {item.name}
                          </Disclosure.Button>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <Disclosure as="div" className="-mx-3">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                        How its work
                        <ChevronDownIcon
                          className={classNames(open ? 'rotate-180' : '', 'h-5 w-5 flex-none')}
                          aria-hidden="true"
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-2 space-y-2">
                        {[...how_its_works, ...callsToAction].map((item) => (
                          <Disclosure.Button
                            key={item.name}
                            as="a"
                            href={item.href}
                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50 no-underline"
                          >
                            {item.name}
                          </Disclosure.Button>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 no-underline"
                >
                  Pricing
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 no-underline"
                >
                  About Us
                </a>
              </div>
              <div className="py-6">
                <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-md">
                  Sign Up
                </button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}
