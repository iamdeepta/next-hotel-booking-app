"use client";

import HotelCard from "@/components/HotelCard";
import { IHotelData } from "../page";

const Page = () => {
  const itemsArray =
    typeof window !== "undefined" &&
    JSON.parse(localStorage?.getItem("items") as string);

  const items =
    itemsArray?.length > 0 &&
    itemsArray?.filter(
      (itm: IHotelData) =>
        itm?.name?.toLowerCase()?.trim() ===
        itemsArray[0]?.name?.toLowerCase()?.trim()
    );

  return (
    <main className="flex min-h-screen flex-col items-center gap-20 p-24">
      <h1 className="text-2xl">Booking History</h1>

      {typeof window !== "undefined" &&
      JSON.parse(localStorage?.getItem("items") as string) &&
      JSON.parse(localStorage?.getItem("items") as string).length > 0 ? (
        <div className="flex justify-start gap-4 flex-wrap">
          {items?.map((item: IHotelData) => {
            return (
              <HotelCard hotelData={item} isHistory={true} key={item?.id} />
            );
          })}
        </div>
      ) : (
        <p>Not available</p>
      )}
    </main>
  );
};

export default Page;
