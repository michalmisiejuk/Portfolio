function Frame() {
  return (
    <div className="content-stretch flex items-center justify-center justify-self-start p-[10px] relative self-start shrink-0">
      <p className="[word-break:break-word] font-['Inter:Extra_Bold',sans-serif] font-extrabold leading-[normal] not-italic relative shrink-0 text-[32px] text-black whitespace-nowrap">Home</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center justify-center justify-self-start p-[10px] relative self-start shrink-0">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-black whitespace-nowrap">Projects</p>
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

export default function Home() {
  return (
    <div className="bg-white relative size-full" data-name="Home">
      <p className="[word-break:break-word] absolute font-['Inter:Bold',sans-serif] font-bold h-[76px] leading-[normal] left-[220px] not-italic text-[64px] text-black top-[204px] w-[528px]">{`Name Sirname `}</p>
      <p className="[word-break:break-word] absolute font-['Inter:Light',sans-serif] font-light h-[76px] leading-[normal] left-[220px] not-italic text-[64px] text-black top-[280px] w-[1453px]">Product Design / Business Analysis / Game UX</p>
      <p className="[word-break:break-word] absolute font-['Inter:Light',sans-serif] font-light h-[462px] leading-[normal] left-[799px] not-italic text-[48px] text-black top-[414px] w-[874px]">Lorem ipsum dolor sit amet consectetur. Aliquam ultricies ut hac malesuada mattis orci id pharetra dui. Etiam sit mattis pulvinar at nisl augue. Turpis in consectetur magna amet bibendum. Lacus et rhoncus nisl egestas dolor. Et cras sed velit enim purus fringilla.</p>
      <Frame3 />
      <div className="absolute bg-[#d9d9d9] h-[462px] left-[220px] top-[414px] w-[476px]" />
    </div>
  );
}