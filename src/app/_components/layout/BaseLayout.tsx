import MainNavigation from "../navigation/MainNavigation";

function BaseLayout(props: { children: React.ReactNode; session: boolean }) {
  return (
    <div className="text-white min-h-screen max-w-screen relative overflow-hidden">
      <div
        className={`grid relative md:relative z-20 md:min-h-screen ${
          props.session && "md:grid-cols-[8.125rem,1fr]"
        }`}
      >
        <MainNavigation />
        <div className="w-full px-6 pb-24 md:pb-0 overflow-y-auto">
          {props.children}
        </div>
      </div>
      <div className="relative  opacity-50 -z-10 ">
        {/* Left bottom */}
        <svg
          width="760"
          height="620"
          viewBox="0 0 760 620"
          className="absolute md:-top-[18rem] md:-left-[2rem] animate-wiggle1 -top-[40rem]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_f_930_4197)">
            <path
              d="M559.027 338.5C559.027 414.991 478.656 477 379.514 477C280.371 477 200 414.991 200 338.5C200 262.009 280.371 200 379.514 200C478.656 200 559.027 262.009 559.027 338.5Z"
              fill="url(#paint0_linear_930_4197)"
              fillOpacity="0.24"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_930_4197"
              x="0"
              y="0"
              width="759.031"
              height="677"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="100"
                result="effect1_foregroundBlur_930_4197"
              />
            </filter>
            <linearGradient
              id="paint0_linear_930_4197"
              x1="379.514"
              y1="200"
              x2="379.514"
              y2="477"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FF7BCA" />
              <stop offset="1" stopColor="#FFC56F" stopOpacity="0.46" />
            </linearGradient>
          </defs>
        </svg>
        {/* Right bottom */}
        <svg
          width="760"
          height="620"
          viewBox="0 0 760 620"
          className="absolute md:-top-[15rem] md:left-[55rem] animate-wiggle1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_f_930_4197)">
            <path
              d="M559.027 338.5C559.027 414.991 478.656 477 379.514 477C280.371 477 200 414.991 200 338.5C200 262.009 280.371 200 379.514 200C478.656 200 559.027 262.009 559.027 338.5Z"
              fill="url(#paint0_linear_930_4197)"
              fillOpacity="0.24"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_930_4197"
              x="0"
              y="0"
              width="759.031"
              height="677"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="100"
                result="effect1_foregroundBlur_930_4197"
              />
            </filter>
            <linearGradient
              id="paint0_linear_930_4197"
              x1="379.514"
              y1="200"
              x2="379.514"
              y2="477"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FF7BCA" />
              <stop offset="1" stopColor="#FFC56F" stopOpacity="0.46" />
            </linearGradient>
          </defs>
        </svg>
        {/* Right top */}
        <svg
          width="760"
          height="620"
          viewBox="0 0 760 620"
          className="absolute md:-top-[70rem] md:left-[50rem] animate-wiggle2 -left-[12rem] -top-[80rem]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_f_930_4197)">
            <path
              d="M559.027 338.5C559.027 414.991 478.656 477 379.514 477C280.371 477 200 414.991 200 338.5C200 262.009 280.371 200 379.514 200C478.656 200 559.027 262.009 559.027 338.5Z"
              fill="url(#paint0_linear_930_4197)"
              fillOpacity="0.24"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_930_4197"
              x="0"
              y="0"
              width="759.031"
              height="677"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="100"
                result="effect1_foregroundBlur_930_4197"
              />
            </filter>
            <linearGradient
              id="paint0_linear_930_4197"
              x1="379.514"
              y1="200"
              x2="379.514"
              y2="477"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FF7BCA" />
              <stop offset="1" stopColor="#FFC56F" stopOpacity="0.46" />
            </linearGradient>
          </defs>
        </svg>
        {/* Left top */}
        <svg
          width="760"
          height="620"
          viewBox="0 0 760 620"
          className="absolute md:-top-[55rem] md:left-[5rem] animate-wiggle3"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_f_930_4197)">
            <path
              d="M559.027 338.5C559.027 414.991 478.656 477 379.514 477C280.371 477 200 414.991 200 338.5C200 262.009 280.371 200 379.514 200C478.656 200 559.027 262.009 559.027 338.5Z"
              fill="url(#paint0_linear_930_4197)"
              fillOpacity="0.24"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_930_4197"
              x="0"
              y="0"
              width="759.031"
              height="677"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="100"
                result="effect1_foregroundBlur_930_4197"
              />
            </filter>
            <linearGradient
              id="paint0_linear_930_4197"
              x1="379.514"
              y1="200"
              x2="379.514"
              y2="477"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FF7BCA" />
              <stop offset="1" stopColor="#FFC56F" stopOpacity="0.46" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <style>
        {`
          @keyframes wiggle1 {
            0% {
              transform: translateX(-5px) translateY(-2px);
            }
            25% {
              transform: translateX(3px) translateY(3px);
            }
            50% {
              transform: translateX(-2px) translateY(-5px);
            }
            75% {
              transform: translateX(5px) translateY(2px);
            }
            100% {
              transform: translateX(-5px) translateY(-2px);
            }
          }

          @keyframes wiggle2 {
            0% {
              transform: translateX(10px) translateY(-5px);
            }
            25% {
              transform: translateX(-5px) translateY(10px);
            }
            50% {
              transform: translateX(8px) translateY(-8px);
            }
            75% {
              transform: translateX(-12px) translateY(6px);
            }
            100% {
              transform: translateX(10px) translateY(-5px);
            }
          }
          
          @keyframes wiggle3 {
            0% {
              transform: translateX(-8px) translateY(4px);
            }
            25% {
              transform: translateX(5px) translateY(-12px);
            }
            50% {
              transform: translateX(-10px) translateY(8px);
            }
            75% {
              transform: translateX(15px) translateY(-3px);
            }
            100% {
              transform: translateX(-8px) translateY(4px);
            }
          }

          .animate-wiggle1 {
            animation: wiggle1 7s infinite;
          }

          .animate-wiggle2 {
            animation: wiggle2 7s infinite;
          }

          .animate-wiggle3 {
            animation: wiggle3 7s infinite;
          }
        `}
      </style>
      <div className="bg-bg_black absolute inset-0 -z-20"></div>
    </div>
  );
}

export default BaseLayout;
