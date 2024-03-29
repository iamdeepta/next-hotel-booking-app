"use client";

import { CheckoutBody } from "@/app/checkout-sessions/route";
import { IHotelData } from "@/app/page";
import MyBookingCalendar from "@/components/MyBookingCalendar";
import HotelData from "@/data/hotels.json";
import { Selected } from "@demark-pro/react-booking-calendar";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import Stripe from "stripe";

const Page = ({ params }: { params: { id: number } }) => {
  const [hotelData, setHotelData] = useState<IHotelData | null>();

  const [selectedDates, setSelectedDates] = useState<Selected[]>([]);
  const [room, setRoom] = useState<string>("");
  const [addOns, setAddOns] = useState<
    { id: number; name: string; price: number }[]
  >([]);
  const [name, setName] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setHotelData(
      HotelData?.find((item: IHotelData) => item?.id === Number(params?.id))
    );
  }, [params?.id]);

  const handleAddOns = (id: number, name: string, price: number) => {
    setAddOns((prev) => [...prev, ...[{ id, name, price }]]);
  };

  const bookNow = () => {
    console.log({ selectedDates, room, addOns });
    if (selectedDates?.length < 2) {
      alert("Please select proper date range");
      return false;
    }

    if (room.trim() === "") {
      alert("Please select a room");
      return false;
    }

    setOpenModal(true);
  };

  const submit = async () => {
    try {
      if (name.trim() === "") {
        alert("Please enter your name");
        return false;
      }

      setLoading(true);

      const curentItem = {
        id: params?.id,
        name,
        hotelName: hotelData?.name,
        price: hotelData?.price,
        selectedDates,
        room,
        addOns,
        status: "incomplete",
      };

      //save current item
      localStorage.setItem("currentItem", JSON.stringify(curentItem));

      console.log(JSON.parse(localStorage?.getItem("currentItem") as string));

      //saving for history
      //   let previousItems =
      let items = JSON.parse(localStorage?.getItem("items") as string)
        ? [...JSON.parse(localStorage?.getItem("items") as string)]
        : [];

      items?.push(JSON.parse(localStorage?.getItem("currentItem") as string));

      //   console.log(JSON.parse(localStorage?.getItem("currentItem") as string));
      localStorage.setItem("items", JSON.stringify(items));

      //map addOns
      let addOnItems = addOns?.map((addOn: { name: string; price: number }) => {
        return {
          price_data: {
            currency: "bdt",
            unit_amount:
              addOn?.price > 0 ? addOn?.price * selectedDates?.length * 100 : 0,
            product_data: {
              name: addOn?.name,
              description: `Add On: ${addOn?.name} (${selectedDates?.length} days)`,
            },
          },
          quantity: 1,
        };
      });

      const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
      const stripe = await loadStripe(STRIPE_PK);

      const body: CheckoutBody = {
        line_items: [
          ...addOnItems,
          {
            price_data: {
              currency: "bdt",
              unit_amount: hotelData?.price
                ? hotelData?.price * selectedDates?.length * 100
                : 0,
              product_data: {
                name: hotelData?.name + " Room",
                description: `Room: ${room} - ${selectedDates?.length} days`,
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

      setSelectedDates([]);
      setRoom("");
      setAddOns([]);
      setName("");
      setLoading(false);
      setOpenModal(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col gap-5 pt-24 pl-24 pr-24 pb-1 w-full">
      <div className="flex justify-center flex-col gap-2">
        <h1 className="text-2xl">{hotelData?.name}</h1>
        <p>
          Price Per Room (1 night):{" "}
          <span className="text-[teal] text-xl">{hotelData?.price} BDT</span>
        </p>
      </div>

      <MyBookingCalendar
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
      />

      <div>
        <label>Available rooms:</label>
        <div className="flex items-center gap-3 w-full">
          {hotelData?.rooms?.map((room: string) => {
            return (
              <div key={room}>
                <label htmlFor={room}>{room}</label>
                <input
                  type="radio"
                  value={room}
                  id={room}
                  name={"room"}
                  onChange={(e) => setRoom(e.target.value)}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <label>Add Ons: </label>
        <div className="flex items-center gap-3 w-full">
          {hotelData?.addOns?.map(
            (addOn: { id: number; name: string; price: number }) => {
              return (
                <div key={addOn?.id}>
                  <label htmlFor={addOn?.name}>
                    {addOn?.name} (Price: {addOn?.price} BDT)
                  </label>
                  <input
                    type="checkbox"
                    value={addOn?.name}
                    id={addOn?.name}
                    name={addOn?.name}
                    onChange={() =>
                      handleAddOns(addOn?.id, addOn?.name, addOn?.price)
                    }
                  />
                </div>
              );
            }
          )}
        </div>
      </div>

      <button
        className="border-2 bg-[teal] p-3 rounded w-[200px] mb-5"
        onClick={() => bookNow()}
        disabled={openModal}
      >
        {openModal ? "Booking..." : "Book Now"}
      </button>

      <dialog
        open={openModal}
        className="p-4 z-10 rounded h-200 top-[30%]"
        style={{ boxShadow: "0px 0px 20px 2220px rgb(1,1,1,0.8)" }}
      >
        <form method="dialog" className="flex justify-center flex-col">
          <input
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            className="p-2 border-2 outline-0 mb-3"
          />
          <div className="flex gap-2 justify-start items-center w-full">
            <button
              className="border-2 bg-[teal] p-2 rounded text-[white] w-[50%]"
              onClick={() => submit()}
              disabled={loading}
            >
              {loading ? "Loading..." : "Checkout"}
            </button>
            <button
              className="border-2 bg-[red] p-2 rounded text-[white] w-[50%]"
              onClick={() => setOpenModal(false)}
              disabled={loading}
            >
              Close
            </button>
          </div>
        </form>
      </dialog>
    </main>
  );
};

export default Page;
