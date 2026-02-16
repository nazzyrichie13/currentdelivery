import { Link } from "react-router-dom";
import Slider from "../component/Slider"
import ship from "../assets/ship.jpg"


import ChatBox from "../component/ChatBox"
import chatBg from '../assets/road.jpg';
import TrackShipment from "./TrackShipment";
import image1 from "../assets/logistic.jpg";
import shipdelivery from "../assets/shipppp.png";
import planedelivery from "../assets/planedelivery.png";
import alldelivery from "../assets/vehiclecurrent.png";
import driver from "../assets/driver.jpg";
import photo3 from '../assets/photo3.jpg'

import { Contact2,LocationEditIcon,BoxIcon } from "lucide-react";
import { ArrowRightIcon } from "lucide-react";
import CustomerReviews from "../component/Ratings";
import LanguageSwitcher from "../component/LanguageSwitcher";
import { useTranslation } from 'react-i18next';

export default function Home (){
const { t } = useTranslation();


return(
    <div className="p-2 overflow-hidden   md:p-0">
      <LanguageSwitcher />
  <div
  className="w-full h-dvh bg-cover bg-center"
  style={{ backgroundImage: `url(${chatBg})` }}

>
    <TrackShipment/>
    <div className="flex flex-col gap-3 p-3">
        <h2 className="text-blue-600 font-extrabold w-72 text-4xl">
           {t('We ship from the USA to countries worldwide, and from other countries to the USA.')}
        </h2>
        <p className=" text-blue-600 w-60">{t('Reliable and Affordable Shipping Services To Give You the Peace  Of mind You Deserve')}</p>
        <Link to={'/register'} className="bg-blue-600 text-white p-2 rounded-b-sm  rounded-e-xs font-extrabold w-44 text-center">Sign Up Today</Link>
    </div>


    
    </div>
    <div className="flex flex-col items-start gap-6 p-4 md:p-20">
  <h2 className="text-blue-950 font-extrabold text-3xl sm:text-4xl md:text-5xl w-full md:max-w-4xl">
    {t('You Deserve A Shipping Provider You Can Trust')}
  </h2>

  <h3 className="text-blue-950 font-extrabold text-2xl sm:text-3xl w-full md:max-w-3xl">
    {t('Reasons to Trust Our Delivery Service')}
  </h3>

  <div className="flex flex-col gap-4 w-full md:max-w-3xl">
    <h4 className="text-blue-950 font-bold text-xl sm:text-2xl">{t('Reliable & On-Time Delivery')}</h4>
    <p className="text-blue-950 font-medium text-lg sm:text-xl">
      {t('We prioritize speed and accuracy to ensure your packages arrive safely and on schedule.')}
    </p>

    <h4 className="text-blue-950 font-bold text-xl sm:text-2xl">{t('Real-Time Shipment Tracking')}</h4>
    <p className="text-blue-950 font-medium text-lg sm:text-xl">
     {t(' Track your delivery at every stage, from pickup to final destination.')}
    </p>

    <h4 className="text-blue-950 font-bold text-xl sm:text-2xl">{t('Secure Package Handling')}</h4>
    <p className="text-blue-950 font-medium text-lg sm:text-xl">
      {t('Your items are handled with care and protected throughout the delivery process.')}
    </p>

    <h4 className="text-blue-950 font-bold text-xl sm:text-2xl">{t('International Shipping Expertise')}</h4>
    <p className="text-blue-950 font-medium text-lg sm:text-xl">
      {t('We ship from the USA to countries worldwide and from other countries to the USA with full compliance.')}
    </p>

    <h4 className="text-blue-950 font-bold text-xl sm:text-2xl">{t('Transparent Pricing')}</h4>
    <p className="text-blue-950 font-medium text-lg sm:text-xl">
    {t('  No hidden fees—clear and honest shipping costs you can trust.')}
    </p>

    <h4 className="text-blue-950 font-bold text-xl sm:text-2xl">{t('Dedicated Customer Support')}</h4>
    <p className="text-blue-950 font-medium text-lg sm:text-xl">
     {t(' Our support team is always available to assist you before, during, and after delivery.')}
    </p>

    <h4 className="text-blue-950 font-bold text-xl sm:text-2xl">{t('Trusted by Many Customers')}</h4>
    <p className="text-blue-950 font-medium text-lg sm:text-xl">
     {t(' Our growing customer base is built on consistency, professionalism, and satisfaction.')}
    </p>
  </div>

  <Link
    to="/register"
    className="bg-blue-600 text-white p-3 rounded-md font-extrabold w-full sm:w-44 text-center mt-4"
  >
   {t( ' Sign Up Today')}
  </Link>

  <img src={image1} alt="image" className="w-full max-w-lg h-auto mt-6" />
</div>

    
    <Slider/>
    <div className=" bg-blue-700 text-white p-8 flex flex-col gap-10 ">
        <h2 className="text-white  font-extrabold w-72  md:w-dvh text-4xl">{t('Shipping To & From Any Country  Should Be More Reliable')}</h2>

        <p className=" underline font-semibold">{t('How Does It Work?')}</p>
        <div className="flex gap-5 items-center">
            <Contact2/>
            <div>
                <p className="text-2xl font-extrabold">{t('Step 1.')}</p>
            <p>{t(`sign up today! it's simple`)}</p>

            </div>
        </div>
        <div className="flex gap-5 items-center ">
            <LocationEditIcon/>
            <div>
                <p className="text-2xl font-extrabold">{t('Step 2.')}</p>
            <p>{t('Get A Free U.S. Address')}</p>

            </div>
        </div>
        <div className="flex gap-5 items-center ">
            <BoxIcon/>
            <div>
                <p className="text-2xl font-extrabold">{t('Step 3.')}</p>
            <p>{t('Ship To & From WorldWide With Confidence<')}</p>

            </div>
        </div>
        <Link to={'/register'} className="bg-white text-blue-600 p-2 rounded-b-sm  rounded-e-xs font-extrabold w-44 text-center">{t('Sign Up Today')}</Link>
        <img src={ship} alt="img" className="w-dvh mix-blend-multiply z-auto"/>
    </div>
    <div  className="bg-blue-950">
   <h2 className="flex justify-center text-3xl font-bold text-white p-6 ">{t('Core Services')}</h2>
   <div className="lg:flex col p-10 gap-10 overflow-x-scroll overscroll-x-scontain md:flex-row  ">
    <div className="relative  ">
    <img  src={planedelivery} alt="img" className="w-90 h-96"/>
    <div className="flex gap-3 absolute z-50 bottom-5 text-2xl text-white font-bold items-center p-4">
         <Link to={'/air-freight'} className="hover:text-blue-600 cursor-pointer"> {t('Air Freight')}</Link>
        <ArrowRightIcon/>
    </div>
   </div>
    <div className="relative ">
    <img  src={shipdelivery} alt="img" className="w-90 h-96"/>
    <div className="flex gap-3 absolute z-50 bottom-5 text-2xl text-white font-bold items-center p-4">
         <Link to={'/sea-freight'} className="hover:text-blue-600 cursor-pointer">{t('Sea Freight')}</Link>
        <ArrowRightIcon/>
    </div>
   </div>
   <div className="relative ">
    <img  src={alldelivery} alt="img" className="w-90 h-96"/>
    <div className="flex gap-3 absolute z-50 bottom-5 text-2xl text-white font-bold items-center p-4">
        <Link to={'/vehicle-delivery'} className="hover:text-blue-600 cursor-pointer">{t(' VehicleDelivery')}</Link>
        <ArrowRightIcon/>
    </div>
   </div>
   <div className="relative ">
    <img  src={driver} alt="img" className="w-90 h-96"/>
    <div className="flex gap-3 absolute z-50 bottom-5 text-2xl text-white font-bold items-center p-4">
    <Link to={'/home-delivery'} className="hover:text-blue-600 cursor-pointer">{t('Home Delivery')} </Link>
        <ArrowRightIcon/>
    </div>
   </div>
   </div>

    </div>
    <CustomerReviews />
    <div className="flex flex-col items-center p-10 gap-10">
        <img src={photo3} alt="photo"/>
        <p className="font-semibold  w-60  md:w-96 text-2xl">{t('Ship, Send, & Receive With Confidence')}</p>
          <Link to={'/register'} className="bg-blue-600 text-white p-2 rounded-b-sm  rounded-e-xs font-extrabold w-44 text-center">{t('Sign Up Today')}</Link>
            
        
 
    </div>
    <ChatBox/>
    
    </div>
)



}