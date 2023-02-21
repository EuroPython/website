import { Accent } from "components/accent";
import { Year } from "components/year";
import Link from "next/link";

export const Hero = () => (
  <div className="max-w-4xl lg:max-w-6xl mx-auto mb-16 w-full relative">
    <div className="z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <h1 className="text-[16vw] lg:text-[12rem]">
        <span className="font-black">Euro</span>Python
      </h1>

      <h2 className="font-black text-xl md:text-3xl lg:text-5xl flex md:space-x-8 justify-between">
        <div>17-23 July</div>

        <div className="md:flex-1">Prague, Czech Republic & Remote</div>
      </h2>
    </div>

    <div className="w-full mx-auto">
      <Year className="opacity-60" />
    </div>

    {/* <Accent className="absolute -bottom-16 md:bottom-auto md:top-0 right-8 w-28" /> */}
  </div>
);
