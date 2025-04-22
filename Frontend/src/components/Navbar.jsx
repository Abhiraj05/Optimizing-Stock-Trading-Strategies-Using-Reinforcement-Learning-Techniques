import logo from "../assets/logo.png"
export const Navbar = () => (
    <nav className="bg-gray-800 text-white border-b-2 border-green-400">
      <div className="max-w-6xl mx-auto ">
        <div className="flex justify-center items-center gap-48 lg:flex lg:justify-between lg:gap-x-96">
          <div>
          <img className="w-[68px] h-[68px]" src={logo} alt="" />
            </div>
          <div className="space-x-4">
            <a href="#" className="hover:text-blue-200 ">About</a>
          </div>
        </div>
      </div>
    </nav>
  );