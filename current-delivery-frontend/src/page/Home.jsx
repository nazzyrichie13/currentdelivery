import { Link } from "react-router-dom";
import Slider from "../component/Slider";
import ship from "../assets/ship.jpg";

import ChatBox from "../component/ChatBox";
import chatBg from '../assets/road.jpg';
import TrackShipment from "./TrackShipment";
import image1 from "../assets/logistic.jpg";
import shipdelivery from "../assets/shipppp.png";
import planedelivery from "../assets/planedelivery.png";
import alldelivery from "../assets/vehiclecurrent.png";
import driver from "../assets/driver.jpg";
import photo3 from '../assets/photo3.jpg';

import { Contact2, LocationEditIcon, BoxIcon } from "lucide-react";
import { ArrowRightIcon } from "lucide-react";
import CustomerReviews from "../component/Ratings";
import LanguageSwitcher from "../component/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="p-2 overflow-hidden   md:p-0">
      <LanguageSwitcher />
      <div
        className="w-full h-dvh bg-cover bg-center"
        style={{ backgroundImage: `url(${chatBg})` }}
      >
        <TrackShipment />
        <div className="flex flex-col gap-3 p-3">
          <h2 className="text-blue-600 font-extrabold w-72 text-4xl">
            {t("home.hero_title")}
          </h2>
          <p className=" text-blue-600 w-60">
            {t("home.hero_desc")}
          </p>
          <Link
            to={'/register'}
            className="bg-blue-600 text-white p-2 rounded-b-sm  rounded-e-xs font-extrabold w-44 text-center"
          >
            {t("home.signup")}
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-start gap-6 p-4 md:p-20">
        <h2 className="text-blue-950 font-extrabold text-3xl sm:text-4xl md:text-5xl w-full md:max-w-4xl">
          {t("home.trust_title")}
        </h2>

        <h3 className="text-blue-950 font-extrabold text-2xl sm:text-3xl w-full md:max-w-3xl">
          {t("home.trust_subtitle")}
        </h3>

        <div className="flex flex-col gap-4 w-full md:max-w-3xl">
          <h4 className="text-blue-950 font-bold text-xl sm:text-2xl">
            {t("home.reliable_title")}
          </h4>
          <p className="text-blue-950 font-medium text-lg sm:text-xl">
            {t("home.reliable_desc")}
          </p>

          <h4 className="text-blue-950 font-bold text-xl sm:text-2xl">
            {t("home.tracking_title")}
          </h4>
          <p className="text-blue-950 font-medium text-lg sm:text-xl">
            {t("home.tracking_desc")}
          </p>

          <h4 className="text-blue-950 font-bold text-xl sm:text-2xl">
            {t("home.secure_title")}
          </h4>
          <p className="text-blue-950 font-medium text-lg sm:text-xl">
            {t("home.secure_desc")}
          </p>

          <h4 className="text-blue-950 font-bold text-xl sm:text-2xl">
            {t("home.international_title")}
          </h4>
          <p className="text-blue-950 font-medium text-lg sm:text-xl">
            {t("home.international_desc")}
          </p>

          <h4 className="text-blue-950 font-bold text-xl sm:text-2xl">
            {t("home.pricing_title")}
          </h4>
          <p className="text-blue-950 font-medium text-lg sm:text-xl">
            {t("home.pricing_desc")}
          </p>

          <h4 className="text-blue-950 font-bold text-xl sm:text-2xl">
            {t("home.support_title")}
          </h4>
          <p className="text-blue-950 font-medium text-lg sm:text-xl">
            {t("home.support_desc")}
          </p>

          <h4 className="text-blue-950 font-bold text-xl sm:text-2xl">
            {t("home.trusted_title")}
          </h4>
          <p className="text-blue-950 font-medium text-lg sm:text-xl">
            {t("home.trusted_desc")}
          </p>
        </div>

        <Link
          to="/register"
          className="bg-blue-600 text-white p-3 rounded-md font-extrabold w-full sm:w-44 text-center mt-4"
        >
          {t("home.signup")}
        </Link>

        <img src={image1} alt="image" className="w-full max-w-lg h-auto mt-6" />
      </div>

      <Slider />

      <div className=" bg-blue-700 text-white p-8 flex flex-col gap-10 ">
        <h2 className="text-white  font-extrabold w-72  md:w-dvh text-4xl">
          {t("home.how_title")}
        </h2>

        <p className=" underline font-semibold">
          {t("home.how_subtitle")}
        </p>

        <div className="flex gap-5 items-center">
          <Contact2 />
          <div>
            <p className="text-2xl font-extrabold">{t("home.step1")}</p>
            <p>{t("home.step1_desc")}</p>
          </div>
        </div>

        <div className="flex gap-5 items-center ">
          <LocationEditIcon />
          <div>
            <p className="text-2xl font-extrabold">{t("home.step2")}</p>
            <p>{t("home.step2_desc")}</p>
          </div>
        </div>

        <div className="flex gap-5 items-center ">
          <BoxIcon />
          <div>
            <p className="text-2xl font-extrabold">{t("home.step3")}</p>
            <p>{t("home.step3_desc")}</p>
          </div>
        </div>

        <Link
          to={'/register'}
          className="bg-white text-blue-600 p-2 rounded-b-sm  rounded-e-xs font-extrabold w-44 text-center"
        >
          {t("home.signup")}
        </Link>

        <img src={ship} alt="img" className="w-dvh mix-blend-multiply z-auto" />
      </div>

      <div className="bg-blue-950">
        <h2 className="flex justify-center text-3xl font-bold text-white p-6 ">
          {t("home.core_services")}
        </h2>

        <div className="lg:flex col p-10 gap-10 overflow-x-scroll overscroll-x-scontain md:flex-row">
          <div className="relative">
            <img src={planedelivery} alt="img" className="w-90 h-96" />
            <div className="flex gap-3 absolute z-50 bottom-5 text-2xl text-white font-bold items-center p-4">
              <Link to={'/air-freight'}>{t("home.air_freight")}</Link>
              <ArrowRightIcon />
            </div>
          </div>

          <div className="relative">
            <img src={shipdelivery} alt="img" className="w-90 h-96" />
            <div className="flex gap-3 absolute z-50 bottom-5 text-2xl text-white font-bold items-center p-4">
              <Link to={'/sea-freight'}>{t("home.sea_freight")}</Link>
              <ArrowRightIcon />
            </div>
          </div>

          <div className="relative">
            <img src={alldelivery} alt="img" className="w-90 h-96" />
            <div className="flex gap-3 absolute z-50 bottom-5 text-2xl text-white font-bold items-center p-4">
              <Link to={'/vehicle-delivery'}>
                {t("home.vehicle_delivery")}
              </Link>
              <ArrowRightIcon />
            </div>
          </div>

          <div className="relative">
            <img src={driver} alt="img" className="w-90 h-96" />
            <div className="flex gap-3 absolute z-50 bottom-5 text-2xl text-white font-bold items-center p-4">
              <Link to={'/home-delivery'}>
                {t("home.home_delivery")}
              </Link>
              <ArrowRightIcon />
            </div>
          </div>
        </div>
      </div>

      <CustomerReviews />

      <div className="flex flex-col items-center p-10 gap-10">
        <img src={photo3} alt="photo" />
        <p className="font-semibold  w-60  md:w-96 text-2xl">
          {t("home.cta_text")}
        </p>
        <Link
          to={'/register'}
          className="bg-blue-600 text-white p-2 rounded-b-sm  rounded-e-xs font-extrabold w-44 text-center"
        >
          {t("home.signup")}
        </Link>
      </div>

      <ChatBox />
    </div>
  );
}
