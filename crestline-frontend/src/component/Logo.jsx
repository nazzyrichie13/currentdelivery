// CurrentDeliveryLogo.jsx
import mylogo from "../assets/file_00000000db8881f4a74e61694fc2ef34.png";
export default function Logo() {
  return (
    <>
    <div className=" bg-amber-500  w-15 h-15 rounded-full flex border-b-blue-700">
        <img src={mylogo} alt="logo" className='bg-amber-500 w-12 h-12 rounded-full border border-b-blue-600'  />
       <div>
        <p className='font-extrabold text-blue-700'>Crestline</p>
       <p className='text-yellow-400 font-bold'>Express</p>

       </div>
        
    </div>
    </>
  );
}
