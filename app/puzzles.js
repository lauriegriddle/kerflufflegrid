// Kerflufflegrid Puzzles
// All puzzles with emoji collages for theme reveal

const puzzles = [
  {
    category: "Candy",
    emojis: ['🍬','🍭','🍫','🍪','🍯','🧃','🎀','✨'],
    words: [
      { word: "MINT", hint: "A refreshing flavored candy often used after dinner" },
      { word: "TAFFY", hint: "A chewy candy often sold at boardwalks and beaches" },
      { word: "GUMMY", hint: "Soft, chewy candy often shaped like bears or worms" },
      { word: "LOLLIPOP", hint: "Hard candy on a stick, a classic carnival treat" },
      { word: "CHOCOLATE", hint: "Sweet treat made from cacao beans, enjoyed worldwide" }
    ]
  },
  {
    category: "Autumn",
    emojis: ['🍂','🍁','🎃','🍎','🌾','🦃','🥧','🍄'],
    words: [
      { word: "LEAF", hint: "Tree foliage that changes color and falls in this season" },
      { word: "APPLE", hint: "Round fruit often picked at orchards in fall" },
      { word: "PUMPKIN", hint: "Large orange gourd carved for Halloween" },
      { word: "HARVEST", hint: "The gathering of crops at the end of the growing season" },
      { word: "SWEATER", hint: "Cozy knitted clothing worn when temperatures drop" }
    ]
  },
  {
    category: "Hiking",
    emojis: ['🥾','🏔️','🧭','🎒','🌲','⛰️','🦌','🏕️'],
    words: [
      { word: "BOOT", hint: "Sturdy footwear essential for trail walking" },
      { word: "TRAIL", hint: "A marked path through nature for walking" },
      { word: "SUMMIT", hint: "The highest point of a mountain" },
      { word: "COMPASS", hint: "Navigation tool that points north" },
      { word: "BACKPACK", hint: "Bag worn on shoulders to carry supplies" }
    ]
  },
  {
    category: "Dessert",
    emojis: ['🍰','🧁','🍨','🍩','🍪','🎂','🍫','🍮'],
    words: [
      { word: "TART", hint: "A pastry with fruit filling and no top crust" },
      { word: "FUDGE", hint: "Rich, creamy chocolate confection" },
      { word: "SUNDAE", hint: "Ice cream topped with sauce, whipped cream, and a cherry" },
      { word: "BROWNIE", hint: "Dense, chocolate baked square dessert" },
      { word: "CHEESECAKE", hint: "Creamy dessert with a graham cracker crust" }
    ]
  },
  {
    category: "What's in the bag?",
    emojis: ['👜','🔑','📱','👛','💄','🕶️','💳','✨'],
    words: [
      { word: "KEYS", hint: "Metal items that unlock doors and start cars" },
      { word: "PHONE", hint: "Mobile device for calls, texts, and apps" },
      { word: "WALLET", hint: "Folding case for money and cards" },
      { word: "LIPSTICK", hint: "Cosmetic applied to add color to lips" },
      { word: "SUNGLASSES", hint: "Eyewear that protects from bright light" }
    ]
  },
  {
    category: "Fruits",
    emojis: ['🍐','🥭','🍊','🍑','🍍','🍇','🍓','🍌'],
    words: [
      { word: "PEAR", hint: "A sweet fruit with a narrow top and rounded bottom" },
      { word: "MANGO", hint: "Tropical stone fruit with orange flesh" },
      { word: "ORANGE", hint: "Citrus fruit known for its vitamin C content" },
      { word: "APRICOT", hint: "Small orange stone fruit related to peaches" },
      { word: "PINEAPPLE", hint: "Tropical fruit with spiky skin and sweet yellow interior" }
    ]
  },
  {
    category: "Animals",
    emojis: ['🐻','🐯','🦒','🐘','🐊','🦁','🐒','🦓'],
    words: [
      { word: "BEAR", hint: "Large mammal that hibernates in winter" },
      { word: "TIGER", hint: "Large striped cat native to Asia" },
      { word: "GIRAFFE", hint: "Tallest land animal with a long neck" },
      { word: "ELEPHANT", hint: "Largest land mammal with a trunk" },
      { word: "ALLIGATOR", hint: "Large reptile found in swamps and rivers" }
    ]
  },
  {
    category: "Occupations",
    emojis: ['👨‍🍳','👩‍⚕️','👨‍🏫','👷‍♀️','🏗️','📐','💼','🔬'],
    words: [
      { word: "CHEF", hint: "Professional who prepares food in a restaurant" },
      { word: "NURSE", hint: "Healthcare worker who cares for patients" },
      { word: "TEACHER", hint: "Educator who instructs students in a classroom" },
      { word: "ENGINEER", hint: "Professional who designs and builds systems" },
      { word: "ARCHITECT", hint: "Designer of buildings and structures" }
    ]
  },
  {
    category: "Sports",
    emojis: ['⛳','🏉','🎾','🏊','🏀','⚽','🏈','🎯'],
    words: [
      { word: "GOLF", hint: "Sport played with clubs and a small white ball" },
      { word: "RUGBY", hint: "Contact team sport played with an oval ball" },
      { word: "TENNIS", hint: "Racquet sport played on a court with a net" },
      { word: "SWIMMING", hint: "Water sport involving moving through water" },
      { word: "BASKETBALL", hint: "Team sport where players shoot a ball through a hoop" }
    ]
  },
  {
    category: "U.S. States",
    emojis: ['🗽','🌵','🌲','🍑','🌴','🏜️','⛰️','🦅'],
    words: [
      { word: "UTAH", hint: "Western state known for its national parks" },
      { word: "TEXAS", hint: "The Lone Star State, second largest by area" },
      { word: "OREGON", hint: "Pacific Northwest state known for its forests" },
      { word: "GEORGIA", hint: "Southern state known as the Peach State" },
      { word: "CALIFORNIA", hint: "Most populous state on the West Coast" }
    ]
  },
  {
    category: "School Days",
    emojis: ['📚','✏️','🎒','🍎','📓','🔬','🎨','🏫'],
    words: [
      { word: "DESK", hint: "Furniture where students sit and work" },
      { word: "LUNCH", hint: "Midday meal eaten in the cafeteria" },
      { word: "RECESS", hint: "Break time for outdoor play" },
      { word: "SCIENCE", hint: "Subject exploring how the world works" },
      { word: "TEXTBOOK", hint: "Educational book used for studying" }
    ]
  },
  {
    category: "Trees and Shrubs",
    emojis: ['🌴','🍁','🌳','🌸','🌿','🪴','🌲','🍃'],
    words: [
      { word: "PALM", hint: "Tropical tree with large fan-shaped or feathery leaves" },
      { word: "MAPLE", hint: "Deciduous tree known for its colorful fall foliage and sweet sap" },
      { word: "BANYAN", hint: "Fig tree with aerial roots that grow down to form additional trunks" },
      { word: "JASMINE", hint: "Fragrant flowering shrub often used in perfumes and teas" },
      { word: "CINNAMON", hint: "Aromatic evergreen tree whose inner bark is used as a spice" }
    ]
  },
  {
    category: "Movie Titles",
    emojis: ['🎬','🦈','👽','❄️','🚢','💭','🎥','🍿'],
    words: [
      { word: "JAWS", hint: "1975 Spielberg thriller about a great white shark terrorizing a beach town" },
      { word: "ALIEN", hint: "1979 sci-fi horror classic with Sigourney Weaver fighting extraterrestrials" },
      { word: "FROZEN", hint: "Disney animated film featuring Elsa, Anna, and the song 'Let It Go'" },
      { word: "TITANIC", hint: "1997 epic romance about the doomed ocean liner starring DiCaprio and Winslet" },
      { word: "INCEPTION", hint: "Christopher Nolan mind-bending thriller about dreams within dreams" }
    ]
  },
  {
    category: "Colors",
    emojis: ['🔵','🟤','🟣','💚','🍷','🎨','🌈','✨'],
    words: [
      { word: "BLUE", hint: "The color of a clear sky on a sunny day" },
      { word: "BEIGE", hint: "A neutral sandy or tan shade often used in interior design" },
      { word: "INDIGO", hint: "A deep purple-blue color between blue and violet in the rainbow" },
      { word: "EMERALD", hint: "A rich green color named after a precious gemstone" },
      { word: "BURGUNDY", hint: "A deep reddish-purple wine color named after a French region" }
    ]
  },
  {
    category: "International Foods",
    emojis: ['🌮','🍣','🥘','🥟','🥐','🍝','🍜','🌯'],
    words: [
      { word: "TACO", hint: "A Mexican dish with a folded tortilla and various fillings" },
      { word: "SUSHI", hint: "Japanese dish of vinegared rice with raw fish or vegetables" },
      { word: "PAELLA", hint: "A Spanish rice dish from Valencia with seafood and saffron" },
      { word: "RAVIOLI", hint: "Italian pasta pillows filled with cheese, meat, or vegetables" },
      { word: "CROISSANT", hint: "A flaky, buttery French pastry shaped like a crescent" }
    ]
  },
  {
    category: "Games",
    emojis: ['🎲','♟️','🀄','🎯','🎮','🃏','🧩','🎰'],
    words: [
      { word: "RISK", hint: "Strategic board game of world domination with armies and dice" },
      { word: "CHESS", hint: "Ancient strategy game with kings, queens, and checkmate" },
      { word: "DOMINO", hint: "Tile game with numbered dots played by matching ends" },
      { word: "YAHTZEE", hint: "Dice game where players try to score combinations and get five of a kind" },
      { word: "SCRABBLE", hint: "Word-building board game where letter tiles score points on a grid" }
    ]
  },
  {
    category: "Cities Around the World",
    emojis: ['🗼','🏛️','🎡','🌉','🏰','✈️','🌍','🗺️'],
    words: [
      { word: "ROME", hint: "Ancient Italian city known as the Eternal City, home to the Colosseum" },
      { word: "PARIS", hint: "French capital famous for the Eiffel Tower and the Louvre Museum" },
      { word: "LONDON", hint: "UK capital on the Thames River with Big Ben and Buckingham Palace" },
      { word: "TORONTO", hint: "Canada's largest city, known for the CN Tower and multicultural neighborhoods" },
      { word: "BARCELONA", hint: "Spanish coastal city famous for Gaudí's architecture and La Rambla" }
    ]
  },
  {
    category: "Cool Weather Clothing",
    emojis: ['🧥','🧣','🧤','🎿','❄️','☃️','👢','🪵'],
    words: [
      { word: "COAT", hint: "A long outer garment worn over other clothes for warmth" },
      { word: "SCARF", hint: "A piece of fabric worn around the neck for warmth or style" },
      { word: "JACKET", hint: "A shorter outer garment that covers the upper body and arms" },
      { word: "SWEATER", hint: "A knitted garment worn on the upper body, often made of wool" },
      { word: "CASHMERE", hint: "A luxuriously soft wool fabric from the Kashmir goat" }
    ]
  },
  {
    category: "Friendship",
    emojis: ['🤝','💕','👯‍♀️','🫂','💝','🌟','🤗','✨'],
    words: [
      { word: "ALLY", hint: "A trusted friend who supports and stands by you" },
      { word: "LOYAL", hint: "Faithful and devoted through thick and thin" },
      { word: "TRUSTY", hint: "Reliable and dependable, someone you can count on" },
      { word: "SUPPORT", hint: "To give help, encouragement, and assistance to someone" },
      { word: "KINDNESS", hint: "The quality of being friendly, generous, and considerate" }
    ]
  },
  {
    category: "Art Projects",
    emojis: ['🎨','🖼️','✏️','🖌️','📐','✂️','🎭','🖍️'],
    words: [
      { word: "LINE", hint: "A mark made by a pencil, pen, or brush across a surface" },
      { word: "SHADE", hint: "The use of darkness to create depth and dimension in artwork" },
      { word: "CANVAS", hint: "A piece of cloth stretched over a frame for painting" },
      { word: "DRAWING", hint: "The art of creating images with pencils, pens, or charcoal" },
      { word: "COLLAGE", hint: "Artwork made by gluing paper, photos, and other materials together" }
    ]
  },
  {
    category: "Musicals",
    emojis: ['🎭','🎤','🎶','💃','🎹','🌟','🎪','✨'],
    words: [
      { word: "RENT", hint: "Jonathan Larson's rock musical about struggling artists in New York City" },
      { word: "EVITA", hint: "Andrew Lloyd Webber musical about Argentina's first lady Eva Perón" },
      { word: "WICKED", hint: "Musical telling the untold story of the witches of Oz" },
      { word: "COMPANY", hint: "Stephen Sondheim musical about a bachelor and his married friends in New York" },
      { word: "HAMILTON", hint: "Lin-Manuel Miranda's hip-hop musical about a founding father" }
    ]
  },
  {
    category: "Football",
    emojis: ['🏈','🏟️','🎯','🏆','📣','🥅','🔥','💪'],
    words: [
      { word: "DOWN", hint: "A play in football; teams get four tries to advance 10 yards" },
      { word: "BLITZ", hint: "A defensive play where extra players rush the quarterback" },
      { word: "CENTER", hint: "The offensive lineman who snaps the ball to the quarterback" },
      { word: "DEFENSE", hint: "The team trying to stop the other team from scoring" },
      { word: "GRIDIRON", hint: "Another name for a football field, named for its yard lines" }
    ]
  },
  {
    category: "Game Night",
    emojis: ['🎲','🃏','🎯','🏠','🍕','🎉','👨‍👩‍👧‍👦','🏆'],
    words: [
      { word: "UNO", hint: "Popular card game where players match colors and numbers" },
      { word: "CLUE", hint: "Classic murder mystery board game with suspects and weapons" },
      { word: "TWISTER", hint: "Physical game with colored circles where players contort their bodies" },
      { word: "CHECKERS", hint: "Strategy board game where pieces jump to capture opponents" },
      { word: "MONOPOLY", hint: "Real estate trading game where players buy properties and collect rent" }
    ]
  },
  {
    category: "It's a Mystery!",
    emojis: ['🔍','🕵️‍♀️','🔦','💀','🗝️','📜','❓','🚔'],
    words: [
      { word: "CLUE", hint: "A piece of evidence that helps solve a puzzle or crime" },
      { word: "CRIME", hint: "An illegal act that breaks the law" },
      { word: "ARREST", hint: "When police take someone into custody for breaking the law" },
      { word: "SUSPECT", hint: "A person believed to have committed a crime" },
      { word: "SOLUTION", hint: "The answer or resolution to a mystery or problem" }
    ]
  },
  {
    category: "Favorite Bookshop",
    emojis: ['📚','☕','📖','🪴','🛋️','✨','📕','🔖'],
    words: [
      { word: "CAFE", hint: "A cozy spot in a bookstore serving coffee and treats" },
      { word: "MERCH", hint: "Merchandise like bookmarks, tote bags, and literary-themed gifts" },
      { word: "AUTHOR", hint: "A writer who may visit to discuss and promote their books" },
      { word: "SIGNING", hint: "An event where a writer autographs copies of their book" },
      { word: "AMBIANCE", hint: "The welcoming atmosphere and character of a beloved bookshop" }
    ]
  },
  {
    category: "Thanksgiving",
    emojis: ['🦃','🥧','🍂','🌽','🥔','🍁','🙏','🍽️'],
    words: [
      { word: "MEAL", hint: "A festive feast shared with family and friends" },
      { word: "GOURD", hint: "A decorative squash often used as autumn decor" },
      { word: "GOBBLE", hint: "The distinctive sound a turkey makes" },
      { word: "HARVEST", hint: "The gathering of crops celebrated at this holiday" },
      { word: "GRATEFUL", hint: "Feeling thankful and appreciative for blessings" }
    ]
  },
  {
    category: "Music Storage",
    emojis: ['📀','💿','🎵','📼','🎧','🎹','🎶','📻'],
    words: [
      { word: "DISK", hint: "A circular storage medium for music, like CDs or vinyl" },
      { word: "TRACK", hint: "An individual song on an album or recording" },
      { word: "RECORD", hint: "A vinyl disc that plays music when spun on a turntable" },
      { word: "NAPSTER", hint: "Revolutionary file-sharing service that changed music distribution" },
      { word: "CASSETTE", hint: "Magnetic tape format popular in the 1980s and 90s" }
    ]
  },
  {
    category: "Jim Henson's Muppets",
    emojis: ['🐸','🐷','🐻','🎭','🌈','✨','🎪','💚'],
    words: [
      { word: "BIRD", hint: "Big yellow character who lives on Sesame Street" },
      { word: "PIGGY", hint: "Miss ___, glamorous diva and Kermit's love interest" },
      { word: "KERMIT", hint: "The famous green frog who sings 'Rainbow Connection'" },
      { word: "SNUFFLE", hint: "___ upagus, the woolly mammoth-like creature on Sesame Street" },
      { word: "PUPPETRY", hint: "The art of bringing characters to life with hand movements" }
    ]
  },
  {
    category: "Pizza, pizza!",
    emojis: ['🍕','🧀','🍅','🌶️','🍄','🫒','🔥','😋'],
    words: [
      { word: "MEAT", hint: "A savory protein topping category for pizza" },
      { word: "SAUCE", hint: "Tomato-based spread that goes on the dough" },
      { word: "TOMATO", hint: "Red fruit used as the base for pizza sauce" },
      { word: "SAUSAGE", hint: "Spiced ground meat topping, often Italian-style" },
      { word: "MUSHROOM", hint: "Earthy fungus that's a popular vegetable topping" }
    ]
  },
  {
    category: "Video Games",
    emojis: ['🎮','👾','🕹️','🏆','💥','🎯','🚀','🔥'],
    words: [
      { word: "PONG", hint: "Classic table tennis video game from the 1970s" },
      { word: "ATARI", hint: "Iconic gaming company that pioneered home video game consoles" },
      { word: "ARCADE", hint: "Entertainment venue filled with coin-operated game machines" },
      { word: "CONSOLE", hint: "Home gaming device that connects to a TV" },
      { word: "JOYSTICK", hint: "Hand-held controller used to navigate games" }
    ]
  }
];

// Get a random puzzle
export function getRandomPuzzle() {
  const randomIndex = Math.floor(Math.random() * puzzles.length);
  return puzzles[randomIndex];
}

export default puzzles;
