import { Link } from "react-router-dom";
import Logo from "./Logo";
// Correct
import { Facebook, Twitter, Instagram ,Linkedin, ArrowUp, ArrowDown} from "lucide-react";



function Footer (){
   const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // makes it animated
    });
  };

return(
    <>
    <div className=" sm:w-auto flex flex-col bg-gray-600 text-white md:flex-col  p-5  gap-10 font-stretch-50% ">
        <div className="flex flex-col gap-3">
           <div>
          <h2 className="text-2xl font-bold"><Logo/></h2>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white">Secure courier made simple. Manage your goods, send, and
            recieve with confidence.</li>
            <li className="hover:text-white">Trusted.</li>
            <li className="hover:text-white">Innovative.</li>
            <li className="hover:text-white">Global.</li>


          </ul>
        </div> 
                
                <span
      onClick={handleScrollTop}
      className="cursor-pointer bg-blue-600 text-white  rounded-full   w-12 h-12 flex justify-center items-center"
    >
       <ArrowUp/>
    </span>
        </div>
        <div className="sm:flex  md:flex-col gap-5">
            <h2 className="bg-blue-600 w-12 h-12 rounded-full p-2 text-center text-white"><ArrowDown/></h2>
        <Link to="/" className="font-bold underline">Homepage</Link>
        <h3 className="font-bold underline">Contact Us</h3>
        <p className="hover:text-white">+1 (800) 123-4567/00000325645</p>
        <p className="hover:text-white">support@currentdelivery.com</p>
        <h3 className="font-bold underline">Address</h3>
        <p className="hover:text-white">121 Main Street louisville, KY,USA.</p>
        <Link to="/about" className="font-bold underline">Know About us!!</Link>
        <p className="hover:text-blue-700 font-bold underline">security and privacy</p>


        </div>

         <div>
          <h3 className="sm:text-4 md:text-lg font-semibold mb-3">Follow Us</h3>
          <div className="sm:w-auto flex  md:flex-row space-x-4 text-2xl">
            <Link  className="hover:text-blue-300"><Facebook /></Link>
            <Link className="hover:text-blue-300"><Twitter /></Link>
            <Link className="hover:text-blue-300"><Linkedin /></Link>
            <Link className="hover:text-blue-300"><Instagram /></Link>
          </div>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/login" className="hover:text-white">Login</Link></li>
            <li><Link to="/signup" className="hover:text-white">Register</Link></li>
            <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link to="/blog" className="hover:text-white">BLOG</Link></li>
            

          </ul>
        </div>
      

    </div>
    <div className="bg-gray-900 text-center font-semibold  md:font-bold text-white" >
        <p>&copy;{new Date().getFullYear()} currentdelivery International.All rights reserved</p>
    </div>

    </>
)


}


export default Footer;