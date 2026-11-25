import Link from "next/link";
import { useCartStore } from "@/entities/cart/model/cartStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/shared/ui/button";

export function AsidePanel() {
  const cartItems = useCartStore((state) => state.cartItems);
  console.log(cartItems);
  return (
    <Card variant="header">
      <CardHeader>
        <CardTitle>Ваша корзина</CardTitle>
      </CardHeader>
      <CardContent>
        {cartItems?.map(({ cartQuantity, name, productName, price }) => {
          return (
            <div className={"flex items-center justify-between"}>
              <dd className="text-base font-medium text-gray-900 dark:text-white">
                {productName}
                <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                  {name}
                </dt>
              </dd>
              <dd className="text-base font-medium text-gray-900 dark:text-white">
                {cartQuantity} x {price} ₽
              </dd>
            </div>
          );
        })}
        <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
          <dt className="text-base font-bold text-gray-900 dark:text-white">
            Итого
          </dt>
          <dd className="text-base font-bold text-gray-900 dark:text-white">
            {cartItems
              ?.map((item) => item.price * item.cartQuantity)
              ?.reduce((acc, item) => acc + item, 0)}
          </dd>
        </dl>
        <Link
          className={buttonVariants({ variant: "accent" })}
          href="/cart/checkout"
        >
          далее
        </Link>
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            {" "}
            или{" "}
          </span>
          <Link
            href="#"
            title=""
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
          >
            Продолжить покупки
            <ArrowRight />
          </Link>
        </div>
        {/*<dl className="flex items-center justify-between gap-4">
          <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
            Savings
          </dt>
          <dd className="text-base font-medium text-green-600">-$299.00</dd>
        </dl>

        <dl className="flex items-center justify-between gap-4">
          <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
            Store Pickup
          </dt>
          <dd className="text-base font-medium text-gray-900 dark:text-white">
            $99
          </dd>
        </dl>

        <dl className="flex items-center justify-between gap-4">
          <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
            Tax
          </dt>
          <dd className="text-base font-medium text-gray-900 dark:text-white">
            $799
          </dd>
        </dl>

        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
          <form className="space-y-4">
            <div>
              <label
                htmlFor="voucher"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                {" "}
                Do you have a voucher or gift card?{" "}
              </label>
              <input
                type="text"
                id="voucher"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                placeholder=""
                required
              />
            </div>
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Apply Code
            </button>
          </form>
        </div>*/}
      </CardContent>
    </Card>
  );
}
