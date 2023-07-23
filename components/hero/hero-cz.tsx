import { Accent } from "components/accent";
import { Title } from "components/typography/title";
import Link from "next/link";

const HeroMain = ({ className }: { className: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 2000 1000"
      className={className}
    >
      <path
        fill="#000"
        fill-rule="evenodd"
        d="M517 203h3l55 33-57 33-58-33zm-58 35-1 1v62H348l-1 1h-1l58 34 56-33 56-33zm-115 65-54 31a3 3 0 0 0 0 5l54 32 58-34zm2 69 55 32 57-33-54-33zm57 33h113l-56-33zm116 1 51 30 58-34-53-31zm53 31 58 33h3l57-32-60-35zm120-1 54-31a3 3 0 0 0 0-5l-54-32-60 34zm-2-69-56-32v-64l-55 32 54 31 1 1-1 1-56 34 53 31zm-57-98-56-32-57 33 57 32zm620 33h3l56 32-60 35-55 32-57-34h104l-47-28a3 3 0 0 1 0-5zm-115 66-55 32 59 33 53-31zm-57 33-54 31a3 3 0 0 0 0 6l54 31 59-35zm2 69 55 32 59-35-55-31zm57 33 54 31 60-35-55-31zm56 32 55 32 61-35-56-32zm57 33 57 33h3l57-32a3 3 0 0 0 0-6l-47-27h102l-59-34zm174-33 55-31-60-35-54 32zm57-33 56-32a3 3 0 0 0 0-5l-56-32-60 35zm-2-70-55-32-60 35 55 32zm-57-33-54-31-60 35 54 31zm-56-32-55-32-60 35 55 31zM176 400l-56 32 57 34 56-32zm-58 34-54 31 57 34 54-32zm-56 32L6 498a3 3 0 0 0 0 5l54 31 59-34Zm0 69 56 32 58-34-55-32zm58 34 54 31 58-34-54-31zm56 32 55 32 57-34-54-32zm57 33 57 33h3l56-33-59-34zm118-1 55-32a3 3 0 0 0 0-5l-55-32-59 35zm-2-70-52-30 53-30-58-34-55 32 54 31a1 1 0 0 1 0 2l-55 32 54 32zm2-62v-67l-57 33zm-1-68v-1l-56-32-57 34 55 32zm-58-34H178l57 34zm621 99h116l-58 34-58-34zm-2 1-54 31 57 35 55-32zm-56 33-55 31 60 34 52-31zm-56 33v68l59-35zm1 69 54 31h1l60-35-55-31zm56 33 55 31 59-37h1l58 36 56-34-4-2H972l-54-31v-61h109l55 31v59l4 3 53-31-56-31-1-1 1-1 60-35-55-32-60 36h-1l-56-33-109 64 55 32a1 1 0 0 1 0 1zm230-137-55-31-58 34 54 32zm59 34-60 35 56 31 58-34zm56 33-58 34 58 33v-67zm-1 69-59-34-53 31 57 36 55-32v-1zm-57 34-57-35-56 33 57 34zm-59 33-56-34-56 34zm-115-1 58-34-57-35-57 36Zm738-169h3l55 32-59 35-57-33zm-60 35-53 31 57 33 53-31zm-55 32-55 32 58 33 54-32zm-57 33-55 31a3 3 0 0 0 0 5l54 32 59-34-58-34zm1 69 58 33h3l52-30v60l56-33-53-31-57-33zm113 65 1 1 55 31 57-34-55-32zm58 33 57 33h3l56-32-59-34zm118-1 54-31-59-34-54 31zm56-32 55-32-60-34-54 31zm57-33 55-32a3 3 0 0 0 0-5l-56-32-59 34zm-3-71-55-31h-3l-52 30v-61l-1-1-58 35 54 31 56 32zm-112-64-56-33-59 35 56 32zM630 662l1-1h113l-57 34-57-33zm-2 1-54 31 58 33 53-31zm-56 32-55 32-1 1 58 33 56-33zm-57 35v65l57-33Zm1 67 1 1 54 31 58-34-55-32zm57 33 55 32 57-34-54-31zm57 33 55 32 58-34-56-32zm57 33h116l-58-34zm118-1 54-32-57-34-55 32zm56-33 55-31-58-35-54 32zm57-33v-68l-58 34zm-2-69-56-33h-3l-57 33 58 34zm-118 1-53 31-51-30 53-30-60-35-53 31 57 33v1l-58 33 54 31 56-34h1l58 35 54-32zm-49-30 54-32a3 3 0 0 0 0-5l-56-32-58 34 59 35h1zm618 29 1-1h114l-59 35-57-34zm-3 1-53 31 58 33 52-30zm-55 32-55 32 58 34 55-32zm-57 33v68l58-34zm1 70 56 32 59-34-56-33zm58 33 53 31 58-34-52-31zm55 32 56 32 57-33-55-33zm58 33h114l-57-33zm116 0 55-32-56-34-56 32zm57-33 56-32v-1l-58-33-55 31zm58-34v-67l-58 34zm-2-69-56-33h-3l-58 34 59 33zm-119 2-52 30-51-29 51-30-59-35-52 31 58 33a1 1 0 0 1 0 1l-57 33 52 31 57-34h1l57 34 54-31zm-50-30 56-32a3 3 0 0 0 0-5l-56-33-59 35zM462 304l56-33 57 32-57 33zm58 33 57-33 54 31-56 34zm-2 1 55 32-55 34-56-33zm-2-1-56 33-54-33 54-32zm683 65 53-31 55 32-53 31zm57 33 53-31 55 31-54 32zm56 33 53-32 56 32-55 32zm-2 1 54 32-50 29-56-31zm-2-1-52 30-55-31 53-31zm-56-33-53 31-55-32 53-31zM179 467l56-32 55 32-55 33zm-2 1 56 33-55 31-55-32zm57 97-54-32 55-31 53 31zm1419 98 53-31 56 33-53 31zm58 34 53-31 53 31-54 31zm54 32 54-31 55 31-54 32zm-2 1 55 32-54 32-55-32zm-2-1-54 32-52-31 54-32zm-54-32-54 32-56-32 54-32zM576 762l56-33 56 32-57 33zm169 98-56-32 55-34 56 34zm569 0 55-32 57 33-56 32zm167 99-55-33 56-33 55 33z"
        clip-rule="evenodd"
      />
      <path
        fill="#000"
        stroke="#000"
        stroke-linejoin="round"
        stroke-miterlimit="10"
        stroke-width="6"
        d="M292 139v66l56 33v65l57 33V205zm906 0v33h57zm-680 66v131l114 65V270zm510 33v65l170 98v66l114 65V401ZM8 303v131l284 164V467Zm1020 66v98h57v-66zm-226 65v131l56-33 57 33v65l57 33V532Zm680 66v65l57 33v65l56-33v-65zm-964 98v131l170 98V696zm1134 0v131l113 65V663zm-397 98v131l170 98V794Z"
      />
      <path
        fill="#39f4c5"
        stroke="#000"
        stroke-linejoin="round"
        stroke-miterlimit="10"
        stroke-width="6"
        d="M405 205v131h113V205zm907 131 57 33v98h56V336Zm-397 33v65l57 33h56v-98Zm57 163v131h113V532ZM688 696v131h114V696zm737 98v131h114V794Z"
      />
      <path
        fill="#fff"
        stroke="#000"
        stroke-linejoin="round"
        stroke-miterlimit="10"
        stroke-width="6"
        d="m745 205-113 65v131l113-65zm794 65-114 66v131l114-66zM348 303l-56 33 56 33zm1021 66-57 32v131l57-32zm-964 32-113 66v131l113-66zm793 66-113 65v131l113-65zm-396 33-114 65 57 33 57-33zm850 32-57 33v65l57 33zm340 0-227 131v131l227-131zm-453 66-114 65 57 33 57-33zm-624 32-113 66v131l113-66zm737 99-113 65v131l113-65z"
      />
      <path
        fill="#ff00e5"
        d="m518 9-56 32v66H348l-56 32 113 66h113l114 65 113-65-113-66V74Zm737 98-57 32 57 33h-113l-114 66 284 163 57-32-57-33h113l114-66zM178 205 8 303l284 164 113-66-113-65 56-33v-65l-56-33zm737 98-113 66v65l170 98h113l113-65v-66l-170-98zm0 66h113l57 32v66H972l-57-33zm794 0-227 131 113 65 57-33v66l113 65 227-131-113-65-57 33v-66ZM632 467l-114 65v66l170 98h114l113-66v-65l-57-33-113 66-57-33 114-65-57-33Zm737 98-114 65v66l170 98h114l113-65v-66l-57-33-113 66-57-33 114-65-57-33z"
      />
      <path
        stroke="#0007ad"
        stroke-linejoin="round"
        stroke-width="2"
        d="m64 270 283 164M120 238l170 98-113 65m0-196 170 98M64 336l226-131M120 369l227-131M234 434l113-65m0-197L574 41M404 205 631 74m-57 164 113-66m0 66L460 107m0-66 171 98-114 66-170-98m170 491 227-131M574 630l113-65-113-65m57 163 113-65 113 65m-170 33 227-131m-397-33 284 164M631 467l113 65m57 33 113 65M801 434l226-131M857 467l57-33-113-65m283-33-57 33-113-66m227 66-57 32 113 66m-283 33 57-33 113 65m-113 0 226-131m-113 66 57 33M857 336l57 33m170-99 227-131m56 33-226 131m56 33 227-131m57 33-227 131m-170-164 227 131m-170-164 283 164m-170-164 227 131m-227 393 227-131m-170 164 113-66-113-65m56 163 114-65 113 65m-170 33 227-131m-397-33 283 164m-170-229 114 65m56 33 114 66m0-197 170-98m0 66-170 98m56 32 227-130m-397 32 227-131m-113 0 283 164m-340-131 284 164m-341-131 284 163"
      />
      <path
        stroke="#000"
        stroke-linejoin="round"
        stroke-miterlimit="10"
        stroke-width="6"
        d="m518 9-56 32v66H348l-56 32 113 66h113l114 65 113-65-113-66V74Zm737 98-57 32 57 33h-113l-114 66 284 163 57-32-57-33h113l114-66zM178 205 8 303l284 164 113-66-113-65 56-33v-65l-56-33zm737 98-113 66v65l170 98h113l113-65v-66l-170-98zm0 66h113l57 32v66H972l-57-33zm794 0-227 131 113 65 57-33v66l113 65 227-131-113-65-57 33v-66ZM632 467l-114 65v66l170 98h114l113-66v-65l-57-33-113 66-57-33 114-65-57-33Zm737 98-114 65v66l170 98h114l113-65v-66l-57-33-113 66-57-33 114-65-57-33z"
      />
    </svg>
  );
};

export const HeroCZ = () => (
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 z-10 w-full h-screen"
    >
      <style>
        {`.a,
        .b,
        .c {
            transform-box: fill-box;
            transform-origin: center;
        }

        .a { transform: matrix(12,-5,5,12,940,690); }
        .b { transform: matrix(11,5,-5,11,350,370); }
        .c { transform: matrix(12,-4.5,4.5,12,560,360); }`}
      </style>
      <defs>
        <filter
          id="blur"
          x="0"
          y="0"
          width="100%"
          height="100%"
          filterUnits="userSpaceOnUse"
          primitiveUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feGaussianBlur stdDeviation="128" />
        </filter>

        <pattern
          id="grid"
          width="100"
          height="58"
          y="5%"
          patternUnits="userSpaceOnUse"
        >
          <path
            stroke-linecap="square"
            stroke-width="1.5"
            stroke="#0007ad"
            d="M 100,58 0,0 M 0,58 100,0"
          />
        </pattern>

        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
          <stop stop-color="hsl(0 0% 0%)" offset="0" />
          <stop stop-color="hsl(0 0% 15%)" offset="60%" />
          <stop stop-color="hsl(0 0% 30%)" offset="100%" />
        </linearGradient>

        <mask id="gradientMask">
          <rect fill="url(#gradient)" x="0" y="20%" width="100%" height="80%" />
        </mask>

        <symbol
          id="blobs"
          viewBox="0 0 1440 800"
          preserveAspectRatio="xMidYMin slice"
        >
          <path
            className="a"
            fill="#0072d3"
            d="M2 46C-7 34 15 10 27 0c3 0 9 1 9 9 1 9 14 11 32 6 18-4 54-8 58 6s-10 21-30 32-21-4-41 5A42 41 0 0 1 2 46Z"
          />
          <path
            className="b"
            fill="#00cdca"
            d="M98 6c3 9-9 26-22 43-2 0-8-1-12-7-4-7-21-8-40 0S1 49 0 32C-1 14 7-2 10 0c3 3 32 2 46 3 15 1 38-6 42 3z"
          />
          <path
            className="c"
            fill="#cc01da"
            d="M119 9c17 15-8 27-14 41-7-5-22-16-32-13-13 3-29 15-49 14C4 49-4 16 2 9 7 3 21-6 15 5c-5 11 17 19 45 14 28-4 42-25 59-10Z"
          />
        </symbol>
      </defs>

      <rect width="100%" height="100%" fill="#0007ad" />

      <g filter="url(#blur)">
        <use href="#blobs" />
      </g>

      <rect
        width="100%"
        height="100%"
        fill="url(#grid)"
        mask="url(#gradientMask)"
      />
    </svg>

    <div className="absolute inset-0 z-10 w-full h-screen noise-bg" />

    <div className="top-[-210px] relative pt-[250px] pb-[180px]">
      <div className="max-w-4xl lg:max-w-6xl mx-auto w-full relative z-10 px-4">
        <Title className="text-white !mb-4">
          Thanks for joining EuroPython!
        </Title>
        <Title level={2} className="text-white">
          Hope to see you again in Prague! 👇
        </Title>

        <div className="grid md:grid-cols-2 gap-6 items-center mt-16">
          <HeroMain className="w-[80%]" />

          <div>
            <p className="font-title text-primary font-bold text-5xl text-white leading-snug word-spacing-snug">
              PyCon CZ 23
              <br />
              15-17 September
              <br /> Prague
            </p>

            <Link
              href="https://pycon.cz"
              className="text-white font-bold text-3xl mt-4 inline-block border-b-2 border-white"
            >
              Czech it out &rarr; 🇨🇿
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);
