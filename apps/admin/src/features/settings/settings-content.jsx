import {useState} from "react"
import {Bell, Check, Mail, RotateCcw, Save} from "lucide-react"

import {Button} from "@/shared/ui/actions/button.jsx"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/ui/display/card.jsx"
import {Input} from "@/shared/ui/forms/input.jsx"
import {Label} from "@/shared/ui/forms/label.jsx"
import {SectionCard} from "@/shared/ui/sections/section-card.jsx"
import {Switch} from "@/shared/ui/forms/switch.jsx"

import {DEFAULT_SETTINGS} from './constants.js'
import {PageHeader} from "@/features/dashboard/components/PageHeader.jsx";


export default function SettingsPage({initialSettings = {}, onSave}) {
    const [settings, setSettings] = useState(() => ({
        ...DEFAULT_SETTINGS,
        ...initialSettings,
    }))
    const [saveState, setSaveState] = useState("saved")
    const [saveMessage, setSaveMessage] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    function setValue(key, value) {
        setSettings((current) => ({...current, [key]: value}))
        setSaveState("dirty")
        setSaveMessage("")
    }

    function resetSettings() {
        setSettings({...DEFAULT_SETTINGS, ...initialSettings})
        setSaveState("dirty")
        setSaveMessage("Настройки возвращены к исходным значениям.")
    }

    async function saveSettings() {
        setIsSaving(true)
        setSaveMessage("")

        try {
            if (onSave) {
                await onSave(settings)
            }
            setSaveState("saved")
            setSaveMessage("Изменения сохранены.")
        } catch (error) {
            setSaveState("error")
            setSaveMessage(
                error instanceof Error
                    ? error.message
                    : "Не удалось сохранить настройки.",
            )
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div
            className="min-h-screen bg-[#F2F2F7] px-4 py-7 text-[#1C1C1E] dark:bg-black dark:text-white sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-[1280px]">
                <PageHeader
                    title="Настройки"
                    description="Уведомления"
                />

                <main className="min-w-0">
                    <SettingsContentHeader
                        saveState={saveState}
                        isSaving={isSaving}
                        onReset={resetSettings}
                        onSave={saveSettings}
                    />

                    <SaveMessage message={saveMessage} state={saveState}/>

                    <div className="space-y-4">
                        <NotificationSettings
                            settings={settings}
                            setValue={setValue}
                        />
                    </div>
                </main>
            </div>
        </div>
    )
}


function SettingsContentHeader({saveState, isSaving, onReset, onSave}) {
    return (
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                    Уведомления
                </h2>
                <p className="mt-1 text-sm text-[#8E8E93] dark:text-[#98989D]">
                    Какие события и куда отправлять.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <SaveStatus state={saveState}/>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onReset}
                    className="h-10 rounded-[12px] border-black/[0.08] bg-white px-3 dark:border-white/[0.1] dark:bg-[#1C1C1E]"
                >
                    <RotateCcw className="mr-2 size-4"/>
                    Сбросить
                </Button>
                <Button
                    type="button"
                    onClick={onSave}
                    disabled={isSaving}
                    className="h-10 rounded-[12px] bg-[#007AFF] px-4 text-white hover:bg-[#006AE6] dark:bg-[#0A84FF] dark:hover:bg-[#168BFF]"
                >
                    <Save className="mr-2 size-4"/>
                    {isSaving ? "Сохранение..." : "Сохранить"}
                </Button>
            </div>
        </div>
    )
}

function SaveStatus({state}) {
    const text = {
        saved: "Сохранено",
        dirty: "Есть изменения",
        error: "Ошибка сохранения",
    }[state]

    const colorClass =
        state === "error"
            ? "text-[#D70015] dark:text-[#FF6961]"
            : state === "dirty"
                ? "text-[#9A6700] dark:text-[#FFD60A]"
                : "text-[#8E8E93] dark:text-[#98989D]"

    return (
        <span className={`mr-1 inline-flex items-center gap-1.5 text-xs ${colorClass}`}>
            {state === "saved" && <Check className="size-3.5"/>}
            {text}
        </span>
    )
}

function SaveMessage({message, state}) {
    if (!message) return null

    const colorClass =
        state === "error"
            ? "bg-[#FF3B30]/10 text-[#D70015] dark:text-[#FF6961]"
            : "bg-[#34C759]/10 text-[#248A3D] dark:text-[#30D158]"

    return (
        <div
            role="status"
            className={`mb-4 rounded-[14px] px-4 py-3 text-sm ${colorClass}`}
        >
            {message}
        </div>
    )
}

function SettingsCard({title, description, children}) {
    return (
        <SectionCard radius={20}>
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
                {description && (
                    <CardDescription className="text-sm leading-relaxed text-[#8E8E93] dark:text-[#98989D]">
                        {description}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent>{children}</CardContent>
        </SectionCard>
    )
}

function SettingsField({id, label, description, children}) {
    return (
        <div
            className="grid gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_minmax(220px,340px)] sm:items-center sm:gap-6">
            <div className="space-y-1">
                <Label htmlFor={id} className="text-sm font-medium">
                    {label}
                </Label>
                {description && (
                    <p className="text-xs leading-relaxed text-[#8E8E93] dark:text-[#98989D]">
                        {description}
                    </p>
                )}
            </div>
            <div className="min-w-0">{children}</div>
        </div>
    )
}

function ToggleField({id, label, description, checked, onCheckedChange}) {
    return (
        <div className="flex items-center justify-between gap-5 py-4 first:pt-0 last:pb-0">
            <div className="min-w-0 space-y-1">
                <Label htmlFor={id} className="text-sm font-medium">
                    {label}
                </Label>
                {description && (
                    <p className="max-w-xl text-xs leading-relaxed text-[#8E8E93] dark:text-[#98989D]">
                        {description}
                    </p>
                )}
            </div>
            <Switch
                id={id}
                checked={checked}
                onCheckedChange={onCheckedChange}
                className="shrink-0 data-[state=checked]:bg-[#34C759]"
            />
        </div>
    )
}

function NotificationSettings({settings, setValue}) {
    return (
        <>
            <SettingsCard
                title="Куда отправлять уведомления"
                description="Уведомления для администратора и команды магазина."
            >
                <SettingsField
                    id="notificationEmail"
                    label="Email для уведомлений"
                    description="На этот адрес будут приходить выбранные уведомления."
                >
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8E8E93]"/>
                        <Input
                            id="notificationEmail"
                            type="email"
                            value={settings.notificationEmail}
                            onChange={(event) =>
                                setValue("notificationEmail", event.target.value)
                            }
                            className={`h-10 rounded-[12px] border-[#E5E5EA] bg-white shadow-none focus-visible:ring-[#007AFF]/20 dark:border-[#38383A] dark:bg-[#2C2C2E] pl-9`}
                        />
                    </div>
                </SettingsField>
            </SettingsCard>

            <SettingsCard
                title="События"
                description="Выберите, о чём сообщать команде."
            >
                <div className="divide-y divide-black/[0.06] dark:divide-white/[0.08]">
                    <ToggleField
                        id="notifyNewOrders"
                        label="Новые заказы"
                        description="Уведомлять, когда покупатель оформил заказ."
                        checked={settings.notifyNewOrders}
                        onCheckedChange={(value) =>
                            setValue("notifyNewOrders", value)
                        }
                    />
                    <ToggleField
                        id="notifyMessages"
                        label="Новые обращения"
                        description="Уведомлять о сообщениях от покупателей."
                        checked={settings.notifyMessages}
                        onCheckedChange={(value) =>
                            setValue("notifyMessages", value)
                        }
                    />
                    <ToggleField
                        id="notifyLowStock"
                        label="Низкий остаток товара"
                        description="Сообщать, когда количество товара станет небольшим."
                        checked={settings.notifyLowStock}
                        onCheckedChange={(value) =>
                            setValue("notifyLowStock", value)
                        }
                    />
                    <ToggleField
                        id="dailyDigest"
                        label="Ежедневная сводка"
                        description="Краткий итог по заказам и обращениям раз в день."
                        checked={settings.dailyDigest}
                        onCheckedChange={(value) =>
                            setValue("dailyDigest", value)
                        }
                    />
                </div>
            </SettingsCard>
        </>
    )
}
