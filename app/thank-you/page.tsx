import Image from "next/image";

const ThankYouPage = () => {
  return (
    <main className="relative lg:min-h-full">
      <div className="h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <Image
          src={"/checkout-thank-you.jpg"}
          fill
          alt="thank you for your order"
          className="h-full w-full object-cover object-center"
        />
      </div>
    </main>
  );
};

export default ThankYouPage;
