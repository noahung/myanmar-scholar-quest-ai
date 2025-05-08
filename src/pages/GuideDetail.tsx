
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ChevronRight, Globe } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface GuideStep {
  title: string;
  content: string;
}

interface Guide {
  id: string;
  title: string;
  description: string;
  category: string;
  country: string;
  image: string;
  steps: number;
  steps_content?: GuideStep[];
}

export default function GuideDetail() {
  const { id } = useParams<{ id: string }>();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This will be replaced with a Supabase query
    // For now, we're simulating an API call
    setLoading(true);
    
    // Simulate API fetch delay
    setTimeout(() => {
      // Mock data for development - will be replaced with actual data from Supabase
      const mockGuide = {
        id: "1",
        title: "Complete Guide to Applying for Japanese Scholarships",
        description: "A step-by-step approach to finding and applying for scholarships in Japan, with specific tips for MEXT, JICA, and university-specific programs.",
        category: "Application Process",
        country: "Japan",
        image: "/placeholder.svg",
        steps: 8,
        steps_content: [
          {
            title: "Research Available Scholarships",
            content: "Start by researching the various scholarship options available for Myanmar students in Japan. The main government scholarships are MEXT (Ministry of Education), JICA, and university-specific scholarships. Each has different eligibility requirements, application periods, and coverage. MEXT scholarships are generally announced in April with applications due in May/June. JICA scholarships often have rolling deadlines depending on the specific program."
          },
          {
            title: "Check Eligibility Requirements",
            content: "Carefully review the eligibility criteria for each scholarship you're interested in. Common requirements for Japanese scholarships include age limits (typically under 35), academic performance (GPA of at least 2.3 on the MEXT scale, which is roughly 70-80% or higher in most grading systems), language proficiency (Japanese and/or English), and relevant work experience. Some scholarships may have specific requirements related to your field of study or career goals."
          },
          {
            title: "Prepare Required Documents",
            content: "Japanese scholarship applications typically require several documents: academic transcripts, certificates of graduation, research proposal or study plan, recommendation letters from professors or employers, certificate of language proficiency, and a medical certificate. For MEXT scholarships, you'll also need to fill out specific application forms provided by the Japanese embassy. Start collecting these documents early, as some may take time to obtain, particularly official transcripts and recommendation letters."
          },
          {
            title: "Write a Strong Research Proposal",
            content: "For graduate scholarships, a research proposal is crucial. It should clearly outline your research objectives, methodology, timeline, and expected outcomes. Connect your research interests to Japan specifically - explain why you need to study in Japan and how your research will benefit both countries. Be specific about potential supervisors at Japanese universities who work in your field. Your proposal should be well-structured, concise (typically 2-3 pages), and demonstrate the significance of your research."
          },
          {
            title: "Apply Through the Correct Channels",
            content: "MEXT scholarships are usually applied through the Japanese Embassy in Myanmar. University scholarships are applied directly to the university. JICA scholarships may have specific application procedures. Follow the instructions exactly as provided by the scholarship provider. Embassy applications typically involve submitting physical documents and attending in-person interviews if shortlisted."
          },
          {
            title: "Prepare for Screening Exams and Interviews",
            content: "Many Japanese scholarships require written examinations (testing subjects related to your field and/or Japanese language) and interviews. For MEXT, you'll typically take exams in English, mathematics, and possibly Japanese language. The interview will assess your motivation, communication skills, and knowledge of Japan and your field. Practice with sample questions and prepare to discuss your research proposal in detail."
          },
          {
            title: "Connect with Potential Supervisors",
            content: "For research and graduate scholarships, it's important to establish contact with potential academic supervisors in Japan. Search for professors working in your field of interest and email them with a brief introduction, your CV, and a summary of your research proposal. Explain why you're interested in working with them specifically. Having a professor agree to supervise you can significantly strengthen your application."
          },
          {
            title: "Prepare for Life in Japan",
            content: "Once accepted, prepare for your move to Japan. This includes applying for a student visa, arranging accommodation (university dormitories or private housing), and familiarizing yourself with Japanese culture and customs. Many scholarships provide pre-departure orientations. Basic Japanese language skills will be very helpful, even if your program is taught in English. Connect with Myanmar student associations in Japan for practical advice and support networks."
          }
          {
    id: "2",
    title: "မြန်မာကျောင်းသားများအတွက် ယူကေကျောင်းသားဗီဇာလျှောက်ထားနည်း",
    description: "ယူကေကျောင်းသားဗီဇာလျှောက်ထားရာတွင် လိုအပ်သောစာရွက်စာတမ်းများ၊ ကြေးနှုန်းများနှင့် အင်တာဗျူးပြင်ဆင်မှုများအကြောင်း သိထားသင့်သမျှ",
    category: "ဗီဇာလိုအပ်ချက်များ",
    country: "ယူနိုက်တက်ကင်းဒမ်း",
    image: "/placeholder.svg",
    steps: 12,
    steps_content: [
      {
        title: "ဗီဇာအမျိုးအစားကို ရွေးချယ်ပါ",
        content: "ယူကေတွင် ကျောင်းသားဗီဇာအမျိုးအစားများအနက် သင့်လျှောက်ထားမည့်သင်တန်းအပေါ်မူတည်၍ Tier 4 (General) Student Visa သို့မဟုတ် Short-term Study Visa ကို ရွေးချယ်ပါ။ သင်တန်းကြာချိန်နှင့် သင်တန်းအမျိုးအစားပေါ်မူတည်၍ သင့်လျော်သောဗီဇာကို ဆုံးဖြတ်ပါ။"
      },
      {
        title: "လိုအပ်သောစာရွက်စာတမ်းများကို စုဆောင်းပါ",
        content: "ဗီဇာလျှောက်ထားရန်အတွက် နိုင်ငံကူးလက်မှတ်၊ ဘဏ်စာရင်းရှင်းတမ်း၊ ကျောင်းလက်ခံစာ (CAS)၊ အင်္ဂလိပ်စာအရည်အချင်းပြည့်မီမှုအထောက်အထား (ဥပမာ IELTS)၊ ဆေးကုသမှုအတွက် ကျန်းမာရေးအာမခံချက်နှင့် ဓာတ်ပုံများ လိုအပ်ပါသည်။"
      },
      {
        title: "အင်္ဂလိပ်စာစမ်းသပ်မှုကို ဖြေဆိုပါ",
        content: "ယူကေဗီဇာလျှောက်ထားရန်အတွက် IELTS UKVI သို့မဟုတ် အခြားအသိအမှတ်ပြုထားသော အင်္ဂလိပ်စာစမ်းသပ်မှုကို ဖြေဆိုရန်လိုအပ်ပါသည်။ သင်တန်းအဆင့်ပေါ်မူတည်၍ အနိမ့်ဆုံး ရမှတ်သတ်မှတ်ချက်များရှိပါသည်။"
      },
      {
        title: "ဘဏ္ဍာရေးအထောက်အထားပြသပါ",
        content: "ယူကေတွင် နေထိုင်ရန်နှင့် ပညာသင်ကြားရန်အတွက် လိုအပ်သော ဘဏ္ဍာရေးအရင်းအမြစ်များရှိကြောင်း သက်သေပြရန်လိုအပ်ပါသည်။ ဘဏ်စာရင်းရှင်းတမ်း သို့မဟုတ် အာမခံပေးသူ၏ ဘဏ္ဍာရေးစာရွက်စာတမ်းများကို တင်ပြရန်လိုအပ်ပါသည်။"
      },
      {
        title: "ဗီဇာလျှောက်လွှာကို အွန်လိုင်းတင်သွင်းပါ",
        content: "ယူကေဗီဇာလျှောက်လွှာကို အွန်လိုင်းမှတစ်ဆင့် တင်သွင်းရပါမည်။ လျှောက်လွှာဖောင်ကို ဖြည့်စွက်ပြီး လိုအပ်သောစာရွက်စာတမ်းများကို တင်သွင်းပါ။ လျှောက်လွှာကြေးပေးဆောင်ရန်လည်း လိုအပ်ပါသည်။"
      },
      {
        title: "ဇီဝမက်ထရစ်ဒေတာပေးပို့ပါ",
        content: "လျှောက်လွှာတင်သွင်းပြီးနောက် သင်၏လက်ဗွေရာနှင့် ဓာတ်ပုံများကို ဗီဇာလျှောက်လွှာစင်တာတွင် ပေးပို့ရန်လိုအပ်ပါသည်။ ရက်ချိန်းယူရန်လည်း လိုအပ်ပါသည်။"
      },
      {
        title: "အင်တာဗျူးအတွက် ပြင်ဆင်ပါ",
        content: "ဗီဇာလျှောက်လွှာတွင် အင်တာဗျူးတစ်ခုပါဝင်နိုင်ပါသည်။ သင်၏ပညာရေးအစီအစဉ်၊ ဘဏ္ဍာရေးအခြေအနေနှင့် ယူကေတွင်ပညာသင်ကြားရန် ရည်ရွယ်ချက်များအကြောင်း မေးခွန်းများကို ပြင်ဆင်ပါ။"
      },
      {
        title: "ကျန်းမာရေးအာမခံချက်ရယူပါ",
        content: "ယူကေတွင် နေထိုင်စဉ် ကျန်းမာရေးအာမခံချက်အတွက် Immigration Health Surcharge (IHS) ကို ပေးဆောင်ရပါမည်။ ၎င်းသည် ဗီဇာသက်တမ်းပေါ်မူတည်၍ ကုန်�ကျစရိတ်ကွဲပြားပါသည်။"
      },
      {
        title: "ဗီဇာဆုံးဖြတ်ချက်ကို စောင့်ဆိုင်းပါ",
        content: "ဗီဇာလျှောက်ဲွှာတင်သွင်းပြီးနောက် ဆုံးဖြတ်ချက်ကို ပုံမှန်အားဖြင့် ၃ ပတ်အတွင်း ရရှိပါသည်။ အချို့ကိစ္စများတွင် ပိုမိုကြာမြင့်နိုင်ပါသည်။"
      },
      {
        title: "ဗီဇာလက်ခံရရှိပါ",
        content: "ဗီဇာအတည်ပြုပြီးပါက သင့်နိုင်ငံကူးလက်မှတ်တွင် ဗီဇာတံဆိပ်ကို လက်ခံရရှိပါမည်။ ၎င်းကို ဗီဇာလျှောက်လွှာစင်တာမှ ထုတ်ယူပါ။"
      },
      {
        title: "ယူကေသို့ခရီးထွက်ရန် ပြင်ဆင်ပါ",
        content: "ဗီဇာရရှိပြီးနောက် ယူကေသို့ခရီးထွက်ရန် ပြင်ဆင်ပါ။ နေရာထိုင်ခင်း၊ သယ်ယူပို့ဆောင်ရေးနှင့် ယူကေယဉ်ကျေးမှုအကြောင်း လေ့လာပါ။"
      },
      {
        title: "ယူကေရောက်ရှိပြီးနောက် မှတ်ပုံတင်ပါ",
        content: "ယူကေရောက်ရှိပြီးနောက် သင့်ကျောင်းတွင် မှတ်ပုံတင်ပြီး ဒေသဆိုင်ရာအာဏာပိုင်များထံတွင် လိုအပ်ပါက မှတ်ပုံတင်ပါ။ သင့်ဗီဇာလက်မှတ်နှင့် အခြားစာရွက်စာတမ်းများကို စစ်ဆေးရန်အတွက် လိပ်စာအသေးစိတ်များကို ပေးအပ်ပါ။"
      }
    ]
  },
  {
    id: "3",
    title: "အမေရိကန်တက္ကသိုလ်များအတွက် ဆွဲဆောင်မှုရှိသော SOP ရေးသားနည်း",
    description: "အမေရိကန်ပညာရေးအခြေအနေတွင် သင်၏အောင်မြင်မှုများနှင့် ရည်မှန်းချက်များကို မီးမောင်းထိုးပြသော အားကောင်းသော Statement of Purpose ရေးသားရန် အကြံပြုချက်များနှင့် ဥပမာများ",
    category: "လျှောက်လွှာစာရွက်စာတမ်းများ",
    country: "အမေရိကန်ပြည်ထောင်စု",
    image: "/placeholder.svg",
    steps: 6,
    steps_content: [
      {
        title: "သင့်ကိုယ်ပိုင်ဇာတ်လမ်းကို ခွဲခြမ်းစိတ်ဖြာပါ",
        content: "သင်၏ပညာရေးနောက်ခံ၊ အလုပ်အတွေ့အကြုံ၊ အောင်မြင်မှုများနှင့် ရည်မှန်းချက်များကို ပြန်လည်သုံးသပ်ပါ။ သင့်ဘဝတွင် အရေးပါသောအခိုက်အတန့်များနှင့် သင့်ပညာရေးရည်မှန်းချက်များကို ပုံဖော်ပေးသော အတွေ့အကြုံများကို ဖော်ထုတ်ပါ။"
      },
      {
        title: "တက္ကသိုလ်နှင့် သင်တန်းကို သုတေသနပြုပါ",
        content: "သင်လျှောက်ထားမည့်တက္ကသိုလ်နှင့် သင်တန်း၏ ထူးခြားချက်များကို သုတေသနပြုပါ။ ၎င်းတို့၏တန်ဖိုးများ၊ သင်ရိတ်စီးဂျီများနှင့် သင့်ရည်မှန်းချက်များနှင့် မည်သို့လိုက်ဖက်သည်ကို နားလည်ပါ။"
      },
      {
        title: "ဆွဲဆောင်မှုရှိသော နိဒါန်းတစ်ခု ရေးပါ",
        content: "သင့် SOP ကို စာဖတ်သူ၏အာရုံကို ဖမ်းစွဲနိုင်သော ဆွဲဆောင်မှုရှိသော နိဒါန်းတစ်ခုဖြင့် စတင်ပါ။ ၎င်းသည် သင့်ဇာတ်လမ်းတစ်ခု၊ ကိုးကားချက်တစ်ခု သို့မဟုတ် သင့်စိတ်အားထက်သန်မှုကို ပြသသော အဖြစ်အပျက်တစ်ခု ဖြစ်နိုင်သည်။"
      },
      {
        title: "သင်၏အောင်မြင်မှုများကို မီးမောင်းထိုးပြပါ",
        content: "သင်၏ပညာရေးနှင့် ပရော်ဖက်ရှင်နယ်အောင်မြင်မှုများကို ပြသပါ။ ဤအောင်မြင်မှုများသည် သင်လျှောက်ထားသည့်သင်တန်းအတွက် မည်သို့သက်ဆိုင်သည်ကို ရှင်းပြပါ။"
      },
      {
        title: "သင်ၰရေတိုနှင့်ရေရှည်ရည်မှန်းချက်များကို ဖော်ပြပါ",
        content: "သင်ၰရေတိုနှင့်ရေရှည်ရည်မှန်းချက်များကို ဖော်ပြပါ။ ဤသင်တန်းသည် သင့်အား ထိုရည်မှန်းချက်များအောင်မြင်ရန် မည်သို့ကူညီပေးမည်ကို ရှင်းပြပါ။"
      },
      {
        title: "သင့် SOP ကို ပြန်လည်သုံးသပ်ပြီး တည်းဖြတ်ပါ",
        content: "သင့် SOP ကို ဂရုတစိုက်ပြန်လည်ဖတ်ရှုပြီး တည်းဖြတ်ပါ။ စာလုံးပေါင်းများ၊ သဒ္ဒါနှင့် စတိုင်လ်ဆိုင်ရာ အမှားများကို စစ်ဆေးပါ။ ရှင်းလင်းပြတ်သားပြီး အကျဉ်းချုပ်ဖြစ်စေရန် သေချာပါစေ။"
      }
    ]
  },
  {
    id: "4",
    title: "သြစတြေးလျတွင် ကျောင်းသားများအတွက် ဘတ်ဂျက်စီမံကိန်းရေးဆွဲခြင်း",
    description: "သြစတြေးလျတွင် ပညာသင်ကြားစဉ် နေရာထိုင်ခင်း၊ စားသောက်စရိတ်၊ သယ်ယူပို့ဆောင်ရေးနှင့် ဖျော်ဖြေရေးကုန်ကျစရိတ်များအပါအဝင် သင်၏ဘဏ္ဍာရေးကို စီမံခန့်ခွဲရန် လက်တွေ့ကျသောလမ်းညွှန်ချက်",
    category: "ပညာသင်ကြားမှုအကြံပြုချက်များ",
    country: "သြစတြေးလျ",
    image: "/placeholder.svg",
    steps: 5,
    steps_content: [
      {
        title: "ကုန်ကျစရိတ်များကို နားလည်ပါ",
        content: "သြစတြေးလျတွင် နေ့စဉ်ဘဝအတွက် ကုန်ကျစရိတ်များကို သုတေသနပြုပါ။ နေရာထိုင်ခင်း၊ စားသောက်စရိတ်၊ သယ်ယူပို့ဆောင်ရေး၊ ကျောင်းစာအုပ်များနှင့် ဖျော်ဖြေရေးကုန်ကျစရိတ်များကို ထည့်သွင်းစဉ်းစားပါ။"
      },
      {
        title: "ဘတ်ဂျက်တစ်ခု ဖန်တီးပါ",
        content: "သင်၏ဝင်ငွေနှင့် ကုန်ကျစရိတ်များကို အခြေခံ၍ လစဉ်ဘတ်ဂျက်တစ်ခု ဖန်တီးပါ။ မရှိမဖြစ်လိုအပ်သော ကုန်ကျစရိတ်များကို ဦးစားပေးပြီး သိမ်းဆည်းရန် သို့မဟုတ် အပိုကုန်ကျစရိတ်များအတွက် အချို့ကို ဖယ်ထားပါ။"
      },
      {
        title: "သက်သာသောနေရာထိုင်ခင်းရွေးချယ်မှုများကို ရှာဖွေပါ",
        content: "ကျောင်းဆောင်၊ အိမ်ငှားမှုများ သို့မဟုတ် အိမ်ထောင်စုများကဲ့သို့ သက်သာသောနေရာထိုင်ခင်းရွေးချယ်မှုများကို ရှာဖွေပါ။ ကျောင်းအနီးရှိ နေရာများသည် သယ်ယူပို့ဆောင်ရေးကုန်ကျစရိတ်ကို လျှော့ချနိုင်သည်။"
      },
      {
        title: "အပိုငွေရှာပါ",
        content: "အချိန်ပိုင်းအလုပ်များ သို့မဟုတ် ကျောင်းသင်ထောက်ပံ့မှုများမှတစ်ဆင့် အပိုဝင်ငွေရှာဖွေရန် စဉ်းစားပါ။ သြစတြေးလျတွင် ကျောင်းသားဗီဇာရှိသူများသည် သတ်မှတ်ထားသော နာရီအရေအတွက်အထိ အလုပ်လုပ်ကိုင်နိုင်သည်။"
      },
      {
        title: "လျှော့စျေးများနှင့် ချွေတာရန်နည်းလမ်းများကို အသုံးပြုပါ",
        content: "ကျောင်းသားလျှော့စျေးများ၊ အများပြည်သူသယ်ယူပို့ဆောင်ရေးနှင့် အိမ်တွင်ချက်ပြုတ်ခြင်းကဲ့သို့သော ချွေတာရန်နည်းလမ်းများကို အသုံးပြုပါ။ အသုံးမပြုသောပစ္စည်းများကို ဒုတိယအနေဖြင့် ဝယ်ယူခြင်းသည်လည်း ငွေကုန်သက်သာစေနိုင်သည်။"
      }
    ]
  },
  {
    id: "5",
    title: "ဂျာမန်ပညာသင်ဆုများအတွက် ဂျာမန်ဘာသာစကားပြင်ဆင်မှု",
    description: "ဂျာမန်ပညာသင်ဆုများအတွက် သင့်အခွင့်အလမ်းများ တိုးတက်စေရန် အခြေခံမှ အဆင့်မြင့်အထိ ဂျာမန်ဘာသာစကားသင်ယူရန် အရင်းအမြစ်များနှင့် နည်းဗျူဟာများ",
    category: "ဘာသာစကားပြင်ဆင်မှု",
    country: "ဂျာမနီ",
    image: "/placeholder.svg",
    steps: 7,
    steps_content: [
      {
        title: "သင်၏လက်ရှိအဆင့်ကို အကဲဖြတ်ပါ",
        content: "သင်၏လက်ရှိဂျာမန်ဘာသာစကားအဆင့်ကို အကဲဖြတ်ပါ။ အွန်လိုင်းစမ်းသပ်မှုများ သို့မဟုတ် ဘာသာစကားဆရာတစ်ဦးနှင့် တိုင်ပင်ဆွေးနွေးခြင်းသည် သင့်အဆင့်ကို ဆုံးဖြတ်ရန် ကူညီပေးနိုင်သည်။"
      },
      {
        title: "သင်ယူမှုအရင်းအမြစ်များကို ရှာဖွေပါ",
        content: "ဂျာမန်ဘာသာစကားသင်ယူရန်အတွက် အရင်းအမြစ်များကို ရှာဖွေပါ။ ၎င်းတို့တွင် အွန်လိုင်းသင်တန်းများ၊ အက်ပ်များ (ဥပမာ Duolingo)၊ ဖတ်စာအုပ်များ သို့မဟုတ် ဒေသဆိုင်ရာ ဘာသာစကားသင်တန်းများ ပါဝင်နိုင်သည်။"
      },
      {
        title: "လေ့ကျင့်ရန်အစီအစဉ်တစ်ခု ဖန်တီးပါ",
        content: "နေ့စဉ်ဂျာမန်ဘာသာစကားလေ့ကျင့်ရန် အစီအစဉ်တစ်ခု ဖန်တီးပါ။ ဝေါဟာရလေ့လာခြင်း၊ သဒ္ဒါလေ့ကျင့်ခန်းများပြုလုပ်ခြင်း၊ နားထောင်ခြင်းနှင့် စကားပြောခြင်းအတွက် အချိန်သတ်မှတ်ပါ။"
      },
      {
        title: "ဂျာမန်ယဉ်ကျေးမှုတွင် နှစ်မြှုပ်ပါ",
        content: "ဂျာမန်ရုပ်ရှင်များ၊ ဂီတများ၊ ပေါ့တ်ကာစ်များ သို့မဟုတ် စာအုပ်များမှတစ်ဆင့် ဂျာမန်ယဉ်ကျေးမှုတွင် နှစ်မြှုပ်ပါ။ ၎င်းသည် သင်၏ဘာသာစကားနားလည်မှုကို တိုးတက်စေပြီး သင်ယူမှုကို ပိုမိုပျော်ရွှင်စေသည်။"
      },
      {
        title: "ဘာသာစကားဖလှယ်မှုတွင် ပါဝင်ပါ",
        content: "ဂျာမန်ဘာသာစကားဖလှယ်ဖက်တစ်ဦးကို ရှာဖွေပါ သို့မဟုတ် ဒေသဆိုင်ရာဘာသာစကားအဖွဲ့များတွင် ပါဝင်ပါ။ ဂျာမန်ဘာသာစကားဖြင့် စကားပြောခြင်းသည် သင်၏ယုံကြည်မှုနှင့် ချောမွေ့မှုကို တိုးတက်စေသည်။"
      },
      {
        title: "စမ်းသပ်မှုအတွက် ပြင်ဆင်ပါ",
        content: "ဂျာမန်ပညာသင်ဆုများအတွက် ဂျာမန်ဘာသာစကားစမ်းသပ်မှု (ဥပမာ TestDaF သို့မဟုတ် Goethe-Zertifikat) လိုအပ်နိုင်သည်။ လေ့ကျင့်စမ်းသပ်မှုများပြုလုပ်ပြီး စမ်းသပ်မှုပုံစံကို ရင်းနှီးကျွမ်းဝင်ပါ။"
      },
      {
        title: "သင်ၰတိုးတက်မှုကို ခြေရာခံပါ",
        content: "သင်ၰဂျာမန်ဘာသာစကားတိုးတက်မှုကို ပုံမှန်ခြေရာခံပါ။ ပ18တိုင်များသတ်မှတ်ပြီး သင်တိုးတက်လာသည်နှင့်အမျှ ၎င်းတို့ကို ပြန်လည်သုံးသပ်ပါ။ လိုအပ်ပါက သင်ၰသင်ယူမှုနည်းဗျူဟာများကို ခ�18ညှိပါ။"
      }
    ]
  },
  {
    id: "6",
    title: "တောင်ကိုရီးယားတွင် တက္ကသိုလ်ဘဝသို့ လိုက်လျောညီထွေဖြစ်အောင်နေထိုင်ခြင်း",
    description: "မြန်မာကျောင်းသားများ တောင်ကိုရီးယားတွင် ပညာသင်ကြားရန်နှင့် နေထိုင်ရန် ပြင်ဆင်ရာတွင် ယဉ်ကျေးမှုဆိုင်ရာ ထိုးထွင်းသိမြင်မှုများနှင့် လက်တွေ့အကြံပြုချက်များ",
    category: "ယဉ်ကျေးမှုလိုက်လျောညီထွေဖြစ်အောင်နေထိုင်ခြင်း",
    country: "တောင်ကိုရီးယား",
    image: "/placeholder.svg",
    steps: 9,
    steps_content: [
      {
        title: "ကိုရီးယားယဉ်ကျေးမှုကို နားလည်ပါ",
        content: "ကိုရီးယားယဉ်ကျေးမှုၰ အဓိကရှုထောင့်များကို လေ့လာပါ။ အထူးသဖြင့် လူကြီးများကို လေးစားမှု၊ လူမှုဆက်ဆံရေးတွင် အဆင့်အတန်းနှင့် စုပေါင်းလုပ်ဆောင်မှုကို အလေးထားမှုတို့ကို နားလည်ပါ။"
      },
      {
        title: "အခြေခံကိုရီးယားဘာသာစကားကို သင်ယူပါ",
        content: "အခြေခံကိုရီးယားဘာသာစကားစကားစပ်များနှင့် ဝေါဟာရများကို သင်ယူပါ။ နှုတ်ဆက်ခြင်း၊ ကျေးဇူးတင်ကြောင်းပြောဆိုခြင်းနှင့် အခြေခံမေးခွန်းများကို သင်ယူခြင်းသည် နေ့စဉ်ဘဝကို ပိုမိုလွယ်ကူစေသည်။"
      },
      {
        title: "ကိုရီးယားအစားအစာနှင့် ရင်းနှီးပါ",
        content: "ကိုရီးယားအစားအစာနှင့် ရင်းနှီးကျွမ်းဝင်ပါ။ Kimchi၊ bibimbap နှင့် အခြားရေပန်းစားသော ဟင်းလျာများကို စမ်းသုံးကြည့်ပါ။ အစပ်သောအစားအစာများကို နှစ်သက်ရန် ပြင်ဆင်ထားပါ။"
      },
      {
        title: "ဒေသဆိုင်ရာအကျင့်ထုံးတမ်းများကို လေ့လာပါ",
        content: "ကိုရီးယားတွင် လူမှုဆက်ဆံရေးအကျင့်ထုံးတမ်းများကို လေ့လာပါ။ ဥပမာအားဖြင့် လူကြီးများအား နှစ်ဖက်လက်ဖြင့် ပစ္စည်းများပေးအပ်ခြင်း သို့မဟုတ် ဦးညွှတ်နှုတ်ဆက်ခြင်းတို့ကို လေ့လာပါ။"
      },
      {
        title: "ကျောင်းသားအသိုင်းအဝိုင်းများနှင့် ချိတ်ဆက်ပါ",
        content: "ကိုရီးယားရှိ မြန်မာကျောင်းသားအသိုင်းအဝိုင်းများ သို့မဟုတ် နိုင်ငံတကာကျောင်းသားအဖွဲ့များနှင့် ချိတ်ဆက်ပါ။ ၎င်းတို့သည် လက်တွေ့အကြံဉာဏ်များနှင့် လူမှုပံ့ပိုးမှုများကို ပေးနိုင်သည်။"
      },
      {
        title: "ရာသီဥတုနှင့် လိုက်လျောညီထွေဖြစ်အောင်နေထိုင်ပါ",
        content: "ကိုရီးယားၰ ရာသီဥတုနှင့် လိုက်လျောညီထွေဖြစ်အောင်နေထိုင်ရန် ပြင်ဆင်ပါ။ ဆောင်းရာသီသည် အေးခဲနိုင်ပြီး နွေရာသီသည် စိုစွတ်နိုင်သည်။ သင့်လျော်သောအဝတ်အစားများကို ထုပ်ပိုးပါ။"
      },
      {
        title: "ဘေးကင်းလုံခြုံမှုအကြံပြုချက်များကို လိုက်နာပါ",
        content: "ကိုရီးယားသည် ယေဘုယျအားဖြင့် ဘေးကင်းသော်လည်း အခြေခံဘေးကင်းလုံခြုံမှုအကြံပြုချက်များကို လိုက်နာပါ။ သင်ၰပတ်ဝန်းကျင်ကို သတိထားပါ၊ တန်ဖိုးရှိသောပစ္စည်းများကို လုံခြုံစွာထားပါ၊ နှင့် အရေးပေါ်နံပါတ်များကို သိထားပါ။"
      },
      {
        title: "အားလပ်ချိန်တွင် ကိုရီးယားကို စူးစမ်းပါ",
        content: "သင်ၰအားလပ်ချိန်တွင် ကိုရီးယားကို စူးစမ်းပါ။ ဆိုးလ်မြို့၊ ဘူဆန်မြို့ သို့မဟုတ် Jeju ကျွန်းသို့ သွားရောက်လည်ပတ်ပါ။ သမိုင်းဝင်နေရာများ၊ ဈေးများနှင့် သဘာဝအလှများကို ခံစားကြည့်ပါ။"
      },
      {
        title: "စိတ်ဖိစီးမှုကို စီမံခန့်ခွဲပါ",
        content: "ယဉ်ကျေးမှုအသစ်တစ်ခုသို့ လိုက်လျောညီထွေဖြစ်အောင်နေထိုင်ခြင်းသည် စိတ်ဖိစီးမှုဖြစ်စေနိုင်သည်။ စိတ်ဖိစီးမှုကို စီမံခန့်ခွဲရန် မိမိကိုယ်ကို ဂရုစိုက်ခြင်း၊ လေ့ကျင့်ခန်းလုပ်ခြင်းနှင့် သူငယ်ချင်းများ သို့မဟုတ် ကျောင်းအကြံပေးများနှင့် စကားပြောခြင်းတို့ကို လုပ်ဆောင်ပါ။"
      }
    ]
  }
        ]
      };

      if (id === "1") {
        setGuide(mockGuide);
      } else {
        setError("Guide not found");
      }
      
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return <GuideDetailSkeleton />;
  }

  if (error || !guide) {
    return (
      <div className="container py-12 flex flex-col items-center">
        <div className="max-w-3xl w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground mb-6">{error || "Guide not found"}</p>
          <Button asChild>
            <Link to="/guides">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Guides
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col max-w-3xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/guides">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Guides
            </Link>
          </Button>
        </div>

        {/* Guide header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="outline">{guide.category}</Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Globe className="h-3 w-3" /> {guide.country}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter">{guide.title}</h1>
          <p className="text-muted-foreground mt-4">{guide.description}</p>
        </div>

        <Separator className="mb-8" />

        {/* Steps */}
        <div className="space-y-8">
          {guide.steps_content?.map((step, index) => (
            <div key={index}>
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-myanmar-jade text-white flex items-center justify-center mr-3 flex-shrink-0">
                  {index + 1}
                </div>
                <h2 className="text-xl font-semibold">{step.title}</h2>
              </div>
              <div className="ml-11">
                <p className="text-muted-foreground">{step.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-between">
          <Button variant="outline" asChild disabled>
            <Link to="#">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous Guide
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="#">
              Next Guide
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function GuideDetailSkeleton() {
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col max-w-3xl mx-auto">
        <div className="mb-6">
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="mb-8">
          <div className="flex gap-2 mb-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-16 w-full" />
        </div>

        <Skeleton className="h-1 w-full mb-8" />

        <div className="space-y-8">
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index}>
              <div className="flex items-center mb-2">
                <Skeleton className="w-8 h-8 rounded-full mr-3" />
                <Skeleton className="h-7 w-1/2" />
              </div>
              <div className="ml-11">
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 flex justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}
