import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Placeholder SVGs for illustration
const ListeningSVG = () => (
  <svg width="48" height="48" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="40" fill="#FFD700"/><path d="M40 20v40M20 40h40" stroke="#8B0000" strokeWidth="4" strokeLinecap="round"/></svg>
);
const ReadingSVG = () => (
  <svg width="48" height="48" viewBox="0 0 80 80" fill="none"><rect width="80" height="80" rx="40" fill="#00A86B"/><rect x="25" y="30" width="30" height="20" fill="#fff" stroke="#8B0000" strokeWidth="2"/><line x1="30" y1="40" x2="50" y2="40" stroke="#FFD700" strokeWidth="2"/></svg>
);
const WritingSVG = () => (
  <svg width="48" height="48" viewBox="0 0 80 80" fill="none"><rect width="80" height="80" rx="40" fill="#8B0000"/><rect x="28" y="28" width="24" height="24" fill="#fff"/><path d="M32 48l16-16" stroke="#FFD700" strokeWidth="2"/></svg>
);
const SpeakingSVG = () => (
  <svg width="48" height="48" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="40" fill="#FFD700"/><ellipse cx="40" cy="50" rx="18" ry="8" fill="#fff"/><ellipse cx="40" cy="38" rx="10" ry="14" fill="#8B0000"/></svg>
);
const TipsSVG = () => (
  <svg width="48" height="48" viewBox="0 0 80 80" fill="none"><rect width="80" height="80" rx="40" fill="#00A86B"/><circle cx="40" cy="40" r="18" fill="#fff"/><path d="M40 30v12" stroke="#FFD700" strokeWidth="2"/><circle cx="40" cy="50" r="2" fill="#FFD700"/></svg>
);

const MockTestsSVG = () => (
  <svg width="48" height="48" viewBox="0 0 80 80" fill="none">
    <rect width="80" height="80" rx="40" fill="#6366F1"/>
    <path d="M25 25h30v30H25z" stroke="#fff" strokeWidth="2"/>
    <path d="M35 25v30M45 25v30" stroke="#fff" strokeWidth="2"/>
  </svg>
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

const partners = [
  { name: "British Council", logo: "https://brandlogos.net/wp-content/uploads/2021/12/british_council-brandlogo.net_-512x512.png" },
  { name: "IDP", logo: "https://www.freelogovectors.net/wp-content/uploads/2021/06/idp-logo-freelogovectors.net_.png" },
  { name: "Cambridge", logo: "https://www.cambridgeassessment.org.uk/Images/Simon-brand-blog-newest-logo.png" },
];

const benefits = [
  { icon: ListeningSVG, title: "Mock Tests", desc: "Free and official IELTS practice tests for all sections." },
  { icon: ReadingSVG, title: "Expert Tips", desc: "Section-wise strategies and tips from IELTS experts." },
  { icon: WritingSVG, title: "Myanmar Language Support", desc: "Guidance and explanations in Myanmar language." },
  { icon: SpeakingSVG, title: "Speaking Practice", desc: "Practice questions and speaking partners." },
  { icon: TipsSVG, title: "Time Management", desc: "Learn how to manage your time for each section." },
  { icon: TipsSVG, title: "Health & Mindset", desc: "Advice for exam day, stress, and healthy habits." },
];

const sectionCards = [
  {
    key: "listening",
    title: "Listening Section အတွက် ပြင်ဆင်နည်း",
    svg: ListeningSVG,
    img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600",
    content: (
      <>
        <div>Listening အပိုင်းသည် မိနစ် ၃၀ ခန့်ကြာမြင့်ပြီး အပိုင်း ၄ ပိုင်းပါဝင်သည်။ ဤအပိုင်းတွင် အင်္ဂလိပ်စကားပြောသံများကို နားထောင်ပြီး မေးခွန်းများကို ဖြေဆိုရမည်ဖြစ်သည်။ အောက်ပါအကြံပြုချက်များသည် သင့်အား ဤအပိုင်းတွင် အောင်မြင်မှုရရှိရန် ကူညီပေးပါလိမ့်မည်။</div>
        <ul className="list-none pl-0 space-y-3">
          <li><span className="font-bold">အင်္ဂလိပ်စကားပြောသံများကို နေ့စဉ်နားထောင်ပါ</span><br /><span>အင်္ဂလိပ်ဘာသာစကားဖြင့် ရုပ်ရှင်၊ ပေါ့တ်ကာစ်များ၊ TED Talks များ၊ သို့မဟုတ် BBC သတင်းများကို နားထောင်ပါ။ မတူညီသော လေယူလေသိမ်းများနှင့် ရင်းနှီးလာစေရန် အမျိုးမျိုးသော အသံပိုင်းဆိုင်ရာ အကြောင်းအရာများကို ရွေးချယ်ပါ။</span></li>
          <li><span className="font-bold">မှတ်စုယူခြင်းကို လေ့ကျင့်ပါ</span><br /><span>နားထောင်နေစဉ် အဓိကအချက်များကို မှတ်စုယူရန် လေ့ကျင့်ပါ။ စကားလုံးများကို အတိုကောက်ရေးသားနည်းကို သင်ယူပြီး အရေးကြီးသော အချက်အလက်များဖြစ်သည့် နာမည်များ၊ ရက်စွဲများ၊ နှင့် နေရာများကို မှတ်သားပါ။</span></li>
          <li><span className="font-bold">မေးခွန်းပုံစံများကို ရင်းနှီးအောင်လုပ်ပါ</span><br /><span>IELTS Listening တွင် မေးခွန်းအမျိုးအစားများ အမျိုးမျိုးရှိသည် (ဥပမာ- Multiple Choice, Gap-Fill, Matching)။ ဤမေးခွန်းများကို လေ့ကျင့်ရန် IELTS စမ်းသပ်မေးခွန်းများကို အသုံးပြုပါ။</span></li>
          <li><span className="font-bold">အာရုံစူးစိုက်မှုကို မြှင့်တင်ပါ</span><br /><span>အာရုံစူးစိုက်နိုင်မှုသည် Listening အပိုင်းတွင် အရေးကြီးသည်။ အာရုံထွေပြားမှုကို လျှော့ချရန် တိတ်ဆိတ်သောနေရာတွင် လေ့ကျင့်ပါ။</span></li>
        </ul>
      </>
    ),
    cta: "See Listening Tips"
  },
  {
    key: "reading",
    title: "Reading Section အတွက် ပြင်ဆင်နည်း",
    svg: ReadingSVG,
    img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600",
    content: (
      <>
        <div>Reading အပိုင်းသည် မိနစ် ၆၀ ကြာမြင့်ပြီး စာသားသုံးပုဒ်ပါဝင်သည်။ Academic နှင့် General Training ပုံစံများတွင် စာသားများသည် အနည်းငယ်ကွဲပြားသည်။ အောက်ပါအကြံပြုချက်များကို လိုက်နာပါ။</div>
        <ul className="list-none pl-0 space-y-3">
          <li><span className="font-bold">အင်္ဂလိပ်စာသားများကို ပုံမှန်ဖတ်ပါ</span><br /><span>သတင်းစာ (The Guardian, BBC News)၊ မဂ္ဂဇင်းများ၊ သို့မဟုတ် သိပ္ပံဆောင်းပါးများကို ဖတ်ရှုပါ။ စကားလုံးအသစ်များကို မှတ်သားပြီး ၎င်းတို့၏ အဓိပ္ပာယ်နှင့် အသုံးပြုပုံကို သင်ယူပါ။</span></li>
          <li><span className="font-bold">Skimming နှင့် Scanning နည်းစနစ်များကို လေ့ကျင့်ပါ</span><br /><span>Skimming သည် စာသား၏ အဓိကအကြောင်းအရာကို လျင်မြန်စွာ နားလည်ရန်ဖြစ်ပြီး Scanning သည် သတ်မှတ်ထားသော အချက်အလက်များကို ရှာဖွေရန်ဖြစ်သည်။ ဤနည်းစနစ်များကို လေ့ကျင့်ခြင်းဖြင့် အချိန်ကို ထိရောက်စွာ စီမံခန့်ခွဲနိုင်မည်။</span></li>
          <li><span className="font-bold">မေးခွန်းအမျိုးအစားများကို နားလည်ပါ</span><br /><span>True/False/Not Given, Matching Headings, Sentence Completion စသည့် မေးခွန်းပုံစံများကို လေ့ကျင့်ပါ။ အထူးသဖြင့် True/False/Not Given မေးခွန်းများသည် အာရုံစူးစိုက်မှုပိုလိုအပ်သည်။</span></li>
          <li><span className="font-bold">အချိန်စီမံခန့်ခွဲမှု</span><br /><span>စာသားတစ်ပုဒ်လျှင် မိနစ် ၂၀ ခန့်သာ အချိန်ရှိသည်။ မေးခွန်းများကို ဦးစွာဖတ်ပြီး စာသားတွင် လိုအပ်သော အချက်အလက်များကို ဦးစားပေးရှာဖွေပါ။</span></li>
        </ul>
      </>
    ),
    cta: "See Reading Tips"
  },
  {
    key: "writing",
    title: "Writing Section အတွက် ပြင်ဆင်နည်း",
    svg: WritingSVG,
    img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600",
    content: (
      <>
        <div>Writing အပိုင်းတွင် Task 1 နှင့် Task 2 ဟူ၍ နှစ်ပိုင်းပါဝင်ပြီး မိနစ် ၆၀ အတွင်း ပြီးစီးရမည်။ Task 1 သည် ပုံများ၊ ဇယားများကို ဖော်ပြရေးသားရပြီး Task 2 သည် အက်ဆေးရေးသားရန်ဖြစ်သည်။</div>
        <div className="font-semibold">Task 1 အတွက် ပြင်ဆင်နည်း</div>
        <ul className="list-none pl-0 space-y-3 mb-2">
          <li><span className="font-bold">ဇယား၊ ဂရပ်၊ သို့မဟုတ် ပုံများကို ဖော်ပြရာတွင် အဓိကအချက်များကို ရွေးချယ်ပါ။</span></li>
          <li><span className="font-bold">နှိုင်းယှဉ်မှုနှင့် ခေတ်ရေစီးကြောင်း (Trends) ကို ဖော်ပြရန် သင်ယူပါ (ဥပမာ- increase, decrease, fluctuate)။</span></li>
          <li><span className="font-bold">စကားလုံးအရေအတွက်ကို အနည်းဆုံး ၁၅၀ ထားရှိပါ။</span></li>
        </ul>
        <div className="font-semibold">Task 2 အတွက် ပြင်ဆင်နည်း</div>
        <ul className="list-none pl-0 space-y-3 mb-2">
          <li><span className="font-bold">အက်ဆေးဖွဲ့စည်းပုံကို လေ့လာပါ- Introduction, Body Paragraphs (၂ ခု သို့မဟုတ် ၃ ခု)၊ Conclusion။</span></li>
          <li><span className="font-bold">အကြောင်းအမျိုးမျိုးအတွက် စကားလုံးများနှင့် စာကြောင်းဖွဲ့စည်းပုံများကို လေ့ကျင့်ပါ (ဥပမာ- Opinion essays, Discussion essays)။</span></li>
          <li><span className="font-bold">စကားလုံးအရေအတွက်ကို အနည်းဆုံး ၂၅၀ ထားရှိပါ။</span></li>
        </ul>
        <div className="font-semibold">ဘာသာစကားကျွမ်းကျင်မှု</div>
        <div>သဒ္ဒါ (Grammar)၊ စကားလုံးအသုံးပြုမှု (Vocabulary)၊ နှင့် စာကြောင်းဆက်စပ်မှု (Coherence) ကို အာရုံစိုက်ပါ။ Linking words (ဥပမာ- However, Therefore, In addition) ကို ထိရောက်စွာ အသုံးပြုပါ။</div>
        <div className="font-semibold">လေ့ကျင့်ရေးသားပါ</div>
        <div>အနည်းဆုံး တစ်ပတ်လျှင် Task 1 နှင့် Task 2 တစ်ခုစီကို ရေးသားပြီး ဆရာတစ်ဦး သို့မဟုတ် အင်္ဂလိပ်ဘာသာစကားကျွမ်းကျင်သူတစ်ဦးထံမှ အကြံပြုချက်ရယူပါ။</div>
      </>
    ),
    cta: "See Writing Tips"
  },
  {
    key: "speaking",
    title: "Speaking Section အတွက် ပြင်ဆင်နည်း",
    svg: SpeakingSVG,
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600",
    content: (
      <>
        <div>Speaking အပိုင်းသည် မိနစ် ၁၁ မှ ၁၄ မိနစ်အထိ ကြာမြင့်ပြီး အင်တာဗျူးပုံစံဖြင့် စစ်ဆေးသည်။ ဤအပိုင်းတွင် အပိုင်း ၃ ပိုင်းပါဝင်သည်- မိတ်ဆက်နှင့် အင်တာဗျူး၊ တစ်ဦးချင်းပြောဆိုမှု၊ နှင့် ဆွေးနွေးမှု။</div>
        <ul className="list-none pl-0 space-y-3">
          <li><span className="font-bold">အင်္ဂလိပ်စကားပြောကို လေ့ကျင့်ပါ</span><br /><span>အင်္ဂလိပ်စကားပြောသူများနှင့် စကားပြောဆိုရန် အခွင့်အလမ်းရှာပါ Language exchange ပရိုဂရမ်များ သို့မဟုတ် အွန်လိုင်းပလက်ဖောင်းများကို အသုံးပြုပါ (ဥပမာ- iTalki, Tandem)။</span></li>
          <li><span className="font-bold">အသံထွက်ကို အာရုံစိုက်ပါ</span><br /><span>မတိကျသော အသံထွက်သည် ရမှတ်ကို ထိခိုက်စေနိုင်သည်။ Pronunciation ကို လေ့ကျင့်ရန် အင်္ဂလိပ်စကားပြောသံများကို နားထောင်ပြီး အတုယူပါ။</span></li>
          <li><span className="font-bold">အကြောင်းအမျိုးမျိုးကို ပြင်ဆင်ထားပါ</span><br /><span>နေ့စဉ်ဘဝ၊ ပညာရေး၊ အလုပ်အကိုင်၊ ခရီးသွားခြင်း၊ နှင့် ယဉ်ကျေးမှုဆိုင်ရာ အကြောင်းအရာများကို လေ့ကျင့်ပြောဆိုပါ။ Part 2 အတွက် ၁-၂ မိနစ်ကြာ စကားပြောရန် အဆင်သင့်ဖြစ်အောင် လေ့ကျင့်ပါ။</span></li>
          <li><span className="font-bold">စိတ်လှုပ်ရှားမှုကို ထိန်းချုပ်ပါ</span><br /><span>စာမေးပွဲတွင် စိတ်လှုပ်ရှားမှုသည် ပုံမှန်ဖြစ်သည်။ အင်တာဗျူးပုံစံဖြင့် လေ့ကျင့်ခြင်းဖြင့် ယုံကြည်မှုကို တည်ဆောက်ပါ။</span></li>
        </ul>
      </>
    ),
    cta: "See Speaking Tips"
  },
  {
    key: "tips",
    title: "ယေဘုယျ အကြံပြုချက်များ",
    svg: TipsSVG,
    img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600",
    content: (
      <>
        <ul className="list-none pl-0 space-y-3">
          <li><span className="font-bold">စာမေးပွဲပုံစံကို နားလည်ပါ</span><br /><span>IELTS စာမေးပွဲ၏ ဖွဲ့စည်းပုံအား အသေးစိတ်လေ့လာပါ။ Official IELTS Practice Materials သို့မဟုတ် Cambridge IELTS စာအုပ်များကို အသုံးပြုပါ။</span></li>
          <li><span className="font-bold">အချိန်ဇယားတစ်ခု ချမှတ်ပါ</span><br /><span>တစ်ပတ်လျှင် အနည်းဆုံး ၁၀-၁၅ နာရီ လေ့ကျင့်ရန် အချိန်ဇယားတစ်ခု ပြုလုပ်ပါ။ အပိုင်းလေးပိုင်းလုံးကို မျှတစွာ လေ့ကျင့်ပါ။</span></li>
          <li><span className="font-bold">စမ်းသပ်စာမေးပွဲများဖြေဆိုပါ</span><br /><span>စမ်းသပ်စာမေးပွဲများကို ဖြေဆိုခြင်းဖြင့် သင်၏ တိုးတက်မှုကို စစ်ဆေးပါ။ အချိန်ကန့်သတ်ချက်အောက်တွင် လေ့ကျင့်ခြင်းသည် စာမေးပွဲအငွေ့အသက်ကို ရင်းနှီးစေသည်။</span></li>
          <li><span className="font-bold">အကူအညီရယူပါ</span><br /><span>IELTS သင်တန်းများ၊ ဆရာများ၊ သို့မဟုတ် အွန်လိုင်းအရင်းအမြစ်များကို အသုံးပြုပါ။ British Council, IDP, သို့မဟုတ် IELTS Liz ကဲ့သို့ ဝဘ်ဆိုဒ်များသည် အခမဲ့ အကြံပြုချက်များပေးသည်။</span></li>
          <li><span className="font-bold">ကျန်းမာရေးကို ဂရုစိုက်ပါ</span><br /><span>စာမေးပွဲမတိုင်မီ အိပ်ရေးဝဝအိပ်စက်ပြီး ကျန်းမာသော အစားအသောက်ကို စားသုံးပါ။ စိတ်ဖိစီးမှုကို လျှော့ချရန် တရားထိုင်ခြင်း သို့မဟုတ် လေ့ကျင့်ခန်းလုပ်ပါ။</span></li>
        </ul>
      </>
    ),
    cta: "See All Tips"
  },
  {
    key: "mocktests",
    title: "Mock Test Resources",
    svg: () => (
      <svg width="48" height="48" viewBox="0 0 80 80" fill="none"><rect width="80" height="80" rx="40" fill="#FFD700"/><path d="M30 40h20M40 30v20" stroke="#8B0000" strokeWidth="4" strokeLinecap="round"/></svg>
    ),
    img: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=600",
    content: (
      <>
        <p>IELTS စမ်းသပ်စာမေးပွဲများနှင့် အရင်းအမြစ်များကို အောက်ပါလင့်များတွင် ရယူနိုင်ပါသည်။</p>
        <div className="flex flex-wrap gap-3 mt-2">
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
      </>
    ),
    cta: "Try Mock Test"
  },
];

const videoLibrary = [
  {
    id: '1',
    title: 'IELTS Listening Tips & Tricks',
    description: '4 different distractors that you might encounter in the IELTS Listening Test. These distractors may cause you to make silly mistakes in the test so its important that you are ready to face them on test day.',
    youtubeId: 'hOAsUNNyPIs',
    thumbnail: 'https://img.youtube.com/vi/hOAsUNNyPIs/hqdefault.jpg',
  },
  {
    id: '2',
    title: 'How to Score Band 8 in IELTS Reading',
    description: 'Understand the IELTS Reading test to get a better score.',
    youtubeId: 'w_tIn3BGGPM',
    thumbnail: 'https://img.youtube.com/vi/w_tIn3BGGPM/hqdefault.jpg',
  },
  {
    id: '3',
    title: 'IELTS Writing Task 2: Full Essay Walkthrough',
    description: 'Understand IELTS Writing Task 2 in 5 Minutes',
    youtubeId: 'yvt8RzGNhBc',
    thumbnail: 'https://img.youtube.com/vi/yvt8RzGNhBc/hqdefault.jpg',
  },
  {
    id: '4',
    title: 'Speaking Band 9 Sample Answers',
    description: 'Achieve IELTS Speaking Band 9 with confidence! In this video.',
    youtubeId: '0L4rr7DUz-8',
    thumbnail: 'https://img.youtube.com/vi/0L4rr7DUz-8/hqdefault.jpg',
  },
  {
    id: '5',
    title: 'IELTS Preparation for Beginners',
    description: "A complete beginner's guide to the IELTS exam, including tips for each section.",
    youtubeId: '3gvJ_0qi_Tc',
    thumbnail: 'https://img.youtube.com/vi/3gvJ_0qi_Tc/hqdefault.jpg',
  },
  {
    id: '6',
    title: 'Time Management in IELTS',
    description: 'Learn how to manage your time in each section to maximize your score.',
    youtubeId: 'ZMVkP5ZD-6U',
    thumbnail: 'https://img.youtube.com/vi/ZMVkP5ZD-6U/hqdefault.jpg',
  },
  {
    id: '7',
    title: 'Common IELTS Mistakes to Avoid',
    description: 'Discover the most common mistakes candidates make and how to avoid them.',
    youtubeId: 'wYFGZWy1DsU',
    thumbnail: 'https://img.youtube.com/vi/wYFGZWy1DsU/hqdefault.jpg',
  },
];

export default function IELTSPreparation() {
  useScrollFadeIn();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center w-full font-sans">
      {/* Decorative Dots */}
      <div className="absolute top-10 left-10 w-3 h-3 bg-green-400 rounded-full opacity-30 animate-bounce-slow" />
      <div className="absolute top-1/2 right-10 w-2 h-2 bg-yellow-400 rounded-full opacity-30 animate-pulse" />
      <div className="absolute bottom-10 left-1/3 w-2 h-2 bg-green-400 rounded-full opacity-30 animate-bounce" />
      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between py-16 px-4 gap-8 relative fade-in-on-scroll opacity-0 translate-y-8 transition-all duration-700">
        <div className="flex-1 flex flex-col items-start gap-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 animate-slidein">
            IELTS <span className="text-green-500">Preparation</span> for <span className="text-yellow-500">Myanmar</span> Students
          </h1>
          <p className="text-lg text-gray-700 max-w-xl">
          IELTS အောင်မြင်မှုအတွက် ကျွမ်းကျင်သူများ၏ အကြံပြုချက်များ၊ လေ့ကျင့်ရန် စာမေးပွဲများနှင့် မြန်မာဘာသာစကား ပံ့ပိုးမှုတို့ဖြင့် ပြင်ဆင်ပါ။ နားထောင်ခြင်း၊ ဖတ်ရှုခြင်း၊ ရေးသားခြင်းနှင့် ပြောဆိုခြင်းတို့တွင် အောင်မြင်ရန် လိုအပ်သမျှ အရာများ
          </p>
          <div className="flex gap-4 mt-2">
            <Button className="rounded-full px-6 py-3 text-lg font-bold shadow-lg animate-fadein">Start Preparing</Button>
            <Button className="rounded-full px-6 py-3 text-lg font-bold bg-yellow-400 text-black hover:bg-yellow-300 animate-fadein" asChild>
              <a href="#mock-tests">Try Mock Test</a>
            </Button>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center relative">
          <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600" alt="Student" className="rounded-2xl shadow-2xl w-full max-w-xs md:max-w-sm object-cover animate-fadein" />
          <div className="absolute -top-6 -right-6 w-8 h-8 bg-green-400 rounded-full opacity-40 animate-bounce" />
        </div>
      </section>
      {/* Partners Bar */}
      <div className="w-full bg-white py-4 flex flex-wrap justify-center items-center gap-8 shadow-sm fade-in-on-scroll opacity-0 translate-y-8 transition-all duration-700">
        {partners.map((p) => (
          <img key={p.name} src={p.logo} alt={p.name} className="h-10 object-contain grayscale hover:grayscale-0 transition duration-300" />
        ))}
      </div>
      {/* IELTS Sections - Improved Cards */}
      <div className="w-full max-w-5xl flex flex-col gap-12 py-16 px-4 md:px-0">
        {/* Improved Listening Card */}
        <div className="relative group">
          {/* Accent Bar */}
          <div className="absolute left-0 top-6 bottom-6 w-2 bg-yellow-400 rounded-full z-10" />
          {/* Floating Icon */}
          <div className="absolute -left-8 top-8 z-20 shadow-lg rounded-full bg-yellow-400 w-16 h-16 flex items-center justify-center border-4 border-white group-hover:scale-110 transition-transform duration-300">
            <ListeningSVG />
          </div>
          {/* Card */}
          <div className="relative flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-2xl overflow-visible pl-12 pr-4 py-8 md:py-12 md:pl-24 md:pr-12 group-hover:-translate-y-2 transition-transform duration-300">
            {/* Content */}
            <div className="flex-1 flex flex-col justify-center gap-3 md:pr-8">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
                <span className="text-yellow-500">Listening</span> Section <span className="hidden md:inline">အတွက် ပြင်ဆင်နည်း</span>
              </h2>
              <div className="text-yellow-600 font-semibold mb-2">နားထောင်ခြင်းအတွက် အကြံပြုချက်များ</div>
              <div className="text-base text-gray-700 leading-relaxed">
                Listening အပိုင်းသည် မိနစ် ၃၀ ခန့်ကြာမြင့်ပြီး အပိုင်း ၄ ပိုင်းပါဝင်သည်။ ဤအပိုင်းတွင် အင်္ဂလိပ်စကားပြောသံများကို နားထောင်ပြီး မေးခွန်းများကို ဖြေဆိုရမည်ဖြစ်သည်။
              </div>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mt-2">
                <li><span className="font-bold">အင်္ဂလိပ်စကားပြောသံများကို နေ့စဉ်နားထောင်ပါ</span> - အင်္ဂလိပ်ဘာသာစကားဖြင့် ရုပ်ရှင်၊ ပေါ့တ်ကာစ်များ၊ TED Talks များ၊ သို့မဟုတ် BBC သတင်းများကို နားထောင်ပါ။</li>
                <li><span className="font-bold">မှတ်စုယူခြင်းကို လေ့ကျင့်ပါ</span> - နားထောင်နေစဉ် အဓိကအချက်များကို မှတ်စုယူရန် လေ့ကျင့်ပါ။</li>
                <li><span className="font-bold">မေးခွန်းပုံစံများကို ရင်းနှီးအောင်လုပ်ပါ</span> - IELTS Listening တွင် မေးခွန်းအမျိုးအစားများ အမျိုးမျိုးရှိသည်။</li>
                <li><span className="font-bold">အာရုံစူးစိုက်မှုကို မြှင့်တင်ပါ</span> - အာရုံစူးစိုက်နိုင်မှုသည် Listening အပိုင်းတွင် အရေးကြီးသည်။</li>
              </ul>
              <Button className="rounded-full mt-4 w-max px-8 py-3 bg-yellow-500 text-white font-bold shadow-lg hover:bg-yellow-400 transition-colors duration-200">See Listening Tips</Button>
            </div>
            {/* Image - Full Height */}
            <div className="flex-1 flex items-center justify-center relative mt-8 md:mt-0 h-full">
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl border-4 border-white z-10 group-hover:scale-105 transition-transform duration-300">
                <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600" alt="Students listening to lecture" className="w-full h-full object-cover" />
              </div>
              {/* Decorative Dot */}
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-yellow-300 rounded-full opacity-40 z-0" />
            </div>
          </div>
        </div>

        {/* Improved Reading Card */}
        <div className="relative group">
          {/* Accent Bar */}
          <div className="absolute left-0 top-6 bottom-6 w-2 bg-green-400 rounded-full z-10" />
          {/* Floating Icon */}
          <div className="absolute -left-8 top-8 z-20 shadow-lg rounded-full bg-green-400 w-16 h-16 flex items-center justify-center border-4 border-white group-hover:scale-110 transition-transform duration-300">
            <ReadingSVG />
          </div>
          {/* Card */}
          <div className="relative flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-2xl overflow-visible pl-12 pr-4 py-8 md:py-12 md:pl-24 md:pr-12 group-hover:-translate-y-2 transition-transform duration-300">
            {/* Content */}
            <div className="flex-1 flex flex-col justify-center gap-3 md:pr-8">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
                <span className="text-green-500">Reading</span> Section <span className="hidden md:inline">အတွက် ပြင်ဆင်နည်း</span>
              </h2>
              <div className="text-green-600 font-semibold mb-2">ဖတ်ရှုခြင်းအတွက် အကြံပြုချက်များ</div>
              <div className="text-base text-gray-700 leading-relaxed">
                Reading အပိုင်းသည် မိနစ် ၆၀ ကြာမြင့်ပြီး စာသားသုံးပုဒ်ပါဝင်သည်။ Academic နှင့် General Training ပုံစံများတွင် စာသားများသည် အနည်းငယ်ကွဲပြားသည်။
              </div>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mt-2">
                <li><span className="font-bold">အင်္ဂလိပ်စာသားများကို ပုံမှန်ဖတ်ပါ</span> - သတင်းစာ၊ မဂ္ဂဇင်းများ၊ သို့မဟုတ် သိပ္ပံဆောင်းပါးများကို ဖတ်ရှုပါ။</li>
                <li><span className="font-bold">Skimming နှင့် Scanning နည်းစနစ်များကို လေ့ကျင့်ပါ</span> - စာသား၏ အဓိကအကြောင်းအရာကို လျင်မြန်စွာ နားလည်ရန်ဖြစ်ပြီး သတ်မှတ်ထားသော အချက်အလက်များကို ရှာဖွေရန်ဖြစ်သည်။</li>
                <li><span className="font-bold">မေးခွန်းအမျိုးအစားများကို နားလည်ပါ</span> - True/False/Not Given, Matching Headings, Sentence Completion စသည့် မေးခွန်းပုံစံများကို လေ့ကျင့်ပါ။</li>
                <li><span className="font-bold">အချိန်စီမံခန့်ခွဲမှု</span> - စာသားတစ်ပုဒ်လျှင် မိနစ် ၂၀ ခန့်သာ အချိန်ရှိသည်။</li>
              </ul>
              <Button className="rounded-full mt-4 w-max px-8 py-3 bg-green-500 text-white font-bold shadow-lg hover:bg-green-400 transition-colors duration-200">See Reading Tips</Button>
            </div>
            {/* Image - Full Height */}
            <div className="flex-1 flex items-center justify-center relative mt-8 md:mt-0 h-full">
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl border-4 border-white z-10 group-hover:scale-105 transition-transform duration-300">
                <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600" alt="Students reading" className="w-full h-full object-cover" />
              </div>
              {/* Decorative Dot */}
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-green-300 rounded-full opacity-40 z-0" />
            </div>
          </div>
        </div>

        {/* Improved Writing Card */}
        <div className="relative group">
          {/* Accent Bar */}
          <div className="absolute left-0 top-6 bottom-6 w-2 bg-red-400 rounded-full z-10" />
          {/* Floating Icon */}
          <div className="absolute -left-8 top-8 z-20 shadow-lg rounded-full bg-red-400 w-16 h-16 flex items-center justify-center border-4 border-white group-hover:scale-110 transition-transform duration-300">
            <WritingSVG />
          </div>
          {/* Card */}
          <div className="relative flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-2xl overflow-visible pl-12 pr-4 py-8 md:py-12 md:pl-24 md:pr-12 group-hover:-translate-y-2 transition-transform duration-300">
            {/* Content */}
            <div className="flex-1 flex flex-col justify-center gap-3 md:pr-8">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
                <span className="text-red-500">Writing</span> Section <span className="hidden md:inline">အတွက် ပြင်ဆင်နည်း</span>
              </h2>
              <div className="text-red-600 font-semibold mb-2">ရေးသားခြင်းအတွက် အကြံပြုချက်များ</div>
              <div className="text-base text-gray-700 leading-relaxed">
                Writing အပိုင်းတွင် Task 1 နှင့် Task 2 ဟူ၍ နှစ်ပိုင်းပါဝင်ပြီး မိနစ် ၆၀ အတွင်း ပြီးစီးရမည်။ Task 1 သည် ပုံများ၊ ဇယားများကို ဖော်ပြရေးသားရပြီး Task 2 သည် အက်ဆေးရေးသားရန်ဖြစ်သည်။
              </div>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mt-2">
                <li><span className="font-bold">ဇယား၊ ဂရပ်၊ သို့မဟုတ် ပုံများကို ဖော်ပြရာတွင် အဓိကအချက်များကို ရွေးချယ်ပါ။</span></li>
                <li><span className="font-bold">နှိုင်းယှဉ်မှုနှင့် ခေတ်ရေစီးကြောင်း (Trends) ကို ဖော်ပြရန် သင်ယူပါ။</span></li>
                <li><span className="font-bold">အက်ဆေးဖွဲ့စည်းပုံကို လေ့လာပါ- Introduction, Body Paragraphs, Conclusion။</span></li>
                <li><span className="font-bold">သဒ္ဒါ၊ စကားလုံးအသုံးပြုမှု၊ နှင့် စာကြောင်းဆက်စပ်မှုကို အာရုံစိုက်ပါ။</span></li>
              </ul>
              <Button className="rounded-full mt-4 w-max px-8 py-3 bg-red-500 text-white font-bold shadow-lg hover:bg-red-400 transition-colors duration-200">See Writing Tips</Button>
            </div>
            {/* Image - Full Height */}
            <div className="flex-1 flex items-center justify-center relative mt-8 md:mt-0 h-full">
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl border-4 border-white z-10 group-hover:scale-105 transition-transform duration-300">
                <img src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600" alt="Students writing" className="w-full h-full object-cover" />
              </div>
              {/* Decorative Dot */}
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-red-300 rounded-full opacity-40 z-0" />
            </div>
          </div>
        </div>

        {/* Improved Speaking Card */}
        <div className="relative group">
          {/* Accent Bar */}
          <div className="absolute left-0 top-6 bottom-6 w-2 bg-blue-400 rounded-full z-10" />
          {/* Floating Icon */}
          <div className="absolute -left-8 top-8 z-20 shadow-lg rounded-full bg-blue-400 w-16 h-16 flex items-center justify-center border-4 border-white group-hover:scale-110 transition-transform duration-300">
            <SpeakingSVG />
          </div>
          {/* Card */}
          <div className="relative flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-2xl overflow-visible pl-12 pr-4 py-8 md:py-12 md:pl-24 md:pr-12 group-hover:-translate-y-2 transition-transform duration-300">
            {/* Content */}
            <div className="flex-1 flex flex-col justify-center gap-3 md:pr-8">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
                <span className="text-blue-500">Speaking</span> Section <span className="hidden md:inline">အတွက် ပြင်ဆင်နည်း</span>
              </h2>
              <div className="text-blue-600 font-semibold mb-2">စကားပြောဆိုခြင်းအတွက် အကြံပြုချက်များ</div>
              <div className="text-base text-gray-700 leading-relaxed">
                Speaking အပိုင်းသည် မိနစ် ၁၁ မှ ၁၄ မိနစ်အထိ ကြာမြင့်ပြီး အင်တာဗျူးပုံစံဖြင့် စစ်ဆေးသည်။ ဤအပိုင်းတွင် အပိုင်း ၃ ပိုင်းပါဝင်သည်- မိတ်ဆက်နှင့် အင်တာဗျူး၊ တစ်ဦးချင်းပြောဆိုမှု၊ နှင့် ဆွေးနွေးမှု။
              </div>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mt-2">
                <li><span className="font-bold">အင်္ဂလိပ်စကားပြောကို လေ့ကျင့်ပါ</span> - အင်္ဂလိပ်စကားပြောသူများနှင့် စကားပြောဆိုရန် အခွင့်အလမ်းရှာပါ Language exchange ပရိုဂရမ်များ သို့မဟုတ် အွန်လိုင်းပလက်ဖောင်းများကို အသုံးပြုပါ (ဥပမာ- iTalki, Tandem)။</li>
                <li><span className="font-bold">အသံထွက်ကို အာရုံစိုက်ပါ</span> - မတိကျသော အသံထွက်သည် ရမှတ်ကို ထိခိုက်စေနိုင်သည်။ Pronunciation ကို လေ့ကျင့်ရန် အင်္ဂလိပ်စကားပြောသံများကို နားထောင်ပြီး အတုယူပါ။</li>
                <li><span className="font-bold">အကြောင်းအမျိုးမျိုးကို ပြင်ဆင်ထားပါ</span> - နေ့စဉ်ဘဝ၊ ပညာရေး၊ အလုပ်အကိုင်၊ ခရီးသွားခြင်း၊ နှင့် ယဉ်ကျေးမှုဆိုင်ရာ အကြောင်းအရာများကို လေ့ကျင့်ပြောဆိုပါ။ Part 2 အတွက် ၁-၂ မိနစ်ကြာ စကားပြောရန် အဆင်သင့်ဖြစ်အောင် လေ့ကျင့်ပါ။</li>
                <li><span className="font-bold">စိတ်လှုပ်ရှားမှုကို ထိန်းချုပ်ပါ</span> - စာမေးပွဲတွင် စိတ်လှုပ်ရှားမှုသည် ပုံမှန်ဖြစ်သည်။ အင်တာဗျူးပုံစံဖြင့် လေ့ကျင့်ခြင်းဖြင့် ယုံကြည်မှုကို တည်ဆောက်ပါ။</li>
              </ul>
              <Button className="rounded-full mt-4 w-max px-8 py-3 bg-blue-500 text-white font-bold shadow-lg hover:bg-blue-400 transition-colors duration-200">See Speaking Tips</Button>
            </div>
            {/* Image - Full Height */}
            <div className="flex-1 flex items-center justify-center relative mt-8 md:mt-0 h-full">
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl border-4 border-white z-10 group-hover:scale-105 transition-transform duration-300">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600" alt="Students speaking" className="w-full h-full object-cover" />
              </div>
              {/* Decorative Dot */}
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-blue-300 rounded-full opacity-40 z-0" />
            </div>
          </div>
        </div>

        {/* Improved Tips Card */}
        <div className="relative group">
          {/* Accent Bar */}
          <div className="absolute left-0 top-6 bottom-6 w-2 bg-purple-400 rounded-full z-10" />
          {/* Floating Icon */}
          <div className="absolute -left-8 top-8 z-20 shadow-lg rounded-full bg-purple-400 w-16 h-16 flex items-center justify-center border-4 border-white group-hover:scale-110 transition-transform duration-300">
            <TipsSVG />
          </div>
          {/* Card */}
          <div className="relative flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-2xl overflow-visible pl-12 pr-4 py-8 md:py-12 md:pl-24 md:pr-12 group-hover:-translate-y-2 transition-transform duration-300">
            {/* Content */}
            <div className="flex-1 flex flex-col justify-center gap-3 md:pr-8">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
                <span className="text-purple-500">ယေဘုယျ</span> အကြံပြုချက်များ
              </h2>
              <div className="text-purple-600 font-semibold mb-2">IELTS စာမေးပွဲအတွက် အထွေထွေအကြံပြုချက်များ</div>
              <div className="text-base text-gray-700 leading-relaxed">
                IELTS စာမေးပွဲအတွက် ယေဘုယျအကြံပြုချက်များကို အောက်ပါအတိုင်း လိုက်နာပါ။
              </div>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mt-2">
                <li><span className="font-bold">စာမေးပွဲပုံစံကို နားလည်ပါ</span> - IELTS စာမေးပွဲ၏ ဖွဲ့စည်းပုံအား အသေးစိတ်လေ့လာပါ။</li>
                <li><span className="font-bold">အချိန်ဇယားတစ်ခု ချမှတ်ပါ</span> - တစ်ပတ်လျှင် အနည်းဆုံး ၁၀-၁၅ နာရီ လေ့ကျင့်ရန် အချိန်ဇယားတစ်ခု ပြုလုပ်ပါ။ အပိုင်းလေးပိုင်းလုံးကို မျှတစွာ လေ့ကျင့်ပါ။</li>
                <li><span className="font-bold">စမ်းသပ်စာမေးပွဲများဖြေဆိုပါ</span> - စမ်းသပ်စာမေးပွဲများကို ဖြေဆိုခြင်းဖြင့် သင်၏ တိုးတက်မှုကို စစ်ဆေးပါ။ အချိန်ကန့်သတ်ချက်အောက်တွင် လေ့ကျင့်ခြင်းသည် စာမေးပွဲအငွေ့အသက်ကို ရင်းနှီးစေသည်။</li>
                <li><span className="font-bold">အကူအညီရယူပါ</span> - IELTS သင်တန်းများ၊ ဆရာများ၊ သို့မဟုတ် အွန်လိုင်းအရင်းအမြစ်များကို အသုံးပြုပါ။</li>
                <li><span className="font-bold">ကျန်းမာရေးကို ဂရုစိုက်ပါ</span> - စာမေးပွဲမတိုင်မီ အိပ်ရေးဝဝအိပ်စက်ပြီး ကျန်းမာသော အစားအသောက်ကို စားသုံးပါ။ စိတ်ဖိစီးမှုကို လျှော့ချရန် တရားထိုင်ခြင်း သို့မဟုတ် လေ့ကျင့်ခန်းလုပ်ပါ။</li>
              </ul>
              <Button className="rounded-full mt-4 w-max px-8 py-3 bg-purple-500 text-white font-bold shadow-lg hover:bg-purple-400 transition-colors duration-200">See All Tips</Button>
            </div>
            {/* Image - Full Height */}
            <div className="flex-1 flex items-center justify-center relative mt-8 md:mt-0 h-full">
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl border-4 border-white z-10 group-hover:scale-105 transition-transform duration-300">
                <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600" alt="General tips" className="w-full h-full object-cover" />
              </div>
              {/* Decorative Dot */}
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-purple-300 rounded-full opacity-40 z-0" />
            </div>
          </div>
        </div>

        {/* Improved Mock Tests Card */}
        <div className="relative group">
          {/* Accent Bar */}
          <div className="absolute left-0 top-6 bottom-6 w-2 bg-indigo-400 rounded-full z-10" />
          {/* Floating Icon */}
          <div className="absolute -left-8 top-8 z-20 shadow-lg rounded-full bg-indigo-400 w-16 h-16 flex items-center justify-center border-4 border-white group-hover:scale-110 transition-transform duration-300">
            <MockTestsSVG />
          </div>
          {/* Card */}
          <div className="relative flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-2xl overflow-visible pl-12 pr-4 py-8 md:py-12 md:pl-24 md:pr-12 group-hover:-translate-y-2 transition-transform duration-300">
            {/* Content */}
            <div className="flex-1 flex flex-col justify-center gap-3 md:pr-8">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
                <span className="text-indigo-500">Mock Test</span> Resources
              </h2>
              <div className="text-indigo-600 font-semibold mb-2">IELTS စမ်းသပ်စာမေးပွဲများနှင့် အရင်းအမြစ်များ</div>
              <div className="text-base text-gray-700 leading-relaxed">
                IELTS စမ်းသပ်စာမေးပွဲများနှင့် အရင်းအမြစ်များကို အောက်ပါလင့်များတွင် ရယူနိုင်ပါသည်။
              </div>
              <div className="flex flex-wrap gap-3 mt-2">
                <Button asChild variant="secondary" className="rounded-full font-bold">
                  <a href="https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-english-practice-tests" target="_blank" rel="noopener noreferrer">British Council Mock Tests</a>
                </Button>
                <Button asChild variant="secondary" className="rounded-full font-bold">
                  <a href="https://ielts.org/take-a-test/preparation-resources/sample-test-questions" target="_blank" rel="noopener noreferrer">Official IELTS Practice Test</a>
                </Button>
                <Button asChild variant="secondary" className="rounded-full font-bold">
                  <a href="https://mocktestielts.com/" target="_blank" rel="noopener noreferrer">Mock Tests collection</a>
                </Button>
              </div>
            </div>
            {/* Image - Full Height */}
            <div className="flex-1 flex items-center justify-center relative mt-8 md:mt-0 h-full">
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl border-4 border-white z-10 group-hover:scale-105 transition-transform duration-300">
                <img src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=600" alt="Mock tests" className="w-full h-full object-cover" />
              </div>
              {/* Decorative Dot */}
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-indigo-300 rounded-full opacity-40 z-0" />
            </div>
          </div>
        </div>
      </div>
      {/* Animation keyframes and custom styles */}
      <style>{`
        .animate-fadein {
          animation: fadeInUp 1s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .animate-slidein {
          animation: slideInDown 1.2s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(32px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInDown {
          0% { opacity: 0; transform: translateY(-32px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 2.5s infinite alternate;
        }
        @keyframes bounceSlow {
          0% { transform: translateY(0); }
          100% { transform: translateY(-16px); }
        }
      `}</style>
      {/* Video Library Section */}
      <section className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center py-16 px-4 gap-6 fade-in-on-scroll opacity-0 translate-y-8 transition-all duration-700">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 animate-slidein text-center">
          IELTS <span className="text-red-500">Video Library</span>
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl text-center">
        မြန်မာကျောင်းသားများအတွက် ရွေးချယ်ထားသော အကောင်းဆုံး IELTS ပြင်ဆင်မှု ဗီဒီယိုများကို ကြည့်ရှုပါ။ ထိပ်တန်း YouTube ပညာပေးသူများထံမှ အကြံပြုချက်များ၊ ဗျူဟာများနှင့် တကယ့်စာမေးပွဲ နည်းပညာများကို လေ့လာပါ။
        </p>
      </section>
      <section className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 py-8 px-4 fade-in-on-scroll opacity-0 translate-y-8 transition-all duration-700">
        {videoLibrary.map((video, i) => (
          <div
            key={video.id}
            className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col group hover:scale-[1.03] hover:shadow-2xl transition-transform duration-300 animate-fadein"
            style={{ animationDelay: `${0.1 * i}s` }}
          >
            <div className="relative w-full aspect-video bg-black overflow-hidden">
              <iframe
                className="w-full h-full absolute top-0 left-0"
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-5 flex-1 flex flex-col gap-2">
              <h2 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-red-500 transition-colors duration-200">{video.title}</h2>
              <p className="text-gray-600 text-sm line-clamp-3">{video.description}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
} 