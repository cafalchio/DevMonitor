"use client"

import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Transition,
    TransitionChild
} from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { Fragment, useState } from "react"

export default function SettingsDrawer() {
    const [open, setOpen] = useState(false)

    return (
        <div className="mb-8">
            <button
                onClick={() => setOpen(true)}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300"
            >
                Open Settings
            </button>

            <Transition show={open} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={setOpen}>
                    <DialogBackdrop className="fixed inset-0 bg-black/50" />

                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
                                <TransitionChild
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-300"
                                    enterFrom="-translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-300"
                                    leaveFrom="translate-x-0"
                                    leaveTo="-translate-x-full"
                                >
                                    <DialogPanel className="pointer-events-auto w-5/6 bg-white shadow-xl">
                                        {/* Close button */}
                                        <div className="flex justify-end p-4 pt-8">
                                            <button
                                                onClick={() => setOpen(false)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <XMarkIcon className="h-6 w-6" />
                                            </button>
                                        </div>

                                        {/* Panel content */}
                                        <div className="p-6">
                                            <h2 className="text-lg font-semibold text-gray-900">
                                                Settings
                                            </h2>
                                            <p className="mt-2 text-sm text-gray-600">
                                                This is where your settings
                                                content goes.
                                            </p>
                                        </div>
                                    </DialogPanel>
                                </TransitionChild>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}
