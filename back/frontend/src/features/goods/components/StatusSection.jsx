import {STATUSES} from "../constants.js";

/* Секция статуса товара (правый сайдбар) */
export function StatusSection({status, onStatusChange}) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4">
            <span className="text-xs font-semibold uppercase text-zinc-500">
                Статус
            </span>

            <div className="flex flex-col gap-1.5">
                {STATUSES.map(({value, name, description}) => {
                    const isSelected = status === value;

                    return (
                        <label
                            key={value}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-2.5 transition-all
                                        ${isSelected
                                ? "border-zinc-900 bg-zinc-50"
                                : "border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50/50"}`}>
                            <input
                                type="radio"
                                name="statusRadioGroup"
                                className="h-4 w-4 accent-zinc-900"
                                value={value}
                                checked={isSelected}
                                onChange={event => onStatusChange(event.target.value)}
                            />
                            <div className="flex flex-col">
                                <span className={`text-sm ${isSelected ? "font-medium text-zinc-900" : "text-zinc-500"}`}>
                                    {name}
                                </span>
                                <span className="text-xs text-zinc-500">
                                    {description}
                                </span>
                            </div>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}
