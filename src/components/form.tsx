"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Database from "@tauri-apps/plugin-sql"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Checkbox } from "./catalyst/checkbox"
import { Button } from "./ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"

// Initialize the database connection (adjust path as needed)
const db = await Database.load("sqlite:mydatabase.db")

const DEFAULT_PORTS = {
    http: 80,
    https: 443,
    ftp: 21,
    sftp: 22,
    ssh: 22,
    smtp: 25,
    imap: 143,
    pop3: 110,
    mqtt: 1883,
    amqp: 5672
} as const

// const TIME_MS = {
//     five: 60000 * 5,
//     fifteen: 60000 * 15,
//     thirty: 60000 * 30,
//     hour: 60000 * 60
// } as const

const ProtocolEnum = z.enum([
    "http",
    "https",
    "ftp",
    "sftp",
    "ssh",
    "smtp",
    "imap",
    "pop3",
    "mqtt",
    "amqp"
])

const TimeToCheckEnum = z.enum(["five", "fifteen", "thirty", "hour"])

// Schema (port coerced to number)
const formSchema = z.object({
    servername: z.string().min(1, { message: "Required." }).max(50),
    protocol: ProtocolEnum,
    port: z.coerce.number().int().min(1).max(65535),
    timetocheck: TimeToCheckEnum,
    notify: z.boolean()
})

// Types
type FormInput = z.input<typeof formSchema> // before coercion
type FormOutput = z.output<typeof formSchema> // after coercion

export default function AddPCForm() {
    const form = useForm<FormInput, any, FormOutput>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
            servername: "",
            protocol: "https",
            port: DEFAULT_PORTS.https,
            timetocheck: "thirty",
            notify: false
        }
    })

    const protocol = form.watch("protocol")

    // Auto-fill port when protocol changes, unless user edited port already
    useEffect(() => {
        if (!form.formState.dirtyFields?.port) {
            const next = DEFAULT_PORTS[protocol as keyof typeof DEFAULT_PORTS]
            form.setValue("port", next, {
                shouldDirty: false,
                shouldValidate: true
            })
        }
    }, [protocol, form.formState.dirtyFields?.port, form])

    return (
        <div className="mx-auto max-w-xl p-6">
            <h2 className="text-md mb-6 font-semibold">Add Server</h2>

            <Form {...form}>
                <form
                    // Inline callback lets RHF infer `values` as FormOutput
                    onSubmit={form.handleSubmit((values) => {
                        // Insert into database
                        db.execute(
                            `INSERT INTO servers (servername, protocol, port, timetocheck, notify) VALUES (?, ?, ?, ?, ?)`,
                            [
                                values.servername,
                                values.protocol,
                                values.port,
                                values.timetocheck,
                                values.notify ? 1 : 0
                            ]
                        )
                            .then(() => {
                                console.log("Server added successfully")
                            })
                            .catch((err) => {
                                console.error("Error adding server:", err)
                            })
                        // Reset form after submission
                        console.log("submit:", values) // values.port is number
                        form.reset({
                            servername: "",
                            protocol: "https",
                            port: DEFAULT_PORTS.https,
                            notify: false
                        })
                    })}
                    className="space-y-2"
                >
                    {/* Server name */}
                    <FormField
                        control={form.control}
                        name="servername"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <input
                                        {...field}
                                        placeholder="Hostname or IPv4"
                                        autoComplete="off"
                                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Protocol */}
                    <FormField
                        control={form.control}
                        name="protocol"
                        render={({ field }) => (
                            <FormItem className="text-sm">
                                <FormControl>
                                    <select
                                        {...field}
                                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                    >
                                        <option
                                            className="text-sm"
                                            value="http"
                                        >
                                            HTTP
                                        </option>
                                        <option
                                            className="text-sm"
                                            value="https"
                                        >
                                            HTTPS
                                        </option>
                                        <option className="text-sm" value="ftp">
                                            FTP
                                        </option>
                                        <option
                                            className="text-sm"
                                            value="sftp"
                                        >
                                            SFTP
                                        </option>
                                        <option className="text-sm" value="ssh">
                                            SSH
                                        </option>
                                        <option
                                            className="text-sm"
                                            value="smtp"
                                        >
                                            SMTP
                                        </option>
                                        <option
                                            className="text-sm"
                                            value="imap"
                                        >
                                            IMAP
                                        </option>
                                        <option
                                            className="text-sm"
                                            value="pop3"
                                        >
                                            POP3
                                        </option>
                                        <option
                                            className="text-sm"
                                            value="mqtt"
                                        >
                                            MQTT
                                        </option>
                                        <option
                                            className="text-sm"
                                            value="amqp"
                                        >
                                            AMQP
                                        </option>
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Port (auto-filled, user-editable) */}
                    <FormField
                        control={form.control}
                        name="port"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <input
                                        {...field}
                                        type="number"
                                        inputMode="numeric"
                                        min={1}
                                        max={65535}
                                        value={field.value as number}
                                        placeholder="e.g., 443"
                                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="timetocheck"
                        render={({ field }) => (
                            <FormItem className="text-sm">
                                <FormControl>
                                    <select
                                        value={field.value ?? "thirty"}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                        ref={field.ref}
                                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                    >
                                        <option value="five">
                                            Every 5 minutes
                                        </option>
                                        <option value="fifteen">
                                            Every 15 minutes
                                        </option>
                                        <option value="thirty">
                                            Every 30 minutes
                                        </option>
                                        <option value="hour">Every hour</option>
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="notify"
                        render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                    <Checkbox
                                        id="notify"
                                        checked={field.value as boolean}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <label
                                    htmlFor="notify"
                                    className="cursor-pointer text-sm select-none"
                                >
                                    Notify me
                                </label>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="pt-2">
                        <Button type="submit" className="w-full">
                            Submit
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
