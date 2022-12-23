import { Accent } from "components/accent";
import { Year } from "components/year";

export const Hero = () => (
  <div className="relative aspect-hero justify-center flex items-center max-w-4xl lg:max-w-6xl mx-auto mb-16">
    <div className="absolute scale-125 md:scale-100 z-0">
      <Year className="w-full" />
    </div>

    <Accent className="absolute -bottom-16 md:bottom-auto md:top-0 right-8 w-28" />

    <div className="relative z-10">
      <h1 className="text-[16vw] lg:text-[12rem] mb-4">
        <span className="font-black">Euro</span>Python
      </h1>
      <h2 className="font-black text-xl">
        <div>11-17 July</div>
        <div>Dublin Ireland & Remote</div>
      </h2>
    </div>
  </div>
);
