import logo from "../assets/logo.png"
export const Navbar = () => (
    <nav className="bg-gray-800 text-white border-b-[0.5px] border-green-400">
      <div className="max-w-6xl mx-auto ">
        <div className="flex justify-center items-center gap-[90px] lg:flex lg:justify-between lg:gap-x-[140px]">
          <div>
            <div className="flex justify-between items-center ">
            <img className="w-[68px] h-[68px]" src={logo} alt="" />
           <p className="capitalize font-bold text-[20px] ">
  <span className="text-green-400">t</span>rade pro
</p>

            </div>
            </div>
          <div className="space-x-4">
            <a href="#" className="hover:text-blue-200 "></a>
          </div>
        </div>
      </div>
    </nav>
  );