import { IHotelData } from "@/app/page";
import Link from "next/link";

const HotelCard = ({
  hotelData,
  isHistory = false,
}: {
  hotelData: IHotelData;
  isHistory?: boolean;
}) => {
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
                hotelData?.selectedDates[1]?.slice(0, 10)}
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
              <button className="bg-[teal] p-1 rounded border-2 mt-3">
                Book Now
              </button>
            ) : (
              <button className="bg-[red] p-1 rounded border-2 mt-3">
                Book Again
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
