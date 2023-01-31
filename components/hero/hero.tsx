import { Accent } from "components/accent";
import { Year } from "components/year";

export const Hero = () => (
  <div className="max-w-4xl lg:max-w-6xl mx-auto mb-16 w-full relative">
    <div className="z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <h1 className="text-[16vw] lg:text-[12rem] mb-4">
        <span className="font-black">Euro</span>Python
      </h1>
    </div>

    <div className="w-[80%] mx-auto">
      <Year />

      <h2 className="font-black text-xl absolute -bottom-12">
        <div>17-23 July</div>

        {/* <div>Dublin Ireland & Remote</div> */}
      </h2>
    </div>

    {/* <Accent className="absolute -bottom-16 md:bottom-auto md:top-0 right-8 w-28" /> */}
  </div>
);
