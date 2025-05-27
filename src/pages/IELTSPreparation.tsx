import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

// Placeholder SVGs for illustration
const ListeningSVG = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="40" fill="#FFD700"/><path d="M40 20v40M20 40h40" stroke="#8B0000" strokeWidth="4" strokeLinecap="round"/></svg>
);
const ReadingSVG = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none"><rect width="80" height="80" rx="40" fill="#00A86B"/><rect x="25" y="30" width="30" height="20" fill="#fff" stroke="#8B0000" strokeWidth="2"/><line x1="30" y1="40" x2="50" y2="40" stroke="#FFD700" strokeWidth="2"/></svg>
);
const WritingSVG = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none"><rect width="80" height="80" rx="40" fill="#8B0000"/><rect x="28" y="28" width="24" height="24" fill="#fff"/><path d="M32 48l16-16" stroke="#FFD700" strokeWidth="2"/></svg>
);
const SpeakingSVG = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="40" fill="#FFD700"/><ellipse cx="40" cy="50" rx="18" ry="8" fill="#fff"/><ellipse cx="40" cy="38" rx="10" ry="14" fill="#8B0000"/></svg>
);
const TipsSVG = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none"><rect width="80" height="80" rx="40" fill="#00A86B"/><circle cx="40" cy="40" r="18" fill="#fff"/><path d="M40 30v12" stroke="#FFD700" strokeWidth="2"/><circle cx="40" cy="50" r="2" fill="#FFD700"/></svg>
);

// Animate on scroll (simple fade-in)
function useScrollFadeIn() {
  useEffect(() => {
    const elements = document.querySelectorAll('.fade-in-on-scroll');
    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
        }
      });
    }, { threshold: 0.1 });
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function IELTSPreparation() {
  useScrollFadeIn();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full hero-gradient py-16 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">IELTS စာမေးပွဲအတွက် ပြင်ဆင်နည်းများ</h1>
        <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto mb-8">IELTS (International English Language Testing System) သည် နိုင်ငံတကာ အသိအမှတ်ပြုထားသော အင်္ဂလိပ်ဘာသာစကား ကျွမ်းကါမှုစစ်ဆေးရေး စာမေးပွဲတစ်ခုဖြစ်သည်။ ဤစာမေးပွဲသည် Listening, Reading, Writing, နှင့် Speaking ဟူ၍ အပိုင်းလေးပိုင်းပါဝင်ပြီး သင်၏ အင်္ဂလိပ်ဘာသာစကား ကျွမ်းကျင်မှုကို စမ်းသပ်သည်။ ဤလမ်းညွှန်ချက်တွင် IELTS စာမေးပွဲအတွက် အောင်မြင်မှုရရှိရန် အကြံပြုချက်များကို အပိုင်းတစ်ခုစီအလိုက် အသေးစိတ်ဖော်ပြထားပါသည်။</p>
        <div className="absolute right-10 top-10 opacity-30 animate-float-slow"><ListeningSVG /></div>
        <div className="absolute left-10 bottom-10 opacity-30 animate-float-slow"><ReadingSVG /></div>
      </section>

      {/* IELTS Sections */}
      <div className="w-full max-w-3xl flex flex-col gap-10 py-12 px-4 md:px-0">
        {/* Listening */}
        <Card className="fade-in-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <CardHeader className="flex flex-row items-center gap-4">
            <ListeningSVG />
            <CardTitle>Listening Section အတွက် ပြင်ဆင်နည်း</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed">
            <div>Listening အပိုင်းသည် မိနစ် ၃၀ ခန့်ကြာမြင့်ပြီး အပိုင်း ၄ ပိုင်းပါဝင်သည်။ ဤအပိုင်းတွင် အင်္ဂလိပ်စကားပြောသံများကို နားထောင်ပြီး မေးခွန်းများကို ဖြေဆိုရမည်ဖြစ်သည်။ အောက်ပါအကြံပြုချက်များသည် သင့်အား ဤအပိုင်းတွင် အောင်မြင်မှုရရှိရန် ကူညီပေးပါလိမ့်မည်။</div>
            <ul className="list-none pl-0 space-y-3">
              <li>
                <span className="font-bold">အင်္ဂလိပ်စကားပြောသံများကို နေ့စဉ်နားထောင်ပါ</span><br />
                <span>အင်္ဂလိပ်ဘာသာစကားဖြင့် ရုပ်ရှင်၊ ပေါ့တ်ကာစ်များ၊ TED Talks များ၊ သို့မဟုတ် BBC သတင်းများကို နားထောင်ပါ။ မတူညီသော လေယူလေသိမ်းများနှင့် ရင်းနှီးလာစေရန် အမျိုးမျိုးသော အသံပိုင်းဆိုင်ရာ အကြောင်းအရာများကို ရွေးချယ်ပါ။</span>
              </li>
              <li>
                <span className="font-bold">မှတ်စုယူခြင်းကို လေ့ကျင့်ပါ</span><br />
                <span>နားထောင်နေစဉ် အဓိကအချက်များကို မှတ်စုယူရန် လေ့ကျင့်ပါ။ စကားလုံးများကို အတိုကောက်ရေးသားနည်းကို သင်ယူပြီး အရေးကြီးသော အချက်အလက်များဖြစ်သည့် နာမည်များ၊ ရက်စွဲများ၊ နှင့် နေရာများကို မှတ်သားပါ။</span>
              </li>
              <li>
                <span className="font-bold">မေးခွန်းပုံစံများကို ရင်းနှီးအောင်လုပ်ပါ</span><br />
                <span>IELTS Listening တွင် မေးခွန်းအမျိုးအစားများ အမျိုးမျိုးရှိသည် (ဥပမာ- Multiple Choice, Gap-Fill, Matching)။ ဤမေးခွန်းများကို လေ့ကျင့်ရန် IELTS စမ်းသပ်မေးခွန်းများကို အသုံးပြုပါ။</span>
              </li>
              <li>
                <span className="font-bold">အာရုံစူးစိုက်မှုကို မြှင့်တင်ပါ</span><br />
                <span>အာရုံစူးစိုက်နိုင်မှုသည် Listening အပိုင်းတွင် အရေးကြီးသည်။ အာရုံထွေပြားမှုကို လျှော့ချရန် တိတ်ဆိတ်သောနေရာတွင် လေ့ကျင့်ပါ။</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        {/* Reading */}
        <Card className="fade-in-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <CardHeader className="flex flex-row items-center gap-4">
            <ReadingSVG />
            <CardTitle>Reading Section အတွက် ပြင်ဆင်နည်း</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed">
            <div>Reading အပိုင်းသည် မိနစ် ၆၀ ကြာမြင့်ပြီး စာသားသုံးပုဒ်ပါဝင်သည်။ Academic နှင့် General Training ပုံစံများတွင် စာသားများသည် အနည်းငယ်ကွဲပြားသည်။ အောက်ပါအကြံပြုချက်များကို လိုက်နာပါ။</div>
            <ul className="list-none pl-0 space-y-3">
              <li>
                <span className="font-bold">အင်္ဂလိပ်စာသားများကို ပုံမှန်ဖတ်ပါ</span><br />
                <span>သတင်းစာ (The Guardian, BBC News)၊ မဂ္ဂဇင်းများ၊ သို့မဟုတ် သိပ္ပံဆောင်းပါးများကို ဖတ်ရှုပါ။ စကားလုံးအသစ်များကို မှတ်သားပြီး ၎င်းတို့၏ အဓိပ္ပာယ်နှင့် အသုံးပြုပုံကို သင်ယူပါ။</span>
              </li>
              <li>
                <span className="font-bold">Skimming နှင့် Scanning နည်းစနစ်များကို လေ့ကျင့်ပါ</span><br />
                <span>Skimming သည် စာသား၏ အဓိကအကြောင်းအရာကို လျင်မြန်စွာ နားလည်ရန်ဖြစ်ပြီး Scanning သည် သတ်မှတ်ထားသော အချက်အလက်များကို ရှာဖွေရန်ဖြစ်သည်။ ဤနည်းစနစ်များကို လေ့ကျင့်ခြင်းဖြင့် အချိန်ကို ထိရောက်စွာ စီမံခန့်ခွဲနိုင်မည်။</span>
              </li>
              <li>
                <span className="font-bold">မေးခွန်းအမျိုးအစားများကို နားလည်ပါ</span><br />
                <span>True/False/Not Given, Matching Headings, Sentence Completion စသည့် မေးခွန်းပုံစံများကို လေ့ကျင့်ပါ။ အထူးသဖြင့် True/False/Not Given မေးခွန်းများသည် အာရုံစူးစိုက်မှုပိုလိုအပ်သည်။</span>
              </li>
              <li>
                <span className="font-bold">အချိန်စီမံခန့်ခွဲမှု</span><br />
                <span>စာသားတစ်ပုဒ်လျှင် မိနစ် ၂၀ ခန့်သာ အချိန်ရှိသည်။ မေးခွန်းများကို ဦးစွာဖတ်ပြီး စာသားတွင် လိုအပ်သော အချက်အလက်များကို ဦးစားပေးရှာဖွေပါ။</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        {/* Writing */}
        <Card className="fade-in-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <CardHeader className="flex flex-row items-center gap-4">
            <WritingSVG />
            <CardTitle>Writing Section အတွက် ပြင်ဆင်နည်း</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed">
            <div>Writing အပိုင်းတွင် Task 1 နှင့် Task 2 ဟူ၍ နှစ်ပိုင်းပါဝင်ပြီး မိနစ် ၆၀ အတွင်း ပြီးစီးရမည်။ Task 1 သည် ပုံများ၊ ဇယားများကို ဖော်ပြရေးသားရပြီး Task 2 သည် အက်ဆေးရေးသားရန်ဖြစ်သည်။</div>
            <div className="font-semibold">Task 1 အတွက် ပြင်ဆင်နည်း</div>
            <ul className="list-none pl-0 space-y-3 mb-2">
              <li>
                <span className="font-bold">ဇယား၊ ဂရပ်၊ သို့မဟုတ် ပုံများကို ဖော်ပြရာတွင် အဓိကအချက်များကို ရွေးချယ်ပါ။</span>
              </li>
              <li>
                <span className="font-bold">နှိုင်းယှဉ်မှုနှင့် ခေတ်ရေစီးကြောင်း (Trends) ကို ဖော်ပြရန် သင်ယူပါ (ဥပမာ- increase, decrease, fluctuate)။</span>
              </li>
              <li>
                <span className="font-bold">စကားလုံးအရေအတွက်ကို အနည်းဆုံး ၁၅၀ ထားရှိပါ။</span>
              </li>
            </ul>
            <div className="font-semibold">Task 2 အတွက် ပြင်ဆင်နည်း</div>
            <ul className="list-none pl-0 space-y-3 mb-2">
              <li>
                <span className="font-bold">အက်ဆေးဖွဲ့စည်းပုံကို လေ့လာပါ- Introduction, Body Paragraphs (၂ ခု သို့မဟုတ် ၃ ခု)၊ Conclusion။</span>
              </li>
              <li>
                <span className="font-bold">အကြောင်းအမျိုးမျိုးအတွက် စကားလုံးများနှင့် စာကြောင်းဖွဲ့စည်းပုံများကို လေ့ကျင့်ပါ (ဥပမာ- Opinion essays, Discussion essays)။</span>
              </li>
              <li>
                <span className="font-bold">စကားလုံးအရေအတွက်ကို အနည်းဆုံး ၂၅၀ ထားရှိပါ။</span>
              </li>
            </ul>
            <div className="font-semibold">ဘာသာစကားကျွမ်းကျင်မှု</div>
            <div>သဒ္ဒါ (Grammar)၊ စကားလုံးအသုံးပြုမှု (Vocabulary)၊ နှင့် စာကြောင်းဆက်စပ်မှု (Coherence) ကို အာရုံစိုက်ပါ။ Linking words (ဥပမာ- However, Therefore, In addition) ကို ထိရောက်စွာ အသုံးပြုပါ။</div>
            <div className="font-semibold">လေ့ကျင့်ရေးသားပါ</div>
            <div>အနည်းဆုံး တစ်ပတ်လျှင် Task 1 နှင့် Task 2 တစ်ခုစီကို ရေးသားပြီး ဆရာတစ်ဦး သို့မဟုတ် အင်္ဂလိပ်ဘာသာစကားကျွမ်းကျင်သူတစ်ဦးထံမှ အကြံပြုချက်ရယူပါ။</div>
          </CardContent>
        </Card>
        {/* Speaking */}
        <Card className="fade-in-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <CardHeader className="flex flex-row items-center gap-4">
            <SpeakingSVG />
            <CardTitle>Speaking Section အတွက် ပြင်ဆင်နည်း</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed">
            <div>Speaking အပိုင်းသည် မိနစ် ၁၁ မှ ၁၄ မိနစ်အထိ ကြာမြင့်ပြီး အင်တာဗျူးပုံစံဖြင့် စစ်ဆေးသည်။ ဤအပိုင်းတွင် အပိုင်း ၃ ပိုင်းပါဝင်သည်- မိတ်ဆက်နှင့် အင်တာဗျူး၊ တစ်ဦးချင်းပြောဆိုမှု၊ နှင့် ဆွေးနွေးမှု။</div>
            <ul className="list-none pl-0 space-y-3">
              <li>
                <span className="font-bold">အင်္ဂလိပ်စကားပြောကို လေ့ကျင့်ပါ</span><br />
                <span>အင်္ဂလိပ်စကားပြောသူများနှင့် စကားပြောဆိုရန် အခွင့်အလမ်းရှာပါ။ Language exchange ပရိုဂရမ်များ သို့မဟုတ် အွန်လိုင်းပလက်ဖောင်းများကို အသုံးပြုပါ (ဥပမာ- iTalki, Tandem)။</span>
              </li>
              <li>
                <span className="font-bold">အသံထွက်ကို အာရုံစိုက်ပါ</span><br />
                <span>မတိကျသော အသံထွက်သည် ရမှတ်ကို ထိခိုက်စေနိုင်သည်။ Pronunciation ကို လေ့ကျင့်ရန် အင်္ဂလိပ်စကားပြောသံများကို နားထောင်ပြီး အတုယူပါ။</span>
              </li>
              <li>
                <span className="font-bold">အကြောင်းအမျိုးမျိုးကို ပြင်ဆင်ထားပါ</span><br />
                <span>နေ့စဉ်ဘဝ၊ ပညာရေး၊ အလုပ်အကိုင်၊ ခရီးသွားခြင်း၊ နှင့် ယဉ်ကျေးမှုဆိုင်ရာ အကြောင်းအရာများကို လေ့ကျင့်ပြောဆိုပါ။ Part 2 အတွက် ၁-၂ မိနစ်ကြာ စကားပြောရန် အဆင်သင့်ဖြစ်အောင် လေ့ကျင့်ပါ။</span>
              </li>
              <li>
                <span className="font-bold">စိတ်လှုပ်ရှားမှုကို ထိန်းချုပ်ပါ</span><br />
                <span>စာမေးပွဲတွင် စိတ်လှုပ်ရှားမှုသည် ပုံမှန်ဖြစ်သည်။ အင်တာဗျူးပုံစံဖြင့် လေ့ကျင့်ခြင်းဖြင့် ယုံကြည်မှုကို တည်ဆောက်ပါ။</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        {/* General Tips */}
        <Card className="fade-in-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <CardHeader className="flex flex-row items-center gap-4">
            <TipsSVG />
            <CardTitle>ယေဘုယျ အကြံပြုချက်များ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed">
            <ul className="list-none pl-0 space-y-3">
              <li>
                <span className="font-bold">စာမေးပွဲပုံစံကို နားလည်ပါ</span><br />
                <span>IELTS စာမေးပွဲ၏ ဖွဲ့စည်းပုံအား အသေးစိတ်လေ့လာပါ။ Official IELTS Practice Materials သို့မဟုတ် Cambridge IELTS စာအုပ်များကို အသုံးပြုပါ။</span>
              </li>
              <li>
                <span className="font-bold">အချိန်ဇယားတစ်ခု ချမှတ်ပါ</span><br />
                <span>တစ်ပတ်လျှင် အနည်းဆုံး ၁၀-၁၅ နာရီ လေ့ကျင့်ရန် အချိန်ဇယားတစ်ခု ပြုလုပ်ပါ။ အပိုင်းလေးပိုင်းလုံးကို မျှတစွာ လေ့ကျင့်ပါ။</span>
              </li>
              <li>
                <span className="font-bold">စမ်းသပ်စာမေးပွဲများဖြေဆိုပါ</span><br />
                <span>စမ်းသပ်စာမေးပွဲများကို ဖြေဆိုခြင်းဖြင့် သင်၏ တိုးတက်မှုကို စစ်ဆေးပါ။ အချိန်ကန့်သတ်ချက်အောက်တွင် လေ့ကျင့်ခြင်းသည် စာမေးပွဲအငွေ့အသက်ကို ရင်းနှီးစေသည်။</span>
              </li>
              <li>
                <span className="font-bold">အကူအညီရယူပါ</span><br />
                <span>IELTS သင်တန်းများ၊ ဆရာများ၊ သို့မဟုတ် အွန်လိုင်းအရင်းအမြစ်များကို အသုံးပြုပါ။ British Council, IDP, သို့မဟုတ် IELTS Liz ကဲ့သို့ ဝဘ်ဆိုဒ်များသည် အခမဲ့ အကြံပြုချက်များပေးသည်။</span>
              </li>
              <li>
                <span className="font-bold">ကျန်းမာရေးကို ဂရုစိုက်ပါ</span><br />
                <span>စာမေးပွဲမတိုင်မီ အိပ်ရေးဝဝအိပ်စက်ပြီး ကျန်းမာသော အစားအသောက်ကို စားသုံးပါ။ စိတ်ဖိစီးမှုကို လျှော့ချရန် တရားထိုင်ခြင်း သို့မဟုတ် လေ့ကျင့်ခန်းလုပ်ပါ။</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        {/* Resources / Mock Tests */}
        <Card className="fade-in-on-scroll opacity-0 translate-y-8 transition-all duration-700 border-2 border-myanmar-gold shadow-lg">
          <CardHeader className="flex flex-row items-center gap-4">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none"><rect width="80" height="80" rx="40" fill="#FFD700"/><path d="M30 40h20M40 30v20" stroke="#8B0000" strokeWidth="4" strokeLinecap="round"/></svg>
            <CardTitle>Mock Test Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-base leading-relaxed">
            <p>IELTS စမ်းသပ်စာမေးပွဲများနှင့် အရင်းအမြစ်များကို အောက်ပါလင့်များတွင် ရယူနိုင်ပါသည်။</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="secondary" className="rounded-full font-bold">
                <a href="https://takeielts.britishcouncil.org/take-ielts/prepare/sample-test-questions" target="_blank" rel="noopener noreferrer">British Council Mock Tests</a>
              </Button>
              <Button asChild variant="secondary" className="rounded-full font-bold">
                <a href="https://www.ielts.org/about-ielts/ielts-practice-test" target="_blank" rel="noopener noreferrer">Official IELTS Practice Test</a>
              </Button>
              <Button asChild variant="secondary" className="rounded-full font-bold">
                <a href="https://ieltsliz.com/ielts-practice-tests/" target="_blank" rel="noopener noreferrer">IELTS Liz Practice Tests</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Conclusion */}
      <section className="w-full py-10 text-center bg-muted mt-8 fade-in-on-scroll opacity-0 translate-y-8 transition-all duration-700">
        <h2 className="text-2xl md:text-3xl font-bold text-myanmar-maroon mb-2">နိဂုံးချုပ်</h2>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground">IELTS စာမေးပွဲသည် စိန်ခေါ်မှုတစ်ခုဖြစ်သော်လည်း သင့်လျော်သော ပြင်ဆင်မှုနှင့် လေ့ကျင့်မှုဖြင့် အောင်မြင်မှုရရှိနိုင်သည်။ သင်၏ အားနည်းချက်များကို ဖော်ထုတ်ပြီး ၎င်းတို့ကို တိုးတက်အောင်လုပ်ပါ။ ယုံကြည်မှုနှင့် စိတ်အားထက်သန်မှုဖြင့် စာမေးပွဲကို ရင်ဆိုင်ပါ။ အောင်မြင်မှုအတွက် ဆုမွန်ကောင်းတောင်းပါသည်။</p>
      </section>
      {/* Animation keyframes */}
      <style>{`
        .animate-float-slow {
          animation: floatY 6s ease-in-out infinite;
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }
        .fade-in-on-scroll {
          opacity: 0;
          transform: translateY(32px);
        }
        .fade-in-on-scroll.opacity-100 {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
} 