import HotelCard from "@/components/HotelCard";
import Link from "next/link";
import HotelData from "../data/hotels.json";

export interface IHotelData {
  id: number;
  name?: string;
  hotelName?: string;
  price?: number;
  room?: string;
  status?: string;
  selectedDates?: string[];
  rooms?: string[];
  addOns?: {
    id: number;
    name: string;
    price: number;
  }[];
}

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-20 p-24">
      <h1 className="text-2xl">Hotel Booking App</h1>
      <Link href={"/history"} className="border-b-2">
        Booking History
      </Link>

      <div className="flex justify-start gap-4 flex-wrap">
        {HotelData?.map((item: IHotelData) => {
          return <HotelCard hotelData={item} key={item?.id} />;
        })}
      </div>
    </main>
  );
}
