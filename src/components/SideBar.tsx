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
import AddPCForm from "./form"

export default function SettingsDrawer() {
    const [open, setOpen] = useState(false)

    return (
        <div
            className="sticky z-10 bg-white/80 px-3 pb-2 backdrop-blur"
            style={{ top: "max(env(safe-area-inset-top), 0px)" }}
        >
            <button
                onClick={() => setOpen(true)}
                className="rounded-md bg-gray-200 px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-300"
            >
                Add Server
            </button>

            <Transition show={open} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={setOpen}>
                    <DialogBackdrop className="fixed inset-0 bg-black/50" />

                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="fixed inset-y-0 flex w-screen">
                                <TransitionChild
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-300"
                                    enterFrom="-translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-300"
                                    leaveFrom="translate-x-0"
                                    leaveTo="-translate-x-full"
                                >
                                    <DialogPanel className="pointer-events-auto flex h-full w-[80vw] flex-col bg-white shadow-xl">
                                        <div className="py-[calc(env(safe-area-inset-top)+.8rem)]"></div>
                                        {/* Header */}
                                        <div className="flex items-center justify-end">
                                            <button
                                                onClick={() => setOpen(false)}
                                                className="px-4 text-gray-500 hover:text-gray-700"
                                            >
                                                <XMarkIcon className="h-6 w-6" />
                                            </button>
                                        </div>
                                        {/* Panel content */}
                                        <div className="overflow-y-auto px-4">
                                            <AddPCForm
                                                addedToFormToggle={setOpen}
                                            />
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
