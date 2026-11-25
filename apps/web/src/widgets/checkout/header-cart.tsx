import {Button} from "@site/ui/button";
import {ChevronLeft} from "lucide-react";


<div className="flex items-center justify-between">
    <div className="flex items-start gap-4 flex-col">
        {" "}
        <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="flex items-center gap-1"
        >
            <ChevronLeft className="h-4 w-4"/>
            Back to Cart
        </Button>
        <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                Checkout
            </h1>
            <p className="text-muted-foreground text-sm">
                Complete your purchase securely
            </p>
        </div>
    </div>
</div>