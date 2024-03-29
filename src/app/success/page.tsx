"use client";

import Link from "next/link";
import { useEffect } from "react";
import { IHotelData } from "../page";

export default function Page() {
  let currentItem =
    typeof window !== undefined &&
    JSON.parse(localStorage?.getItem("currentItem") as string);
  let items =
    typeof window !== undefined &&
    JSON.parse(localStorage?.getItem("items") as string);

  useEffect(() => {
    const modifiedItems = items?.map((item: IHotelData) => {
      if (item?.id === currentItem?.id) {
        return { ...item, status: "complete" };
      }

      return item;
    });

    localStorage?.setItem("items", JSON.stringify(modifiedItems));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center gap-20 p-24">
      <h1 className="text-3xl mt-5">Hotel Room Booking Successful!</h1>
      <Link href={"/"} className="border-b-2">
        Go to home
      </Link>
    </main>
  );
}
