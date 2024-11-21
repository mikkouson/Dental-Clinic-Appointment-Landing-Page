import Image from "next/image";

export default function Header() {
  return (
    <div className="w-full md:h-[calc(100vh-64px)] flex flex-col md:flex-row items-center justify-between p-4 px-6">
      <div id="home" className="w-full md:w-1/2">
        <h1 className="text-4xl font-bold leading-tight mb-4">
          <span>Get Quick</span>
          <br />
          <span className="text-[#efd054]">Medical Services</span>
        </h1>
        <p className="text-gray-700 mb-6">
          From routine checkups to advanced cosmetic treatments, our dedicated team of professionals is here to give you the healthy, radiant smile you deserve. Step into our clinic and experience personalized care tailored to your comfort and needs, all in a welcoming and modern environment.
        </p>
        <a href="/appointment">
          <button className="bg-[#f1d04d] text-white px-6 py-3 rounded-md shadow hover:bg-[#e6c200] transition">
            Book Now
          </button>
        </a>
      </div>

      <div className="relative w-full md:w-1/2 mt-10 md:mt-0 flex justify-center items-center">
        {/* Background Circle with Gradient */}
        <div className="absolute -top-10 -right-10 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#fde896] via-[#ffe69b] to-[#ffe28a] hidden md:block"></div>

        {/* Doctor Image */}
        <div className="relative z-10 hidden md:block">
          <Image
            alt="Doctor"
            src="/images/header-bg.png"
            width={400}
            height={400}
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
}