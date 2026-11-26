import {Check, CreditCard, Truck} from "lucide-react";
import {cn} from "@site/ui/lib/utils";

{/* Progress Steps */
}
<div className="flex items-center justify-start gap-4 sm:gap-6 py-4">
    {[
        {step: 1, label: "Shipping", icon: Truck},
        {step: 2, label: "Payment", icon: CreditCard},
        {step: 3, label: "Review", icon: Check},
    ].map(({step, label, icon: Icon}, index) => (
        <div key={step} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
                <div
                    className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                        currentStep >= step
                            ? "bg-primary border-primary text-white"
                            : "border-border text-muted-foreground"
                    )}
                >
                    {currentStep > step ? (
                        <Check className="h-4 w-4"/>
                    ) : (
                        <Icon className="h-4 w-4"/>
                    )}
                </div>
                <span
                    className={cn(
                        "text-sm font-medium hidden sm:block",
                        currentStep >= step
                            ? "text-foreground"
                            : "text-muted-foreground"
                    )}
                >
              {label}
            </span>
            </div>
            {index < 2 && (
                <div
                    className={cn(
                        "w-8 h-0.5",
                        currentStep > step
                            ? "bg-primary"
                            : "bg-border"
                    )}
                />
            )}
        </div>
    ))}
</div>