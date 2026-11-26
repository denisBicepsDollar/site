"use client";
import {X} from "lucide-react";
import {useState} from "react";
import Link from 'next/link';
import {AspectRatio} from "@site/ui/aspect-ratio";
import {Button, buttonVariants} from "@site/ui/button";
import {Separator} from "@site/ui/separator";
import {useCartStore} from "@/entities/cart";


const CardDropdown = () => {
    const cartItems = useCartStore((state) => state.cartItems);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    console.log(cartItems);


    if (cartItems?.length === 0 || !cartItems) {
        return (
            <section className="text-center">
                <p className="mb-4 text-sm font-semibold">Корзина пуста</p>
                <p className="mb-4 text-xs text-muted-foreground">
                    Кажется вы еще ничего не добавили
                </p>
                <Link className={buttonVariants({size: "xs"})} href="/products">
                    Посмотреть каталог
                </Link>
            </section>
        );
    }

    const subtotal = cartItems?.reduce(
        (sum, item) => sum + item.price * item.cartQuantity,
        0,
    );

    const formatPrice = (price) => {
        return new Intl.NumberFormat("ru-RU", {
            style: "currency",
            currency: "RUB",
        }).format(price);
    };

    return (
        <section className="container max-w-2xl">
            <div className="space-y-4">
                {cartItems.map((cartItem) => (
                    <div
                        key={cartItem.id}
                        className="flex items-center gap-4 rounded-lg border">
                        <div className="w-10 h-10 shrink-0 overflow-hidden rounded-md">
                            <AspectRatio ratio={1}>
                                <img
                                    src={cartItem.previewImage}
                                    alt={cartItem.productName}
                                    className="h-full w-full object-cover"
                                />
                            </AspectRatio>
                        </div>

                        <div className="flex-1">
                            <h3 className="font-medium ">{cartItem.productName} {cartItem.name}</h3>
                            <p className="text-xs text-muted-foreground">
                                Количество: {cartItem.cartQuantity}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="font-semibold">
                                {formatPrice(cartItem.price * cartItem.cartQuantity)}
                            </p>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon-xs"
                            className="shrink-0"
                            onClick={() => removeFromCart(cartItem.id)}
                        >
                            <X className="size-4"/>
                        </Button>
                    </div>
                ))}
                <div className="flex justify-between text-lg font-semibold">
                    <span>Итого:</span>
                    <span>{formatPrice(subtotal)}</span>
                </div>
            </div>

            <Separator className="my-6"/>

            <div className="flex flex-col items-center space-y-4">
                <Link href="/cart" className={buttonVariants({size: "xs"})}>
                    Перейти в корзину
                </Link>
            </div>
        </section>
    );
};

export {CardDropdown};
