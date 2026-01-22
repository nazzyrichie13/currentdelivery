// CurrentDeliveryLogo.jsx
import mylogo from '../assets/—Pngtree—illustration of a vector icon_12646880.jpg'
export default function Logo() {
  return (
    <>
    <div className=" bg-amber-500  w-15 h-15 rounded-full flex border-b-blue-700">
        <img src={mylogo} alt="logo" className='bg-amber-500 w-12 h-12 rounded-full border border-b-blue-600'  />
       <div>
        <p className='font-extrabold text-blue-700'>Current</p>
       <p className='text-yellow-400 font-bold'>Delivery</p>

       </div>
        
    </div>
    </>
  );
}
