import Image from "next/image";

export default function Header() {
  return (
    <div className="w-full h-[calc(100vh-64px)] flex flex-col md:flex-row items-center justify-between p-4 px-6">
      <div className="w-full md:w-1/2">
        <h1 className="text-4xl font-bold leading-tight mb-4">
          <span>Get Quick</span>
          <br />
          <span className="text-[#efd054]">Medical Services</span>
        </h1>
        <p className="text-gray-700 mb-6">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto,
          minus. Laudantium sunt optio ab libero suscipit totam inventore? Amet
          natus magnam quibusdam libero, esse alias soluta odio molestiae
          blanditiis assumenda!
        </p>
        <button className="bg-[#f1d04d] text-white px-6 py-3 rounded-md shadow hover:bg-[#e6c200] transition">
          Get Services
        </button>
      </div>

      <div className="relative w-full md:w-1/2 mt-10 md:mt-0 flex justify-center">
        {/* Background Circle with Gradient */}
        <div className="absolute -top-10 -right-10 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#fde896] via-[#ffe69b] to-[#ffe28a]"></div>

        {/* Doctor Image */}
        <div className="relative z-10">
          <Image
            alt="Doctor"
            src="/images/header-bg.png"
            width={400}
            height={400}
            className="rounded-full"
          />
        </div>

        {/* Active Clients Badge */}
        <div className="absolute top-5 -left-20 flex items-center gap-3 p-3 bg-white rounded-md shadow-md z-20">
          <div className="bg-gray-100 p-2 rounded-full">
            <i className="ri-user-3-line text-[#ffd700] text-lg"></i>
          </div>
          <div>
            <h4 className="text-lg font-bold">1520+</h4>
            <p className="text-gray-500">Active Clients</p>
          </div>
        </div>

        {/* Offer and Expert Badge */}
        <div className="absolute bottom-5 -right-16 bg-white p-4 rounded-md shadow-md z-20">
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-gray-700">
              <i className="ri-check-line text-[#ffd700]"></i>
              Get 20% off on every 1st month
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <i className="ri-check-line text-[#ffd700]"></i>
              Expert Doctors
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
