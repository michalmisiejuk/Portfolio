function Frame() {
  return (
    <div className="content-stretch flex items-center justify-center justify-self-start p-[10px] relative self-start shrink-0">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-black whitespace-nowrap">Home</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center justify-center justify-self-start p-[10px] relative self-start shrink-0">
      <p className="[word-break:break-word] font-['Inter:Extra_Bold',sans-serif] font-extrabold leading-[normal] not-italic relative shrink-0 text-[32px] text-black whitespace-nowrap">Projects</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center justify-center justify-self-start p-[10px] relative self-start shrink-0">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-black whitespace-nowrap">Links</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute gap-x-[98px] gap-y-[98px] grid-cols-[repeat(3,fit-content(100%))] grid-rows-[repeat(1,fit-content(100%))] inline-grid left-[686px] top-[43px]">
      <Frame />
      <Frame1 />
      <Frame2 />
    </div>
  );
}

function Frame5Variant({ className }: { className?: string }) {
  return (
    <div className={className || "absolute bg-[#e4e4e4] content-stretch flex items-center justify-center left-[721px] p-[10px] top-[376px]"} data-name="Frame 5/Variant7">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-black whitespace-nowrap">UX</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-white relative size-full" data-name="Home">
      <p className="[word-break:break-word] absolute font-['Inter:Light',sans-serif] font-light h-[74px] leading-[normal] left-[729px] not-italic text-[24px] text-black top-[282px] w-[590px]">Lorem ipsum dolor sit amet consectetur. Aliquam ultricies ut hac malesuada mattis orci id pharetra dui. E</p>
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium h-[59px] leading-[normal] left-[721px] not-italic text-[40px] text-black top-[234px] w-[590px]">TITLE</p>
      <Frame3 />
      <div className="absolute bg-[#d9d9d9] h-[187px] left-[481px] top-[248px] w-[205px]" />
      <Frame5Variant />
      <div className="absolute flex items-center justify-center left-[-72.93px] size-[500.883px] top-[-88.88px]">
        <div className="-rotate-45 flex-none">
          <div className="bg-[#d9d9d9] h-[74.97px] relative w-[633.386px]" />
        </div>
      </div>
      <div className="absolute flex items-center justify-center left-[-19.78px] size-[499.924px] top-[-140.18px]">
        <div className="-rotate-45 flex-none">
          <p className="[word-break:break-word] font-['Inter:Light',sans-serif] font-light h-[53px] leading-[normal] not-italic relative text-[32px] text-black w-[654px]">Work In Progress</p>
        </div>
      </div>
      <div className="absolute bg-[#e4e4e4] content-stretch flex items-center justify-center left-[805px] p-[10px] top-[376px]">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-black whitespace-nowrap">App</p>
      </div>
      <div className="absolute bg-[#e4e4e4] content-stretch flex items-center justify-center left-[904px] p-[10px] top-[376px]">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-black whitespace-nowrap">Games</p>
      </div>
    </div>
  );
}