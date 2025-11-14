import { addServer } from "@/lib/db"
import { ServerPC } from "@/types/server"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Checkbox } from "./catalyst/checkbox"
import { Button } from "./ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"

const DEFAULT_PORTS = {
    http: 80,
    https: 443
} as const

const TIME_MS = {
    _30s: 10000,
    five: 60000 * 5,
    fifteen: 60000 * 15,
    thirty: 60000 * 30,
    hour: 60000 * 60
} as const

const ProtocolEnum = z.enum(["http", "https"])

const TimeToCheckEnum = z.enum(["_30s", "five", "fifteen", "thirty", "hour"])

// Schema keys match form field names
const formSchema = z.object({
    serverName: z.string().min(1, { message: "Required." }).max(10),
    ip_domain: z.string().min(1, { message: "Required." }).max(100),
    protocol: ProtocolEnum,
    port: z.coerce.number().int().min(1).max(65535),
    timetocheck: TimeToCheckEnum,
    notify: z.boolean()
})

type FormInput = z.input<typeof formSchema>
type FormOutput = z.output<typeof formSchema>

interface AddPCFormProps {
    addedToFormToggle: (value: boolean) => void
}

export default function AddPCForm({ addedToFormToggle }: AddPCFormProps) {
    const form = useForm<FormInput, any, FormOutput>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
            serverName: "",
            ip_domain: "",
            protocol: "https",
            port: DEFAULT_PORTS.https,
            timetocheck: "thirty",
            notify: false
        }
    })

    const protocol = form.watch("protocol")

    // Auto-fill port when protocol changes if user hasn’t touched port
    useEffect(() => {
        const dirtyPort = (form.formState.dirtyFields as any)?.port
        if (!dirtyPort) {
            const next = DEFAULT_PORTS[protocol as keyof typeof DEFAULT_PORTS]
            form.setValue("port", next, {
                shouldDirty: false,
                shouldValidate: true
            })
        }
    }, [protocol, form])

    const onSubmit = async (values: FormOutput) => {
        const newPc: ServerPC = {
            serverName: values.serverName,
            ip_domain: values.ip_domain,
            protocol: values.protocol,
            port: values.port,
            timeMilliseconds: TIME_MS[values.timetocheck],
            notify: values.notify ? 1 : 0
        }

        const serverName = await addServer(newPc)
            .then(() => {
                window.location.reload()
                form.reset({
                    serverName: "",
                    ip_domain: "",
                    protocol: "https",
                    port: DEFAULT_PORTS.https,
                    timetocheck: "thirty",
                    notify: false
                })
                addedToFormToggle(false)
                console.log("Server added to DB ", serverName)
            })
            .catch((err) => {
                console.error("Error adding server:", err)
            })
    }

    return (
        <div className="mx-auto max-w-xl">
            <h3 className="text-md py-4 font-semibold">Add Server</h3>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-2"
                >
                    <FormField
                        control={form.control}
                        name="serverName"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <input
                                        {...field}
                                        placeholder="Name to display"
                                        autoComplete="off"
                                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="ip_domain"
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
                                        <option value="http">HTTP</option>
                                        <option value="https">HTTPS</option>
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                                        <option value="_30s">Every 30 s</option>
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
                                    Notify Offline
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
