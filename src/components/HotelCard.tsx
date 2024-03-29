"use client";

import { CheckoutBody } from "@/app/checkout-sessions/route";
import { IHotelData } from "@/app/page";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import { useState } from "react";
import Stripe from "stripe";

const HotelCard = ({
  hotelData,
  isHistory = false,
}: {
  hotelData: IHotelData;
  isHistory?: boolean;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const bookNow = async () => {
    try {
      setLoading(true);

      const curentItem = {
        id: hotelData?.id,
        name: hotelData?.name,
        hotelName: hotelData?.hotelName,
        price: hotelData?.price,
        selectedDates: hotelData?.selectedDates,
        room: hotelData?.room,
        addOns: hotelData?.addOns,
        status: "incomplete",
      };

      //save current item
      localStorage.setItem("currentItem", JSON.stringify(curentItem));

      //   console.log(JSON.parse(localStorage?.getItem("currentItem") as string));

      //map addOns
      let addOnItems: any = hotelData?.addOns?.map(
        (addOn: { name: string; price: number }) => {
          return {
            price_data: {
              currency: "bdt",
              unit_amount:
                addOn?.price > 0
                  ? hotelData?.selectedDates
                    ? addOn?.price * hotelData?.selectedDates?.length * 100
                    : 0
                  : 0,
              product_data: {
                name: addOn?.name,
                description: `Add On: ${addOn?.name} (${hotelData?.selectedDates?.length} days)`,
              },
            },
            quantity: 1,
          };
        }
      );

      const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
      const stripe = await loadStripe(STRIPE_PK);

      const body: CheckoutBody = {
        line_items: [
          ...addOnItems,
          {
            price_data: {
              currency: "bdt",
              unit_amount: hotelData?.price
                ? hotelData?.selectedDates
                  ? hotelData?.price * hotelData?.selectedDates?.length * 100
                  : 0
                : 0,
              product_data: {
                name: hotelData?.name + " Room",
                description: `Room: ${hotelData?.room} - ${hotelData?.selectedDates?.length} days`,
              },
            },
            quantity: 1,
          },
        ],
      };

      const result = await fetch("/checkout-sessions", {
        method: "post",
        body: JSON.stringify(body, null),
        headers: {
          "content-type": "application/json",
        },
      });

      // step 4: get the data and redirect to checkout using the sessionId
      const data = (await result.json()) as Stripe.Checkout.Session;
      const sessionId = data.id!;
      stripe?.redirectToCheckout({ sessionId });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Link
      href={isHistory ? `#` : `/hotels/${hotelData?.id}`}
      className="border-2 rounded p-5 w-[auto]"
      key={hotelData?.id}
    >
      {!isHistory ? (
        <h2 className="text-xl">{hotelData?.name}</h2>
      ) : (
        <h2 className="text-xl">{hotelData?.hotelName}</h2>
      )}

      <div className="mt-3">
        <p className="text-[teal]">Price: {hotelData?.price} BDT</p>
        {isHistory ? (
          <>
            <p>Room: {hotelData?.room}</p>
            <p>
              Check in date:{" "}
              {hotelData?.selectedDates &&
                hotelData?.selectedDates[0]?.slice(0, 10)}
            </p>
            <p>
              Check out date:{" "}
              {hotelData?.selectedDates &&
                hotelData?.selectedDates[
                  hotelData?.selectedDates?.length - 1
                ]?.slice(0, 10)}
            </p>
            <p>
              Add Ons:{" "}
              {hotelData?.addOns?.map((addOn) => {
                return (
                  <span key={addOn?.id}>
                    {addOn?.name} ({addOn?.price} BDT),
                  </span>
                );
              })}
            </p>
            <p>Booking Status: {hotelData?.status}</p>

            {hotelData?.status === "incomplete" ? (
              <button
                className="bg-[teal] p-1 rounded border-2 mt-3"
                onClick={() => bookNow()}
                disabled={loading}
              >
                {loading ? "Booking..." : "Book Now"}
              </button>
            ) : (
              <button
                className="bg-[red] p-1 rounded border-2 mt-3"
                disabled={true}
              >
                Booked
              </button>
            )}
          </>
        ) : (
          <p>
            Rooms:{" "}
            {hotelData?.rooms?.map((room: string) => (
              <span key={room}>{room + ", "}</span>
            ))}
          </p>
        )}
      </div>
    </Link>
  );
};

export default HotelCard;
