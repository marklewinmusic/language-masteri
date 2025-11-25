import React, { useState } from "react";
import { Play, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import YouTubePlayer from "../components/practice/YouTubePlayer";
import ClozeFlashcard from "../components/videos/ClozeFlashcard";
import ParrotMascot from "../components/mascot/ParrotMascot";

const videoData = [
  {
    title: "בן העשיר והעבד החמדן - The Rich Man's Son & The Greedy Servant",
    url: "https://www.youtube.com/watch?v=0gp1WUOeKak",
    description: "A King Solomon story for kids - learn Hebrew vocabulary through an engaging animated tale",
    flashcards: [
      { sentence: "בעיר הקסומה ירושלים חי פעם _____ מופלג", blank: "rich man", answer: "עשיר", transliteration: "ashir", meaning: "rich man", fullTranslation: "In the magical city of Jerusalem once lived a very rich man" },
      { sentence: "היה לו _____ יחיד, נער חכם ונבון", blank: "son", answer: "בן", transliteration: "ben", meaning: "son", fullTranslation: "He had an only son, a wise and intelligent young man" },
      { sentence: "יום אחד יצא הבן ל_____ מעבר לים", blank: "journey", answer: "מסע", transliteration: "masa", meaning: "journey", fullTranslation: "One day the son went on a journey across the sea" },
      { sentence: "האב הזקן שחש כי ימיו _____", blank: "numbered", answer: "ספורים", transliteration: "sfurim", meaning: "numbered/counted", fullTranslation: "The old father who felt his days were numbered" },
      { sentence: "קרא ל_____ הנאמן שלו", blank: "servant", answer: "עבד", transliteration: "eved", meaning: "servant", fullTranslation: "He called his loyal servant" },
      { sentence: "שמור על _____ הרב עד שובו", blank: "property", answer: "רכוש", transliteration: "rechush", meaning: "property/wealth", fullTranslation: "Guard my great property until his return" },
      { sentence: "העבד היה _____ עד כה", blank: "loyal", answer: "נאמן", transliteration: "ne'eman", meaning: "loyal/faithful", fullTranslation: "The servant was loyal until now" },
      { sentence: "הוא חמד את ה_____ לעצמו", blank: "money", answer: "כסף", transliteration: "kesef", meaning: "money", fullTranslation: "He coveted the money for himself" },
      { sentence: "הבן היחיד _____ לביתו", blank: "returned", answer: "שב", transliteration: "shav", meaning: "returned", fullTranslation: "The only son returned to his home" },
      { sentence: "מיהר לארמונו של דוד ה_____", blank: "king", answer: "מלך", transliteration: "melech", meaning: "king", fullTranslation: "He hurried to the palace of King David" },
      { sentence: "שלמה בנו הצעיר וה_____ של דוד", blank: "wise", answer: "חכם", transliteration: "chacham", meaning: "wise", fullTranslation: "Solomon, the young and wise son of David" },
      { sentence: "דוד המלך הקשיב ב_____ רב", blank: "attention", answer: "קשב", transliteration: "keshev", meaning: "attention", fullTranslation: "King David listened with great attention" },
      { sentence: "כל אחד מהם יביא _____", blank: "witnesses", answer: "עדים", transliteration: "edim", meaning: "witnesses", fullTranslation: "Each of them should bring witnesses" },
      { sentence: "הבן שהיה _____ וטהור לב", blank: "innocent", answer: "תמים", transliteration: "tamim", meaning: "innocent/pure", fullTranslation: "The son who was innocent and pure of heart" },
      { sentence: "אנשים פחדו מהעבד ה_____", blank: "evil", answer: "רשע", transliteration: "rasha", meaning: "evil/wicked", fullTranslation: "People were afraid of the evil servant" },
      { sentence: "כיצד יוכל להוכיח את _____", blank: "his righteousness", answer: "צדקתו", transliteration: "tzidkato", meaning: "his righteousness", fullTranslation: "How could he prove his righteousness" },
      { sentence: "שלמה אמר יש לי _____ מבריק", blank: "idea", answer: "רעיון", transliteration: "ra'ayon", meaning: "idea", fullTranslation: "Solomon said I have a brilliant idea" },
      { sentence: "נפתח את _____ של האב", blank: "grave", answer: "קבר", transliteration: "kever", meaning: "grave", fullTranslation: "We will open the father's grave" },
      { sentence: "הבן האמיתי בכה ואמר _____", blank: "no", answer: "לא", transliteration: "lo", meaning: "no", fullTranslation: "The true son cried and said no" },
      { sentence: "זוהי ה_____ האמיתית!", blank: "truth", answer: "אמת", transliteration: "emet", meaning: "truth", fullTranslation: "This is the real truth!" }
    ]
  },
  {
    title: "Israeli Music Vocabulary",
    url: "https://www.youtube.com/watch?v=BmbmaWQJu18",
    description: "Learn Hebrew with Israeli singers - vocabulary about music, concerts, and artists",
    flashcards: [
      { sentence: "Ha-_____ shel Eyal Golan meyuchad meod.", blank: "singer", answer: "zamar", meaning: "singer", fullTranslation: "The singer Eyal Golan is very special." },
      { sentence: "Ani ohev et ha-_____ shel ha-muzika ha-mizrachit.", blank: "style", answer: "signon", meaning: "style", fullTranslation: "I love the style of Mizrachi music." },
      { sentence: "Ha-_____ ha-ze meod yafe ve-romantit.", blank: "song", answer: "shir", meaning: "song", fullTranslation: "This song is very beautiful and romantic." },
      { sentence: "Ani ohev _____ le-muzika be-boker.", blank: "to listen", answer: "leha'azin", meaning: "to listen", fullTranslation: "I love to listen to music in the morning." },
      { sentence: "Ha-_____ hayta meod merugeshet.", blank: "concert", answer: "hofa'a", meaning: "concert/performance", fullTranslation: "The concert was very exciting." },
      { sentence: "Yesh lo _____ meod chazak ve-yafe.", blank: "voice", answer: "kol", meaning: "voice", fullTranslation: "He has a very strong and beautiful voice." },
      { sentence: "Ha-shir ha-ze meod _____ be-Yisrael.", blank: "known/famous", answer: "mukar", meaning: "known/famous", fullTranslation: "This song is very well-known in Israel." },
      { sentence: "Ha-_____ shel ha-album asah avoda nifla'a.", blank: "producer", answer: "mafik", meaning: "producer", fullTranslation: "The producer of the album did wonderful work." },
      { sentence: "Hi _____ be-moadon kol shavu'a.", blank: "performs", answer: "mofi'a", meaning: "performs", fullTranslation: "She performs at the club every week." },
      { sentence: "Ha-_____ ha-chadash shelo yatza ha-shavu'a.", blank: "album", answer: "album", meaning: "album", fullTranslation: "His new album came out this week." },
      { sentence: "Ani rotze _____ kartisim la-hofa'a.", blank: "to buy", answer: "liknot", meaning: "to buy", fullTranslation: "I want to buy tickets for the concert." },
      { sentence: "Ha-_____ shel ha-shir meod katlani.", blank: "melody", answer: "mangina", meaning: "melody", fullTranslation: "The melody of the song is very catchy." },
      { sentence: "Hu _____ gitar meod tov.", blank: "plays", answer: "menagen", meaning: "plays (instrument)", fullTranslation: "He plays guitar very well." },
      { sentence: "Ha-_____ shelah meyuchad ve-shone.", blank: "voice", answer: "kol", meaning: "voice", fullTranslation: "Her voice is unique and different." },
      { sentence: "Ani ohev _____ shirim be-ivrit.", blank: "to sing", answer: "lashir", meaning: "to sing", fullTranslation: "I love to sing songs in Hebrew." },
      { sentence: "Ha-_____ ha-ze meod me'od matzliach.", blank: "singer", answer: "zamar", meaning: "singer", fullTranslation: "This singer is very successful." },
      { sentence: "Hem _____ be-festival ha-muzika.", blank: "performed", answer: "hofi'u", meaning: "performed", fullTranslation: "They performed at the music festival." },
      { sentence: "Ha-_____ shelcha mamash yafot.", blank: "lyrics", answer: "milim", meaning: "lyrics/words", fullTranslation: "Your lyrics are really beautiful." },
      { sentence: "Ani _____ la-radio kol ha-zman.", blank: "listen", answer: "ma'azin", meaning: "listen", fullTranslation: "I listen to the radio all the time." },
      { sentence: "Ze ha-_____ ha-achi ahav alai.", blank: "song", answer: "shir", meaning: "song", fullTranslation: "This is the song I love the most." },
      { sentence: "Ha-_____ ha-zot meod energetit.", blank: "band", answer: "lehaka", meaning: "band", fullTranslation: "This band is very energetic." },
      { sentence: "Ani holech la-_____ ha-layla.", blank: "concert", answer: "hofa'a", meaning: "concert", fullTranslation: "I'm going to the concert tonight." },
      { sentence: "Ha-_____ shelo nishma meod atzuv.", blank: "voice", answer: "kol", meaning: "voice", fullTranslation: "His voice sounds very sad." },
      { sentence: "Hi _____ pianot me-gil tza'ir.", blank: "plays", answer: "menagenet", meaning: "plays (f.)", fullTranslation: "She plays piano since a young age." },
      { sentence: "Ha-_____ ha-chadash meod muzar.", blank: "style", answer: "signon", meaning: "style", fullTranslation: "The new style is very strange." },
      { sentence: "Ani rotze _____ et ha-shir ha-ze.", blank: "to learn", answer: "lilmod", meaning: "to learn", fullTranslation: "I want to learn this song." },
      { sentence: "Ha-_____ shelah niftach be-Eifel.", blank: "performance", answer: "hofa'a", meaning: "performance", fullTranslation: "Her performance opened in the Eiffel." },
      { sentence: "Hu _____ shirim romantiyim.", blank: "writes", answer: "kotev", meaning: "writes", fullTranslation: "He writes romantic songs." },
      { sentence: "Ha-_____ ha-ze meod popular be-Yisrael.", blank: "singer", answer: "zamar", meaning: "singer", fullTranslation: "This singer is very popular in Israel." },
      { sentence: "Ani _____ le-kol sugei muzika.", blank: "listen", answer: "ma'azin", meaning: "listen", fullTranslation: "I listen to all types of music." }
    ]
  }
];

export default function Videos() {
  const [expandedVideo, setExpandedVideo] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState({});

  const handleNextCard = (videoIdx) => {
    setCurrentCardIndex(prev => ({
      ...prev,
      [videoIdx]: ((prev[videoIdx] || 0) + 1) % videoData[videoIdx].flashcards.length
    }));
  };

  const handlePrevCard = (videoIdx) => {
    setCurrentCardIndex(prev => ({
      ...prev,
      [videoIdx]: ((prev[videoIdx] || 0) - 1 + videoData[videoIdx].flashcards.length) % videoData[videoIdx].flashcards.length
    }));
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
                        <ParrotMascot size="sm" message="Let's watch & learn!" />
                        <div>
                          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                            Video Lessons
                          </h1>
                          <p className="text-gray-500">Watch and practice Hebrew with cloze flashcards</p>
                        </div>
                      </div>

        <div className="space-y-6">
          {videoData.map((video, idx) => (
            <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-violet-100 shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{video.title}</h2>
                <p className="text-gray-500 mb-4">{video.description}</p>
                <YouTubePlayer url={video.url} />
                
                <div className="mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setExpandedVideo(expandedVideo === idx ? null : idx)}
                    className="w-full border-2 border-violet-200 hover:border-violet-300 hover:bg-violet-50 rounded-xl"
                  >
                    {expandedVideo === idx ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Hide Flashcards
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Practice with {video.flashcards.length} Cloze Flashcards
                      </>
                    )}
                  </Button>
                </div>

                <AnimatePresence>
                  {expandedVideo === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6"
                    >
                      <div className="text-center mb-4 text-sm text-gray-500">
                        Card {(currentCardIndex[idx] || 0) + 1} of {video.flashcards.length}
                      </div>
                      <ClozeFlashcard 
                        flashcard={video.flashcards[currentCardIndex[idx] || 0]}
                        onNext={() => handleNextCard(idx)}
                        onPrev={() => handlePrevCard(idx)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}