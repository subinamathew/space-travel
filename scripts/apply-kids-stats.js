import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. English Kids Explanations (72 stats)
export const enKids = {
  sun: [
    'Even though people call the Sun a "yellow dwarf", it is not small at all! G2V is a special star code that means it is a bright, yellow powerhouse star in the best years of its life.',
    'The surface of the Sun is 5,500°C—hotter than 55 times your hot bath water! Deep inside its core, it is 150,000 times hotter than boiling water (~15 million °C)!',
    'The Sun is enormous! If the Sun were a huge hollow beach ball, you could fit more than one million Earths inside it like tiny glass marbles.',
    'The Sun holds 99.86% of all the stuff in our whole solar system! It is 333,000 times heavier than Earth, using its giant gravitational grip to hold all the planets in orbit.',
    'Our Sun zooms around the Milky Way galaxy at 220 kilometers every single second! That is over 700 times faster than a speeding bullet train.',
    'The Sun is 150 million kilometers away. Light from the Sun is the fastest traveler in the universe, but it still takes 8 minutes and 20 seconds to reach your eyes on Earth!',
    'The Sun is a giant spinning ball of superhot gas and plasma. Because it is not solid rock, its middle equator spins once in 25 days, but its poles take 34 days!',
    'The Sun is made of Hydrogen (H₂) and Helium (He) gases. Both are lighter than the air we breathe! The hydrogen acts like fuel in a giant nuclear furnace, creating all the light and heat that keeps Earth alive.'
  ],
  mercury: [
    'Mercury is the closest planet to the Sun! If you stood on Mercury, the Sun would look 3 times bigger in the sky than it does from Earth.',
    'Mercury is the fastest runner in space! It zooms around the Sun in just 88 days, so you would have a birthday party every 3 months on Mercury!',
    'Mercury spins like a sleepy top. One daytime on Mercury takes 176 Earth days—that is longer than a whole Mercury year! You would have to wait 6 months between breakfast and bedtime.',
    'Mercury is the baby planet of our solar system—only a little bigger than our Moon. It is covered in craters from space meteorites, looking like a giant golf ball.',
    'Even though Mercury is small, it is super heavy and dense because it has a huge ball of solid iron metal inside that fills up most of the planet!',
    'Mercury has no blanket of air! During the day, it is 4 times hotter than boiling water. But at night, it plunges to −180°C, which is 9 times colder than a kitchen freezer!',
    'Mercury has 0 moons and 0 rings! It travels so close to the Sun that the Sun’s gigantic gravity would snatch away any moon that tried to circle it.',
    'Mercury has almost no air to breathe. It only has a super-thin whisper of gas called an exosphere, made of tiny atoms kicked up by the solar wind.'
  ],
  venus: [
    'Venus is our closest neighbor planet, orbiting between Mercury and Earth. It reflects so much sunlight that it shines as the brightest object in our night sky after the Moon!',
    'Venus journeys around the Sun in about 225 Earth days. Because it is closer to the Sun than Earth is, its year is about 4 months shorter than ours.',
    'Venus spins backwards! While Earth and most planets spin counter-clockwise, Venus spins clockwise (anticlockwise from south). That means on Venus, the Sun rises in the west and sets in the east! Plus, it spins so slowly that one day on Venus is longer than its whole year!',
    'Venus is almost the exact same size as Earth—about 95% of Earth\'s width! Scientists call Venus Earth’s twin sister, but she is an oven-hot, stormy twin.',
    'Venus is almost as heavy as Earth. If you stood on Venus, gravity would feel almost identical to home, pulling you down with 91% of your normal weight.',
    'Venus is the hottest planet in the entire solar system at 465°C—nearly 5 times hotter than boiling water! Thick yellow clouds trap heat like a giant greenhouse, hot enough to melt metal like lead into puddles.',
    'Venus has 0 moons and 0 rings! Just like Mercury, any moon trying to orbit Venus would be pulled apart or stolen by the Sun’s powerful gravity.',
    'The air on Venus is thick carbon dioxide with clouds of real sulfuric battery acid! The air pressure is 92 times heavier than on Earth—it would crush a submarine flat like a soda can.'
  ],
  earth: [
    'Earth is in the cosmic Goldilocks Zone—just the right distance from the Sun so water stays liquid instead of boiling away or freezing solid. This distance is 1 AU (Astronomical Unit)!',
    'Earth takes 365 days and 6 hours to orbit the Sun. Those extra 6 hours add up every 4 years to give us a Leap Year with an extra day on February 29!',
    'Earth spins around once every 24 hours, giving us daytime for learning and playing and nighttime for sleeping. We spin counter-clockwise, so the Sun rises in the east and sets in the west!',
    'Earth is the biggest of the four rocky planets! If you could dig a tunnel straight through the center from one side to the other, it would measure 12,742 kilometers.',
    'Earth weighs about 6 sextillion tons (that is a 6 followed by 24 zeros)! That mass gives us the perfect gravity to keep our oceans on the ground and air around us.',
    'Earth has a comfy average temperature of 15°C (room temperature)! Our atmosphere works like a cozy blanket keeping living creatures warm and happy.',
    'Earth has one loyal moon named Luna! The Moon causes ocean tides to rise and fall twice a day, and lights up our night sky with its gentle silver glow.',
    'Earth has the only breathable air in the universe! It has 21% oxygen for people and animals to breathe, 78% nitrogen for plants, and an ozone layer that blocks harmful sunburn rays.'
  ],
  mars: [
    'Mars is 1.5 times farther from the Sun than Earth is. Because it is farther away from the Sun’s campfire, Mars is much colder than Earth.',
    'A Martian year lasts 687 Earth days—almost two Earth years! That means winter, spring, summer, and fall on Mars last twice as long as on Earth.',
    'A day on Mars is called a "Sol", and it lasts 24 hours and 37 minutes—almost the same as an Earth day! Robot rovers on Mars go to sleep when the Martian sun sets.',
    'Mars is about half the size of Earth. But because Mars has no oceans, its dry land area is almost the same size as all of Earth’s continents put together!',
    'Mars is only 10% as heavy as Earth. Lower weight means lower gravity: you would weigh only one-third of your Earth weight and can jump 2.6 times higher!',
    'Mars is a freezing desert! Its average temperature is −63°C, which is over 3 times colder than kitchen freezer ice. At noon near the equator it can reach 20°C, but drops to −140°C at night.',
    'Mars has two tiny, lumpy moons named Phobos and Deimos! They look like flying space potatoes. Phobos zips around Mars so fast that it rises in the west and sets in the east twice every day.',
    'The air on Mars is very thin carbon dioxide with less than 1% of Earth’s pressure. Giant reddish dust storms can whip up and cover the entire planet for months!'
  ],
  jupiter: [
    'Jupiter is 5 times farther from the Sun than Earth! Out here in deep space, sunlight is 27 times dimmer and space is very cold.',
    'It takes Jupiter nearly 12 Earth years to circle the Sun once! A kid would finish elementary school before celebrating their first Jupiter birthday.',
    'Jupiter is the fastest-spinning planet in the solar system! A whole Jupiter day lasts less than 10 hours. It spins so fast that its middle bulges out like a squished ball.',
    'Jupiter is the King of Planets—11 times wider than Earth! It is so gigantic that over 1,300 Earth globes could easily fit inside it.',
    'Jupiter is heavier than all other 7 planets put together combined, times 2.5! Its giant gravity acts like a space vacuum cleaner, pulling dangerous comets away from Earth.',
    'Jupiter’s cloud tops are −110°C, but deep in its core it is 24,000°C—hotter than 240 times boiling water! It gives off more heat into space than it gets from the Sun.',
    'Jupiter has 95 known moons! The four biggest are Ganymede (bigger than planet Mercury!), Europa (with a huge underground ocean of warm water!), Io (with 400 active volcanoes!), and Callisto.',
    'Jupiter has no solid ground—it is a giant swirling ball of Hydrogen and Helium gas! Its Great Red Spot is a monster storm bigger than Earth that has raged for over 350 years.'
  ],
  saturn: [
    'Saturn is almost 10 times farther from the Sun than Earth is! It takes sunlight about 80 minutes to travel all the way out to Saturn’s golden clouds.',
    'Saturn takes 29.5 Earth years to orbit the Sun once. You would only see two or three Saturn years during your whole life on Earth!',
    'Even though Saturn is a giant, it spins around in just 10.5 hours! This rapid spin makes Saturn wider across its middle than from top to bottom.',
    'Saturn is 9 times wider than Earth! Including its spectacular ring system, it spans 282,000 kilometers—almost the distance from Earth all the way to the Moon!',
    'Saturn is 95 times heavier than Earth, but it is the lightest planet for its size! It is less dense than water, so if you had a gigantic bathtub, Saturn would float like a rubber ducky!',
    'Saturn’s upper clouds are −140°C (7 times colder than a freezer). But deep inside its core, it is crushed so hard that temperatures reach 11,500°C (115 times boiling water)!',
    'Saturn has 146 moons—the most in the solar system! Giant moon Titan has lakes of liquid methane. Its dazzling rings are made of billions of chunks of sparkling water ice, from tiny snowflakes to house-sized icebergs!',
    'Saturn is made of light Hydrogen and Helium gas. Winds in its upper atmosphere scream past at 1,800 kilometers per hour—faster than supersonic jet fighter planes!'
  ],
  uranus: [
    'Uranus is 19 times farther from the Sun than Earth! It is so far away and faint that it was the first planet discovered using a telescope in 1781.',
    'It takes Uranus 84 Earth years to orbit the Sun once! Because its year is so long, each season (summer, fall, winter, spring) lasts 21 Earth years.',
    'Uranus has an extreme 98° tilt—it literally rolls on its side around the Sun like a bowling ball! Because it is tilted on its head, its spin is retrograde (anticlockwise/backwards). One pole gets 42 years of continuous sunshine, while the other pole gets 42 years of pitch-black winter!',
    'Uranus is 4 times wider than Earth! You could line up four Earth globes side-by-side across its middle, and 63 Earths could fit inside it.',
    'Uranus is an Ice Giant planet about 14.5 times heavier than Earth. Most of its inside is a thick slush of frozen water, ammonia, and methane ices around a rocky core.',
    'Uranus holds the record as the coldest planet in the whole solar system at −224°C! That is 11 times colder than a freezer. It has very little internal heat of its own.',
    'Uranus has 28 known moons, all named after magical characters from William Shakespeare’s plays (like Miranda and Titania)! It also has 13 dark, charcoal-colored rings.',
    'Uranus gets its beautiful cyan-blue color from methane gas in its atmosphere. Methane absorbs red light from the Sun and bounces back brilliant aquamarine blue light to our eyes!'
  ],
  neptune: [
    'Neptune is the farthest official planet, 30 times farther from the Sun than Earth! Sunlight takes over 4 hours to reach Neptune’s dark blue clouds.',
    'A year on Neptune lasts nearly 165 Earth years! Since it was discovered in 1846, Neptune has only completed one single orbit around the Sun.',
    'Even though Neptune is a massive ice giant, it spins around once every 16 hours. Because it is made of swirling gas and slush, its equator spins faster than its poles.',
    'Neptune is almost 4 times wider than Earth (just slightly smaller than Uranus, but heavier and denser). You could fit 57 Earths inside Neptune!',
    'Neptune is 17 times heavier than Earth! It is packed with a deep ocean of compressed hot water, ammonia, and methane slush over a rocky iron core.',
    'Neptune’s cloud tops are −201°C, which is 10 times colder than a kitchen freezer. It is so cold that nitrogen gas freezes into solid snow crystals!',
    'Neptune has 16 moons, led by giant icy Triton. Triton is extraordinary: it orbits backwards (anticlockwise/retrograde) in the opposite direction of Neptune’s spin! That proves Triton was an icy dwarf planet captured from the Kuiper Belt! Triton even shoots real nitrogen ice volcanoes into space.',
    'Neptune has the wildest, fastest winds in the solar system, howling past at over 2,100 kilometers per hour (faster than a supersonic jet!) with deep azure blue clouds.'
  ]
};

// 2. Multilingual Translations
export const translationsKids = {
  de: {
    sun: [
      'Obwohl man die Sonne einen "gelben Zwerg" nennt, ist sie überhaupt nicht winzig! G2V ist ein Sternen-Code, der bedeutet, dass sie ein leuchtender gelber Kraftstern in ihren besten Jahren ist.',
      'Die Oberfläche der Sonne ist 5.500°C heiß—heißer als 55-mal dein heißes Badewasser! Tief im Kern ist sie 150.000-mal heißer als kochendes Wasser (~15 Millionen °C)!',
      'Die Sonne ist gigantisch! Wäre sie ein riesiger hohler Wasserball, würden über eine Million Erden wie kleine Murmeln hineinpassen.',
      'Die Sonne besitzt 99,86% der gesamten Masse unseres Sonnensystems! Sie ist 333.000-mal schwerer als die Erde und hält alle Planeten mit ihrer Riesenkraft auf ihrer Bahn.',
      'Unsere Sonne rast mit 220 Kilometern pro Sekunde um die Milchstraße! Das ist über 700-mal schneller als ein Hochgeschwindigkeitszug.',
      'Die Sonne ist 150 Millionen Kilometer entfernt. Sonnenlicht ist das Schnellste im Universum, braucht aber trotzdem 8 Minuten und 20 Sekunden bis zu deinen Augen auf der Erde!',
      'Die Sonne ist ein wirbelnder Riesenball aus heißem Gas und Plasma. Weil sie nicht aus festem Gestein besteht, dreht sich ihr Äquator in 25 Tagen, ihre Pole aber in 34 Tagen!',
      'Die Sonne besteht aus Wasserstoff (H₂) und Helium (He). Beide sind leichter als unsere Atemluft! Wasserstoff verbrennt in Kernfusionsfeuern und schenkt der Erde Licht und Wärme.'
    ],
    mercury: [
      'Merkur ist der sonnennächste Planet! Von dort aus würde die Sonne dreimal so riesig am Himmel leuchten wie von der Erde aus.',
      'Merkur ist der schnellste Flitzer im Weltall! In nur 88 Tagen rast er einmal um die Sonne—du hättest alle 3 Monate Geburtstag!',
      'Merkur dreht sich ganz langsam um sich selbst. Ein einziger Merkurtag dauert 176 Erdtage—das ist länger als sein ganzes Jahr!',
      'Merkur ist das Baby unter den Planeten—nur wenig größer als unser Mond. Er ist voller Krater von Weltraum-Meteoriten und sieht aus wie ein Golfball.',
      'Obwohl Merkur klein ist, ist er superschwer, weil in seinem Inneren ein gigantischer Kern aus echtem Eisenmetall steckt!',
      'Merkur hat keine Lufthülle! Tagsüber ist es 4-mal heißer als kochendes Wasser, nachts stürzt die Temperatur auf −180°C ab—9-mal kälter als ein Gefrierfach!',
      'Merkur hat 0 Monde und 0 Ringe! Er ist der Sonne so nah, dass ihre gewaltige Schwerkraft jeden Mond sofort wegreißen würde.',
      'Auf Merkur gibt es fast keine Luft zum Atmen, nur einen hauchdünnen Hauch namens Exosphäre aus winzigen Teilchen des Sonnenwinds.'
    ],
    venus: [
      'Die Venus ist unser nächster Nachbarplanet. Sie reflektiert so viel Sonnenlicht, dass sie nach dem Mond das hellste Licht am Nachthimmel ist!',
      'Die Venus umkreist die Sonne in 225 Erdtagen. Da sie näher an der Sonne ist als die Erde, ist ihr Jahr etwa 4 Monate kürzer als unseres.',
      'Die Venus dreht sich rückwärts! Während die Erde gegen den Uhrzeigersinn rotiert, dreht sich Venus im Uhrzeigersinn. Die Sonne geht dort im Westen auf und im Osten unter! Ein Venustag dauert länger als ihr ganzes Jahr!',
      'Die Venus ist fast genauso groß wie die Erde (etwa 95% der Erdbreite). Forscher nennen sie die Zwillingsschwester der Erde, aber sie ist ein glühend heißer Zwilling.',
      'Die Venus ist fast genauso schwer wie die Erde. Wenn du auf der Venus stehen würdest, würde sich dein Gewicht fast wie zu Hause anfühlen (91%).',
      'Die Venus ist mit 465°C der heißeste Planet im ganzen Sonnensystem—fast 5-mal heißer als kochendes Wasser! Dicke gelbe Wolken stauen die Hitze und bringen Blei zum Schmelzen.',
      'Die Venus besitzt 0 Monde und 0 Ringe! Genau wie bei Merkur würde die Sonne jeden Begleiter sofort entreißen.',
      'Die Luft auf der Venus besteht aus Kohlendioxid mit Wolken aus echter Batteriesäure (Schwefelsäure)! Der Luftdruck ist 92-mal höher als auf der Erde und würde ein U-Boot plattdrücken.'
    ],
    earth: [
      'Die Erde liegt in der "Goldlöckchen-Zone"—genau im richtigen Abstand zur Sonne, damit Wasser flüssig bleibt. Dieser Abstand heißt 1 Astronomische Einheit (AU)!',
      'Die Erde braucht 365 Tage und 6 Stunden für einen Sonnenumlauf. Die 6 Extrastunden ergeben alle 4 Jahre ein Schaltjahr mit dem 29. Februar!',
      'Die Erde dreht sich alle 24 Stunden einmal um sich selbst. Wir drehen uns gegen den Uhrzeigersinn, deshalb geht die Sonne morgens im Osten auf und abends im Westen unter!',
      'Die Erde ist der größte der vier Gesteinsplaneten! Ein Tunnel mitten durch das Zentrum würde über 12.700 Kilometer messen.',
      'Die Erde wiegt etwa 6 Trillionen Tonnen (eine 6 mit 24 Nullen)! Diese Masse schenkt uns die perfekte Schwerkraft, die Ozeane und Luft festhält.',
      'Die Erde hat eine angenehme Durchschnittstemperatur von 15°C (Zimmertemperatur)! Unsere Atmosphäre wärmt uns wie eine kuschelige Decke.',
      'Die Erde hat einen treuen Mond! Er sorgt zweimal täglich für Ebbe und Flut in den Meeren und erhellt sanft die Nacht.',
      'Die Erde hat die einzige atembare Luft im Universum: 21% Sauerstoff für Mensch und Tier, 78% Stickstoff für Pflanzen und eine Ozonschicht gegen Sonnenbrand.'
    ],
    mars: [
      'Der Mars ist 1,5-mal weiter von der Sonne entfernt als die Erde und deshalb viel kälter.',
      'Ein Marsjahr dauert 687 Erdtage—fast zwei ganze Erdenjahre! Frühling, Sommer, Herbst und Winter dauern doppelt so lange wie bei uns.',
      'Ein Marstag heißt "Sol" und dauert 24 Stunden und 37 Minuten—fast genau wie ein Erdtag! Roboter auf dem Mars schlafen, wenn die Sonne untergeht.',
      'Der Mars ist etwa halb so breit wie die Erde. Weil er keine Ozeane hat, ist sein trockenes Land genauso groß wie alle Kontinente der Erde zusammen!',
      'Der Mars wiegt nur ein Zehntel der Erde. Geringere Schwerkraft bedeutet: Du wiegst nur ein Drittel und kannst 2,6-mal höher hüpfen!',
      'Der Mars ist eine eisige Wüste mit durchschnittlich −63°C—über 3-mal kälter als Gefrierfacheis. Nachts sinkt es sogar auf −140°C.',
      'Der Mars hat zwei kleine Kartoffelmonde namens Phobos und Deimos! Phobos flitzt so schnell, dass er zweimal am Tag im Westen auf- und im Osten untergeht.',
      'Die Marsluft ist sehr dünn und besteht aus Kohlendioxid. Riesige rote Staubstürme können den ganzen Planeten monatelang einhüllen!'
    ],
    jupiter: [
      'Jupiter ist 5-mal weiter von der Sonne entfernt als die Erde. Hier draußen ist das Sonnenlicht 27-mal schwächer und der Weltraum eiskalt.',
      'Jupiter braucht fast 12 Erdenjahre für eine Sonnenumrundung! Ein Kind wäre fast mit der Grundschule fertig, bevor sein erster Jupiter-Geburtstag ansteht.',
      'Jupiter dreht sich am schnellsten von allen Planeten! Ein ganzer Tag dauert weniger als 10 Stunden, wodurch er wie ein zusammengedrückter Ball aussieht.',
      'Jupiter ist der König der Planeten—11-mal breiter als die Erde! Über 1.300 Erdkugeln würden locker in seinen Bauch passen.',
      'Jupiter ist 2,5-mal schwerer als alle anderen 7 Planeten zusammen! Seine Riesenanziehung saugt gefährliche Kometen auf und beschützt die Erde.',
      'Jupiters Wolkendecke hat −110°C, aber im Kern herrschen 24.000°C—heißer als 240-mal kochendes Wasser!',
      'Jupiter hat 95 Monde! Die vier größten sind Ganymed (größer als Merkur!), Europa (mit riesigem Warmwasserozean!), Io (mit 400 Vulkanen!) und Kallisto.',
      'Jupiter hat keinen festen Boden—er ist ein Gasriese aus Wasserstoff und Helium! Sein Großer Roter Fleck ist ein Riesensturm, größer als die Erde.'
    ],
    saturn: [
      'Saturn ist fast 10-mal weiter von der Sonne entfernt als die Erde! Sonnenlicht braucht 80 Minuten bis zu seinen goldenen Wolken.',
      'Saturn braucht fast 30 Erdenjahre für eine Sonnenrunde. In deinem ganzen Leben erlebst du nur zwei oder drei Saturnjahre!',
      'Obwohl Saturn riesig ist, dreht er sich in nur 10,5 Stunden einmal um sich selbst und wölbt sich am Äquator nach außen.',
      'Saturn ist 9-mal breiter als die Erde! Samt seinen Ringen misst er 282.000 Kilometer—fast der Abstand von der Erde bis zum Mond!',
      'Saturn ist 95-mal schwerer als die Erde, aber leichter als Wasser! In einer gigantischen Badewanne würde Saturn wie ein Badeentchen schwimmen!',
      'Saturns obere Wolken haben −140°C (7-mal kälter als ein Gefrierfach), doch in seinem gepressten Kern herrschen 11.500°C (115-mal kochendes Wasser)!',
      'Saturn ist mit 146 Monden Rekordhalter! Seine magischen Ringe bestehen aus Milliarden glitzernden Eisbrocken von Schneeflocken bis Hausgröße.',
      'Saturn besteht aus leichten Gasen. Seine Winde fegen mit 1.800 km/h über den Planeten—schneller als Überschalljets!'
    ],
    uranus: [
      'Uranus ist 19-mal weiter von der Sonne entfernt als die Erde. Er war 1781 der erste Planet, der mit einem Teleskop entdeckt wurde.',
      'Uranus braucht 84 Erdenjahre für einen Umlauf! Jede Jahreszeit dauert unglaubliche 21 Erdenjahre lang.',
      'Uranus rollt wie eine Bowlingkugel seitwärts um die Sonne! Mit seiner 98°-Kippung rotiert er rückwärts (im Uhrzeigersinn). Ein Pol hat 42 Jahre Dauer-Sonne, der andere 42 Jahre eiskalte Nacht!',
      'Uranus ist 4-mal breiter als die Erde! Vier Erden passen nebeneinander über seinen Äquator, und 63 Erden passen in sein Inneres.',
      'Uranus ist ein Eisriese aus Wasser-, Ammoniak- und Methan-Eis, etwa 14,5-mal schwerer als die Erde.',
      'Uranus ist mit −224°C der kälteste Planet im Sonnensystem—11-mal kälter als ein Gefrierfach!',
      'Uranus hat 28 Monde, benannt nach Figuren aus William Shakespeares Theaterstücken (wie Titania und Miranda), sowie 13 dunkle Ringe.',
      'Uranus leuchtet cyanblau wegen Methangas in seiner Luft. Methan schluckt rotes Sonnenlicht und wirft leuchtendes Blau-Grün zurück.'
    ],
    neptune: [
      'Neptun ist der fernste Planet, 30-mal weiter von der Sonne entfernt als die Erde! Sonnenlicht braucht über 4 Stunden dorthin.',
      'Ein Neptunjahr dauert 165 Erdenjahre! Seit seiner Entdeckung 1846 hat Neptun erst eine einzige Sonnenrunde vollendet.',
      'Neptun dreht sich alle 16 Stunden um sich selbst. Weil er aus wirbelndem Gas und Eismatsch besteht, dreht sich die Mitte schneller als die Pole.',
      'Neptun ist fast 4-mal so breit wie die Erde und fasst 57 Erdkugeln in seinem stürmischen Inneren.',
      'Neptun wiegt das 17-fache der Erde und besitzt einen tiefen Ozean aus heißem, zusammengepresstem Wasser- und Methan-Schlick.',
      'Neptuns Wolken haben −201°C—10-mal kälter als ein Gefrierfach! Es ist so eisig, dass Stickstoff zu Eiskristallen erstarrt.',
      'Neptun hat 16 Monde, angeführt von Triton. Triton umkreist Neptun rückwärts (im Uhrzeigersinn/retrograd) gegen Neptuns Drehung! Er war ein Zwergplanet, den Neptun eingefangen hat, und schießt echte Eis-Geysire ins All!',
      'Auf Neptun toben die schnellsten Winde im Sonnensystem mit über 2.100 km/h—schneller als ein Überschallflugzeug!'
    ]
  },
  fr: {
    sun: [
      'Même si on l\'appelle "naine jaune", le Soleil n\'est pas petit du tout ! G2V est un code d\'étoile signifiant qu\'il s\'agit d\'une étoile jaune brillante et puissante au sommet de sa vie.',
      'La surface du Soleil atteint 5 500 °C—plus chaude que 55 fois l\'eau de ton bain chaud ! Au cœur, il fait 150 000 fois plus chaud que l\'eau bouillante (~15 millions de °C) !',
      'Le Soleil est gigantesque ! S\'il était un ballon de plage géant creux, on pourrait y faire entrer plus d\'un million de Terres comme de petites billes.',
      'Le Soleil contient 99,86 % de toute la matière de notre système solaire ! Il est 333 000 fois plus lourd que la Terre et maintient toutes les planètes en orbite grâce à sa super gravité.',
      'Notre Soleil file autour de la Voie lactée à 220 kilomètres par seconde ! C\'est plus de 700 fois plus rapide qu\'un TGV.',
      'Le Soleil est à 150 millions de kilomètres. La lumière est la chose la plus rapide de l\'univers, mais elle met quand même 8 minutes et 20 secondes pour arriver jusqu\'à tes yeux sur Terre !',
      'Le Soleil est une boule géante de gaz et de plasma brûlants en rotation. Comme il n\'est pas solide, son équateur tourne en 25 jours mais ses pôles en 34 jours !',
      'Le Soleil est composé d\'hydrogène (H₂) et d\'hélium (He). Les deux sont plus légers que l\'air qu\'on respire ! L\'hydrogène sert de carburant nucléaire pour nous éclairer et nous chauffer.'
    ],
    mercury: [
      'Mercure est la planète la plus proche du Soleil ! Si tu te trouvais dessus, le Soleil apparaîtrait 3 fois plus grand dans le ciel que depuis la Terre.',
      'Mercure est la championne de vitesse ! Elle fait le tour du Soleil en 88 jours seulement : tu fêterais ton anniversaire tous les 3 mois !',
      'Mercure tourne très lentement sur elle-même. Un seul jour sur Mercure dure 176 jours terrestres—c\'est plus long qu\'une année entière de Mercure !',
      'Mercure est le bébé des planètes, à peine plus grande que notre Lune. Elle est couverte de cratères d\'astéroïdes et ressemble à une balle de golf.',
      'Même si Mercure est petite, elle est très lourde et dense car elle abrite une énorme boule de fer métallique qui remplit l\'essentiel de la planète !',
      'Mercure n\'a pas d\'atmosphère ! Le jour, il fait 4 fois plus chaud que l\'eau bouillante, mais la nuit la température chute à −180 °C, soit 9 fois plus froid qu\'un congélateur !',
      'Mercure a 0 lune et 0 anneau ! Elle est si proche du Soleil que sa gravité géante arracherait immédiatement toute lune qui tenterait de tourner autour.',
      'Il n\'y a presque pas d\'air sur Mercure, juste une couche ultra-mince appelée exosphère formée de particules soulevées par le vent solaire.'
    ],
    venus: [
      'Vénus est notre plus proche voisine. Elle réfléchit tellement de lumière solaire qu\'elle brille plus fort que n\'importe quelle étoile dans le ciel du soir !',
      'Vénus fait le tour du Soleil en 225 jours terrestres. Comme elle est plus proche du Soleil que la Terre, son année est environ 4 mois plus courte.',
      'Vénus tourne à l\'envers ! Alors que la Terre tourne dans le sens inverse des aiguilles d\'une montre, Vénus tourne dans le sens horaire. Le Soleil s\'y lève à l\'ouest et se couche à l\'est ! Un jour y est plus long qu\'une année entière !',
      'Vénus a presque la même taille que la Terre (environ 95 % de son diamètre). Les scientifiques l\'appellent la jumelle de la Terre, mais c\'est une jumelle brûlante comme un four.',
      'Vénus est presque aussi lourde que la Terre. Si tu y marchais, la gravité te semblerait presque normale, te tirant avec 91 % de ton poids habituel.',
      'Vénus est la planète la plus chaude du système solaire à 465 °C—près de 5 fois plus chaud que l\'eau bouillante ! D\'épais nuages jaunes emprisonnent la chaleur et font fondre le plomb.',
      'Vénus a 0 lune et 0 anneau ! Comme pour Mercure, le Soleil arracherait tout satellite en orbite.',
      'L\'air de Vénus est un épais dioxyde de carbone avec des nuages d\'acide de batterie (acide sulfurique) ! La pression y est 92 fois plus forte que sur Terre et écraserait un sous-marin.'
    ],
    earth: [
      'La Terre se trouve dans la zone habitable idéale, à bonne distance pour que l\'eau reste liquide. Cette distance magique s\'appelle 1 UA (Unité Astronomique) !',
      'La Terre met 365 jours et 6 heures pour faire le tour du Soleil. Ces 6 heures en plus créent une année bissextile tous les 4 ans avec un 29 février !',
      'La Terre tourne sur elle-même toutes les 24 heures. Nous tournons dans le sens inverse des aiguilles d\'une montre, le Soleil se lève donc à l\'est et se couche à l\'ouest !',
      'La Terre est la plus grande des quatre planètes rocheuses. Un tunnel traversant son centre ferait plus de 12 700 kilomètres de long.',
      'La Terre pèse 6 sextillions de tonnes (un 6 suivi de 24 zéros) ! Cette masse crée la gravité parfaite pour garder nos océans au sol et l\'air autour de nous.',
      'La Terre a une douce température moyenne de 15 °C. Notre atmosphère agit comme une couverture douillette protégeant toutes les formes de vie.',
      'La Terre a une lune fidèle ! La Lune fait monter et descendre les marées des océans deux fois par jour et éclaire nos nuits d\'une douce lumière argentée.',
      'La Terre a le seul air respirable de l\'univers : 21 % d\'oxygène pour respirer, 78 % d\'azote pour les plantes et une couche d\'ozone contre les coups de soleil.'
    ],
    mars: [
      'Mars est 1,5 fois plus loin du Soleil que la Terre, c\'est pourquoi elle est beaucoup plus froide.',
      'Une année martienne dure 687 jours terrestres, soit presque deux années sur Terre ! Chaque saison y dure deux fois plus longtemps.',
      'Un jour sur Mars s\'appelle un "Sol" et dure 24 heures et 37 minutes, presque comme sur Terre ! Les robots explorateurs dorment dès que le soleil martien se couche.',
      'Mars est deux fois plus petite que la Terre. Mais sans aucun océan, ses terres émergées font la même surface que tous les continents terrestres réunis !',
      'Mars ne pèse qu\'un dixième de la Terre. Moins de gravité signifie que tu ne pèses qu\'un tiers de ton poids et sautes 2,6 fois plus haut !',
      'Mars est un désert glacial : −63 °C en moyenne, soit 3 fois plus froid que la glace d\'un congélateur. La nuit, le thermomètre tombe à −140 °C.',
      'Mars a deux petites lunes en forme de pommes de terre, Phobos et Déimos ! Phobos file si vite qu\'elle se lève à l\'ouest et se couche à l\'est deux fois par jour.',
      'L\'air martien est très mince et chargé de poussière rouge. Des tempêtes géantes peuvent recouvrir toute la planète pendant des mois !'
    ],
    jupiter: [
      'Jupiter est 5 fois plus loin du Soleil que la Terre. Ici, la lumière solaire est 27 fois plus faible et l\'espace est glacé.',
      'Jupiter met près de 12 ans pour faire un seul tour du Soleil ! Un enfant entrerait au collège avant de fêter son premier anniversaire jovien.',
      'Jupiter est la planète qui tourne le plus vite sur elle-même : moins de 10 heures pour un jour complet ! Cette rotation aplatit ses pôles.',
      'Jupiter est le Roi des planètes, 11 fois plus large que la Terre ! Plus de 1 300 Terres tiendraient à l\'intérieur de sa bulle gazeuse.',
      'Jupiter pèse 2,5 fois plus que toutes les 7 autres planètes réunies ! Sa gravité colossale dévie les comètes dangereuses et protège la Terre.',
      'Le sommet des nuages de Jupiter est à −110 °C, mais son cœur brûle à 24 000 °C—plus chaud que 240 fois l\'eau bouillante !',
      'Jupiter a 95 lunes ! Les 4 plus célèbres sont Ganymède (plus grande que Mercure !), Europe (avec un océan chaud sous sa glace !), Io (avec 400 volcans !) et Callisto.',
      'Jupiter n\'a aucun sol solide—c\'est une bille géante d\'hydrogène et d\'hélium ! Sa Grande Tache Rouge est un ouragan monstrueux plus gros que la Terre.'
    ],
    saturn: [
      'Saturne est presque 10 fois plus loin du Soleil que la Terre. La lumière du Soleil met 80 minutes à parvenir jusqu\'à ses nuages dorés.',
      'Saturne met près de 30 années terrestres pour faire le tour du Soleil. Tu ne vivrais que 2 ou 3 années saturniennes durant toute ta vie !',
      'Même si Saturne est géante, elle tourne sur elle-même en seulement 10 heures et demie, ce qui fait bomber son équateur.',
      'Saturne est 9 fois plus large que la Terre ! Avec ses splendides anneaux, elle s\'étend sur 282 000 kilomètres—presque la distance de la Terre à la Lune !',
      'Saturne est 95 fois plus lourde que la Terre, mais moins dense que l\'eau ! Dans une baignoire gigantesque, Saturne flotterait comme un canard en plastique !',
      'Les nuages de Saturne sont à −140 °C (7 fois plus froid qu\'un congélateur), mais son cœur comprimé monte à 11 500 °C (115 fois l\'eau bouillante) !',
      'Saturne est la reine des lunes avec 146 satellites ! Ses anneaux sont faits de milliards de morceaux de glace d\'eau pure, du flocon de neige à l\'iceberg géant.',
      'Saturne est faite de gaz très légers. Ses vents soufflent à 1 800 km/h—plus vite que des avions de chasse supersoniques !'
    ],
    uranus: [
      'Uranus est 19 fois plus loin du Soleil que la Terre. Elle a été la toute première planète découverte avec un télescope en 1781.',
      'Uranus met 84 années terrestres pour faire le tour du Soleil ! Chaque saison y dure 21 longues années terrestres.',
      'Uranus roule sur le côté comme une boule de bowling avec une inclinaison de 98° ! Sa rotation est rétrograde (dans le sens horaire). Un pôle a 42 ans de soleil continu, puis 42 ans de nuit polaire glaciale !',
      'Uranus est 4 fois plus large que la Terre. On pourrait aligner 4 Terres le long de son équateur, et 63 Terres tiendraient à l\'intérieur.',
      'Uranus est une géante de glaces d\'eau, d\'ammoniac et de méthane, environ 14,5 fois plus lourde que la Terre.',
      'Uranus détient le record de la planète la plus froide du système solaire à −224 °C, soit 11 fois plus froid qu\'un congélateur !',
      'Uranus a 28 lunes portant des noms tirés des pièces de Shakespeare (comme Titania et Ariel), ainsi que 13 anneaux sombres.',
      'Uranus doit sa superbe couleur bleu cyan au méthane dans ses nuages, qui absorbe la lumière rouge et renvoie un bleu turquoise éclatant.'
    ],
    neptune: [
      'Neptune est la planète la plus lointaine, 30 fois plus loin du Soleil que la Terre ! La lumière solaire met plus de 4 heures pour l\'atteindre.',
      'Une année sur Neptune dure près de 165 années terrestres ! Depuis sa découverte en 1846, elle n\'a accompli qu\'un seul tour du Soleil.',
      'Neptune tourne sur elle-même en 16 heures. Faite de gaz et de bouillie glacée, son équateur tourne plus vite que ses pôles.',
      'Neptune est presque 4 fois plus large que la Terre et pourrait contenir 57 globes terrestres.',
      'Neptune pèse 17 fois la Terre et renferme un immense océan de glaces chaudes comprimées au-dessus d\'un noyau de roche et de fer.',
      'Le sommet des nuages de Neptune est à −201 °C, soit 10 fois plus froid qu\'un congélateur ! Le froid y gèle même l\'azote gazeux.',
      'Neptune possède 16 lunes, dont le géant glacé Triton. Triton tourne à l\'envers (sens rétrograde) par rapport à la rotation de Neptune ! C\'était une planète naine capturée qui crache de vrais geysers de glace.',
      'Neptune possède les vents les plus violents du système solaire, soufflant à plus de 2 100 km/h avec de superbes nuages bleu azur.'
    ]
  },
  es: {
    sun: [
      '¡Aunque la llamen "enana amarilla", el Sol no es nada pequeño! G2V es un código estelar que significa que es una estrella amarilla brillante en la mejor etapa de su vida.',
      '¡La superficie del Sol está a 5.500°C, más caliente que 55 veces el agua caliente de tu baño! ¡En su núcleo alcanza 150.000 veces más calor que el agua hirviendo (~15 millones °C)!',
      '¡El Sol es gigantesco! Si fuera una pelota de playa gigante vacía, cabrían más de un millón de Tierras como pequeñas canicas dentro.',
      '¡El Sol contiene el 99,86% de toda la materia de nuestro sistema solar! Es 333.000 veces más pesado que la Tierra y su gravedad mantiene a todos los planetas en órbita.',
      '¡Nuestro Sol viaja alrededor de la Vía Láctea a 220 kilómetros por segundo! Eso es más de 700 veces más rápido que un tren bala.',
      'El Sol está a 150 millones de kilómetros. ¡La luz del Sol es lo más veloz del universo, pero aún así tarda 8 minutos y 20 segundos en llegar a tus ojos en la Tierra!',
      'El Sol es una bola gigante de gas y plasma ardiendo. Al no ser roca sólida, su ecuador gira en 25 días, pero sus polos tardan 34 días.',
      'El Sol está hecho de gases de Hidrógeno (H₂) y Helio (He), más ligeros que el aire. El hidrógeno arde en fuegos de fusión nuclear dando calor y vida a la Tierra.'
    ],
    mercury: [
      '¡Mercurio es el planeta más cercano al Sol! Desde allí, el Sol se vería 3 veces más grande en el cielo que desde la Tierra.',
      '¡Mercurio es el corredor más rápido del espacio! Da la vuelta al Sol en solo 88 días, ¡así que tendrías fiesta de cumpleaños cada 3 meses!',
      'Mercurio gira muy despacio sobre sí mismo. Un solo día en Mercurio dura 176 días terrestres: ¡más largo que todo su año!',
      'Mercurio es el bebé del sistema solar, solo un poco más grande que nuestra Luna. Está lleno de cráteres y parece una pelota de golf espacial.',
      'Aunque es pequeño, Mercurio es superpesado porque tiene una enorme bola de hierro metálico que llena casi todo su interior.',
      '¡Mercurio no tiene aire! De día hace 4 veces más calor que el agua hirviendo, pero de noche baja a −180°C: ¡9 veces más frío que un congelador!',
      '¡Mercurio tiene 0 lunas y 0 anillos! Está tan cerca del Sol que su inmensa gravedad le arrebataría cualquier luna.',
      'En Mercurio apenas hay aire, solo una capa ultrafina llamada exosfera con átomos arrancados por el viento solar.'
    ],
    venus: [
      'Venus es nuestro vecino más cercano. Refleja tanta luz que es el objeto más brillante en el cielo nocturno después de la Luna.',
      'Venus tarda 225 días terrestres en rodear al Sol. Al estar más cerca del Sol, su año dura unos 4 meses menos que el nuestro.',
      '¡Venus gira al revés! Mientras la Tierra gira en sentido antihorario, Venus gira en sentido horario. ¡El Sol sale por el oeste y se pone por el este! ¡Un día dura más que un año entero!',
      'Venus tiene casi el mismo tamaño que la Tierra (el 95% de su ancho). Los científicos la llaman la hermana gemela de la Tierra, pero es una gemela hirviente como un horno.',
      'Venus pesa casi lo mismo que la Tierra. Si estuvieras allí, tu peso se sentiría casi igual que en casa (el 91%).',
      '¡Venus es el planeta más caliente de todos a 465°C, casi 5 veces más caliente que el agua hirviendo! Nubes amarillas atrapan el calor derritiendo plomo.',
      '¡Venus tiene 0 lunas y 0 anillos! Al igual que con Mercurio, el Sol se llevaría cualquier luna.',
      'El aire de Venus es espeso dióxido de carbono con nubes de ácido de batería (ácido sulfúrico). La presión es 92 veces más fuerte que en la Tierra.'
    ],
    earth: [
      'La Tierra está en la zona perfecta donde el agua permanece líquida. ¡Esta distancia ideal se llama 1 Unidad Astronómica (UA)!',
      'La Tierra tarda 365 días y 6 horas en dar la vuelta al Sol. ¡Esas 6 horas extra forman un año bisiesto cada 4 años con un 29 de febrero!',
      'La Tierra gira cada 24 horas dándonos el día para jugar y la noche para soñar. Giramos en sentido antihorario, ¡por eso el Sol sale por el este!',
      'La Tierra es el mayor de los cuatro planetas rocosos. Un túnel por el centro mediría más de 12.700 kilómetros.',
      'La Tierra pesa 6 sextillones de toneladas (un 6 con 24 ceros), dándonos la gravedad justa para retener los océanos y el aire.',
      'La Tierra tiene una temperatura media templada de 15°C. Nuestra atmósfera nos abriga como una manta suave.',
      '¡La Tierra tiene una luna leal llamada Luna! Produce las mareas dos veces al día e ilumina la noche con brillo plateado.',
      'La Tierra tiene el único aire respirable del universo: 21% de oxígeno para respirar, 78% de nitrógeno para las plantas y capa de ozono protectora.'
    ],
    mars: [
      'Marte está 1,5 veces más lejos del Sol que la Tierra, por lo que es un mundo mucho más frío.',
      'Un año en Marte dura 687 días terrestres, ¡casi dos años de la Tierra! Las estaciones duran el doble que aquí.',
      'Un día en Marte se llama "Sol" y dura 24 horas y 37 minutos, casi igual que en la Tierra. ¡Los robots marcianos duermen cuando se pone el sol!',
      'Marte tiene la mitad del tamaño de la Tierra, pero como no tiene océanos, su tierra firme es igual a todos los continentes de la Tierra juntos.',
      'Marte pesa solo una décima parte de la Tierra. Menos gravedad significa que pesas un tercio de tu peso y saltas 2,6 veces más alto.',
      'Marte es un desierto helado con −63°C de media (más de 3 veces más frío que el congelador). Por la noche baja a −140°C.',
      '¡Marte tiene dos lunas pequeñas como patatas voladoras, Fobos y Deimos! Fobos va tan rápido que sale por el oeste y se oculta por el este dos veces al día.',
      'El aire marciano es muy fino con polvo rojo. ¡Enormes tormentas de arena pueden envolver todo el planeta durante meses!'
    ],
    jupiter: [
      'Júpiter está 5 veces más lejos del Sol que la Tierra. Aquí la luz solar es 27 veces más débil y el espacio es helado.',
      '¡Júpiter tarda casi 12 años terrestres en rodear al Sol! Un niño terminaría la escuela primaria antes de cumplir un año joviano.',
      '¡Júpiter gira más rápido que ningún otro planeta, en menos de 10 horas! Ese giro veloz aplasta sus polos ensanchando su cintura.',
      '¡Júpiter es el Rey de los Planetas, 11 veces más ancho que la Tierra! Cabrían más de 1.300 Tierras dentro de él.',
      '¡Júpiter pesa 2,5 veces más que los otros 7 planetas juntos! Su supergravedad aspira cometas peligrosos protegiendo a la Tierra.',
      'Las nubes de Júpiter están a −110°C, pero en su centro hay 24.000°C: ¡más de 240 veces más caliente que el agua hirviendo!',
      '¡Júpiter tiene 95 lunas! Las cuatro mayores son Ganímedes (¡mayor que Mercurio!), Europa (¡con un océano tibio oculto!), Ío (¡con 400 volcanes!) y Calisto.',
      'Júpiter no tiene suelo firme: ¡es una bola gigante de gas! Su Gran Mancha Roja es una tormenta gigante más grande que la Tierra.'
    ],
    saturn: [
      'Saturno está casi 10 veces más lejos del Sol que la Tierra. La luz solar tarda 80 minutos en llegar a sus nubes doradas.',
      'Saturno tarda casi 30 años terrestres en rodear al Sol. ¡En toda tu vida solo verías 2 o 3 años saturnianos!',
      'Aunque es gigantesco, Saturno gira en solo 10 horas y media, abombándose por el ecuador.',
      '¡Saturno es 9 veces más ancho que la Tierra! Con sus anillos mide 282.000 kilómetros, ¡casi la distancia de la Tierra a la Luna!',
      'Saturno pesa 95 veces más que la Tierra pero es menos denso que el agua: ¡en una bañera gigante flotaría como un patito de goma!',
      'Las nubes de Saturno están a −140°C (7 veces más frío que un congelador), pero en su núcleo hay 11.500°C (115 veces el agua hirviendo).',
      '¡Saturno tiene 146 lunas! Sus anillos están formados por miles de millones de trozos de hielo brillante, desde copos hasta icebergs gigantes.',
      'Saturno está hecho de gases ligeros. Sus vientos soplan a 1.800 km/h, ¡más veloces que aviones de combate supersónicos!'
    ],
    uranus: [
      'Urano está 19 veces más lejos del Sol que la Tierra. Fue el primer planeta descubierto con telescopio en 1781.',
      '¡Urano tarda 84 años terrestres en dar una vuelta al Sol! Cada estación dura 21 largos años.',
      '¡Urano rueda de lado como una bola de bolos inclinado 98°! Gira al revés (en sentido horario). Un polo tiene 42 años de sol continuo y el otro 42 años de noche helada.',
      'Urano es 4 veces más ancho que la Tierra. Cuatro Tierras cabrían una al lado de otra a lo largo de su ecuador, y 63 dentro de él.',
      'Urano es un Gigante de Hielo con agua, amoníaco y metano congelados, unas 14,5 veces más pesado que la Tierra.',
      '¡Urano tiene el récord del planeta más frío del sistema solar a −224°C, 11 veces más frío que un congelador!',
      'Urano tiene 28 lunas con nombres de obras de Shakespeare (como Titania y Miranda) y 13 anillos oscuros.',
      'Urano tiene un hermoso color azul cian gracias al gas metano de sus nubes, que absorbe la luz roja y refleja azul turquesa.'
    ],
    neptune: [
      'Neptuno es el planeta más lejano, ¡30 veces más lejos del Sol que la Tierra! La luz del Sol tarda más de 4 horas en llegar.',
      '¡Un año en Neptuno dura 165 años terrestres! Desde que se descubrió en 1846 solo ha dado una sola vuelta completa al Sol.',
      'Neptuno gira sobre sí mismo cada 16 horas. Al ser gas y hielo fluido, su ecuador gira más rápido que sus polos.',
      'Neptuno es casi 4 veces más ancho que la Tierra y podrían caber 57 globos terrestres en su interior.',
      'Neptuno pesa 17 veces la Tierra y tiene un océano profundo de hielo caliente comprimido sobre un núcleo de roca y hierro.',
      'Las nubes de Neptuno están a −201°C, 10 veces más frío que un congelador. El frío es tan brutal que congela el gas nitrógeno.',
      'Neptuno tiene 16 lunas, entre ellas Tritón. ¡Tritón orbita al revés (en sentido horario/retrógrado) de como gira Neptuno! Era un planeta enano capturado que lanza géiseres de hielo.',
      'En Neptuno rugen los vientos más feroces del sistema solar a más de 2.100 km/h con hermosas nubes azul azur.'
    ]
  },
  it: {
    sun: [
      'Anche se viene chiamato "nana gialla", il Sole non è affatto piccolo! G2V è un codice che significa che è una stella gialla luminosa nel fiore degli anni.',
      'La superficie del Sole è a 5.500°C—più calda di 55 volte la tua acqua calda da bagno! Nel cuore è 150.000 volte più caldo dell\'acqua che bolle (~15 milioni °C)!',
      'Il Sole è enorme! Se fosse una palla da spiaggia gigante e cava, potresti farci entrare più di un milione di Terre come biglie.',
      'Il Sole possiede il 99,86% di tutta la materia del nostro sistema solare! È 333.000 volte più pesante della Terra e tiene tutti i pianeti in orbita.',
      'Il nostro Sole viaggia intorno alla Via Lattea a 220 chilometri al secondo! È oltre 700 volte più veloce di un treno ad altissima velocità.',
      'Il Sole dista 150 milioni di chilometri. La luce solare è la più veloce dell\'universo, ma impiega comunque 8 minuti e 20 secondi per arrivare sulla Terra!',
      'Il Sole è una sfera gigante di gas e plasma infuocato. Non essendo roccia solida, il suo equatore ruota in 25 giorni, ma i suoi poli in 34 giorni!',
      'Il Sole è composto da Idrogeno (H₂) ed Elio (He), più leggeri dell\'aria. L\'idrogeno brucia nei fuochi di fusione nucleare donando calore e vita alla Terra.'
    ],
    mercury: [
      'Mercurio è il pianeta più vicino al Sole! Da lassù il Sole sembrerebbe 3 volte più grande nel cielo rispetto a come lo vediamo noi.',
      'Mercurio è il corridore più veloce dello spazio! Gira intorno al Sole in soli 88 giorni: festeggeresti il compleanno ogni 3 mesi!',
      'Mercurio ruota pianissimo su se stesso. Un solo giorno su Mercurio dura 176 giorni terrestri: più di un intero anno del pianeta!',
      'Mercurio è il pianeta più piccino, poco più grande della Luna. È pieno di crateri e sembra una pallina da golf spaziale.',
      'Anche se è piccolo, Mercurio è pesantissimo perché ha all\'interno un nucleo gigante di ferro solido che riempie quasi tutto il pianeta!',
      'Mercurio non ha aria! Di giorno fa 4 volte più caldo dell\'acqua bollente, ma di notte scende a −180°C: 9 volte più freddo di un congelatore!',
      'Mercurio ha 0 lune e 0 anelli! È così vicino al Sole che la gravità solare strapperebbe subito qualsiasi luna.',
      'Su Mercurio l\'aria è quasi inesistente, c\'è solo una sottilissima esosfera creata dal vento solare.'
    ],
    venus: [
      'Venere è il nostro pianeta più vicino. Riflette tanta luce da brillare nel cielo notturno più di qualunque stella, seconda solo alla Luna!',
      'Venere gira intorno al Sole in 225 giorni terrestri. Essendo più vicina al Sole della Terra, il suo anno è circa 4 mesi più corto.',
      'Venere ruota al contrario! Mentre la Terra gira in senso antiorario, Venere gira in senso orario. Il Sole sorge a ovest e tramonta a est! Un giorno dura più di un anno intero!',
      'Venere ha quasi la stessa taglia della Terra (il 95% del diametro). Gli scienziati la chiamano la sorella gemella della Terra, ma è una gemella bollente come un forno.',
      'Venere pesa quasi quanto la Terra. La gravità laggiù ti sembrerebbe quasi identica a quella di casa tua (il 91%).',
      'Venere è il pianeta più bollente di tutti a 465°C, quasi 5 volte più caldo dell\'acqua che bolle! Nubi gialle intrappolano il calore sciogliendo il piombo.',
      'Venere ha 0 lune e 0 anelli! Proprio come per Mercurio, il Sole si porterebbe via qualsiasi luna.',
      'L\'aria su Venere è denso anidride carbonica con nuvole di vero acido da batteria solforico! La pressione è 92 volte più alta della Terra.'
    ],
    earth: [
      'La Terra si trova nella fascia ideale dove l\'acqua resta liquida. Questa distanza si chiama 1 Unità Astronomica (AU)!',
      'La Terra impiega 365 giorni e 6 ore per compiere un giro intorno al Sole. Quelle 6 ore formano un anno bisestile ogni 4 anni col 29 febbraio!',
      'La Terra compie una rotazione ogni 24 ore: giorno per giocare e notte per dormire. Giriamo in senso antiorario, quindi il Sole sorge a est!',
      'La Terra è il più grande dei quattro pianeti rocciosi. Una galleria che passasse dal centro misurerebbe oltre 12.700 chilometri.',
      'La Terra pesa 6 sestilioni di tonnellate (un 6 con 24 zeri), regalandoci la gravità ideale per trattenere oceani e aria.',
      'La Terra ha una comoda temperatura media di 15°C. La nostra atmosfera ci protegge e riscalda come una morbida coperta.',
      'La Terra ha una luna fedele di nome Luna! Causa le maree due volte al giorno e illumina le notti con bagliore argenteo.',
      'La Terra ha l\'unica aria respirabile dell\'universo: 21% di ossigeno per respirare, 78% di azoto per le piante e uno strato di ozono protettivo.'
    ],
    mars: [
      'Marte è 1,5 volte più lontano dal Sole rispetto alla Terra ed è quindi un mondo molto più freddo.',
      'Un anno su Marte dura 687 giorni terrestri, quasi due anni della Terra! Le stagioni durano il doppio che da noi.',
      'Un giorno su Marte si chiama "Sol" e dura 24 ore e 37 minuti, quasi come sulla Terra. I robot su Marte vanno a nanna quando il sole tramonta.',
      'Marte è grande la metà della Terra. Non avendo oceani, le sue terre emerse sono vaste come tutti i continenti della Terra messi insieme.',
      'Marte pesa solo un decimo della Terra. Meno gravità significa che pesi un terzo del tuo peso e puoi saltare 2,6 volte più in alto!',
      'Marte è un deserto ghiacciato con −63°C di media (oltre 3 volte più freddo del congelatore). Di notte scende a −140°C.',
      'Marte ha due lune piccine a forma di patate spaziali, Phobos e Deimos! Phobos viaggia così rapido che sorge a ovest e tramonta a est due volte al giorno.',
      'L\'aria su Marte è sottilissima con polvere rossa. Tempeste di sabbia gigantesche possono coprire tutto il pianeta per mesi interi!'
    ],
    jupiter: [
      'Giove è 5 volte più lontano dal Sole rispetto alla Terra. Qui la luce solare è 27 volte più debole e lo spazio è ghiacciato.',
      'Giove impiega quasi 12 anni terrestri per compiere un giro intorno al Sole! Finiresti le elementari prima del tuo primo compleanno su Giove.',
      'Giove è il pianeta più veloce a ruotare, in meno di 10 ore! Questa rapida rotazione schiaccia i suoi poli allargando l\'equatore.',
      'Giove è il Re dei Pianeti, 11 volte più largo della Terra! Ci starebbero più di 1.300 Terre al suo interno.',
      'Giove è 2,5 volte più pesante di tutti gli altri 7 pianeti messi insieme! La sua super gravità attira comete pericolose proteggendo la Terra.',
      'Le nubi di Giove sono a −110°C, ma al centro ci sono 24.000°C: oltre 240 volte più caldo dell\'acqua che bolle!',
      'Giove ha ben 95 lune! Le 4 più grandi sono Ganimede (più grande di Mercurio!), Europa (con un mare caldo nascosto!), Io (con 400 vulcani!) e Callisto.',
      'Giove non ha terreno solido: è un gigante di idrogeno ed elio! La sua Grande Macchia Rossa è una tempesta mostruosa più grande della Terra.'
    ],
    saturn: [
      'Saturno è quasi 10 volte più lontano dal Sole della Terra. La luce del Sole impiega 80 minuti per raggiungere le sue nubi dorate.',
      'Saturno impiega quasi 30 anni terrestri per fare un giro del Sole. In tutta la vita vedresti solo 2 o 3 anni di Saturno!',
      'Anche se è gigantesco, Saturno ruota su se stesso in sole 10 ore e mezza, rigonfiandosi al centro.',
      'Saturno è 9 volte più largo della Terra! Con i suoi anelli misura 282.000 chilometri, quasi la distanza dalla Terra alla Luna!',
      'Saturno pesa 95 volte la Terra ma è meno denso dell\'acqua: in una vasca gigante galleggerebbe come una papera di gomma!',
      'Le nuvole di Saturno sono a −140°C (7 volte più freddo di un congelatore), ma nel nucleo ci sono 11.500°C (115 volte l\'acqua bollente).',
      'Saturno ha ben 146 lune! I suoi anelli sono formati da miliardi di pezzi di ghiaccio puro splendente, da fiocchi di neve a blocchi grandi come case.',
      'Saturno è fatto di gas leggero. I suoi venti soffiano a 1.800 km/h, più veloci degli aerei da caccia supersonici!'
    ],
    uranus: [
      'Urano è 19 volte più lontano dal Sole della Terra. È stato il primo pianeta scoperto al telescopio nel 1781.',
      'Urano impiega 84 anni terrestri per completare un\'orbita! Ogni stagione dura ben 21 anni terrestri.',
      'Urano rotola su un fianco come una palla da bowling con un\'inclinazione di 98°! Gira all\'indietro (senso orario). Un polo ha 42 anni di sole ininterrotto e l\'altro 42 anni di buio polare gelido!',
      'Urano è 4 volte più largo della Terra. Quattro Terre starebbero affiancate lungo il suo equatore, e 63 Terre al suo interno.',
      'Urano è un Gigante di Ghiaccio con acqua, ammoniaca e metano ghiacciati, circa 14,5 volte più pesante della Terra.',
      'Urano detiene il record di pianeta più freddo del sistema solare a −224°C, 11 volte più freddo di un congelatore!',
      'Urano ha 28 lune con nomi presi dalle opere di Shakespeare (come Titania e Miranda) e 13 anelli scuri.',
      'Urano vanta uno splendido colore azzurro ciano grazie al gas metano, che cattura la luce rossa e riflette un magnifico blu turchese.'
    ],
    neptune: [
      'Nettuno è il pianeta più lontano, 30 volte più distante dal Sole della Terra! La luce solare impiega più di 4 ore per arrivarci.',
      'Un anno su Nettuno dura ben 165 anni terrestri! Dalla sua scoperta nel 1846 ha compiuto una sola orbita completa.',
      'Nettuno compie una rotazione ogni 16 ore. Essendo fatto di gas e fango ghiacciato, il suo equatore gira più svelto dei poli.',
      'Nettuno è quasi 4 volte più largo della Terra e potrebbe contenere 57 sfere terrestri.',
      'Nettuno pesa 17 volte la Terra e custodisce un oceano di ghiaccio compresso sopra un nucleo di roccia e ferro.',
      'Le nubi di Nettuno sono a −201°C, 10 volte più freddo di un congelatore! Il gelo solidifica persino il gas azoto.',
      'Nettuno ha 16 lune, tra cui Tritone. Tritone orbita al contrario (in senso orario/retrogrado) rispetto alla rotazione di Nettuno! Era un pianeta nano catturato che spara veri geyser di ghiaccio.',
      'Su Nettuno soffiano i venti più furiosi del sistema solare a oltre 2.100 km/h tra splendide nubi blu cobalto.'
    ]
  },
  ja: {
    sun: [
      '太陽は「黄色い矮星（小さい星）」と呼ばれますが、まったく小さくありません！「G2V」とは、人生の最も輝かしい時期にある明るい黄色の力強い星を表すコードです。',
      '太陽の表面温度は5,500℃！熱いお風呂の温度の55倍以上も熱いです！さらに中心部は約1,500万℃で、沸騰したお湯の15万倍も超高温です！',
      '太陽は超巨大！もし太陽が空っぽの大きなビーチボールだとしたら、中に地球が100万個以上もビー玉のようにすっぽり入ります。',
      '太陽は太陽系全体のすべての物質の99.86%を占めています！地球の33万倍も重く、その巨大な重力で全惑星をくるくると引っ張っています。',
      '太陽は銀河系の中を秒速220kmというものすごいスピードで飛んでいます！これは新幹線の700倍以上の速さです。',
      '太陽は地球から約1億5,000万km離れています。光は宇宙で一番速いものですが、それでも太陽を出てから地球のあなたの目に届くまで8分20秒かかります！',
      '太陽は超高温のガスとプラズマでできた回転する火の玉です。固い岩ではないため、赤道は25日で1回転しますが、極は34日もかかります！',
      '太陽は水素（H₂）とヘリウム（He）でできています。どちらも空気より軽いです！水素が核融合という巨大な火で燃え続け、地球に光と命を届けています。'
    ],
    mercury: [
      '水星は太陽に一番近い惑星です！水星から太陽を見上げると、地球から見るよりも3倍も大きく見えます。',
      '水星は宇宙一の韋駄天ランナー！太陽の周りをたった88日で1周するので、3ヶ月ごとに誕生日がやってきます！',
      '水星の自転はとってもゆっくり。水星の1日は地球の176日分もあり、なんと水星の1年よりも1日の方が長いのです！朝ご飯から夜寝るまで半年もかかります。',
      '水星は太陽系の末っ子惑星で、月より少し大きい程度です。宇宙の隕石がたくさん衝突して、まるでゴルフボールのようなクレーターだらけです。',
      '水星は小さいけれど、中身に巨大な鉄の金属の芯が詰まっているため、ずっしりと超重いです！',
      '水星には空気がありません！昼は沸騰したお湯の4倍も熱い430℃ですが、夜になると家庭の冷凍庫の9倍も冷たい−180℃まで急降下します！',
      '水星には衛星も環もありません（0個）！太陽があまりにも近いため、衛星を持とうとしても太陽の強大な重力に奪われてしまいます。',
      '水星には呼吸できる空気がほとんどなく、太陽風によって吹き飛ばされた極めて薄い気体（外気圏）が漂うだけです。'
    ],
    venus: [
      '金星は地球のすぐお隣の惑星です。太陽の光を強く反射するため、夜空で月の次に明るく輝きます！',
      '金星は約225日で太陽を1周します。地球よりも太陽に近いため、金星の1年は地球より約4ヶ月短いです。',
      '金星は時計回り（逆向き）に自転しています！地球や多くの惑星は反時計回りに回りますが、金星は逆回転なので、太陽が西から昇って東に沈みます！自転がとても遅いため、1日の長さが1年よりも長いです！',
      '金星は地球とほぼ同じ大きさ（地球の約95%）です。科学者は地球の双子の姉妹と呼びますが、灼熱のオーブンのような過酷な双子です。',
      '金星の重さは地球とほぼ同じです。金星の上に立つと、地球の91%の力で引っ張られるため、体重は家とほぼ同じに感じます。',
      '金星は465℃という太陽系で一番熱い惑星です！沸騰したお湯の約5倍も熱く、分厚い雲が熱を閉じ込める温室効果で、金属の鉛もドロドロに溶けてしまいます。',
      '金星には衛星も環もありません（0個）！水星と同じく、太陽の重力が強すぎて月を持つことができません。',
      '金星の空気は息が詰まる二酸化炭素で、雲は本物のバッテリー液（硫酸）の雨です！空気の重さは地球の92倍もあり、潜水艦もペシャンコに潰れます。'
    ],
    earth: [
      '地球は水が液体として存在できる最高の場所「ハビタブルゾーン」にあります。この太陽との距離を「1天文単位（AU）」と呼びます！',
      '地球は365日と6時間かけて太陽を1周します。この6時間のズレが4年集まると、2月29日がある「うるう年」になります！',
      '地球は24時間で1回転し、昼は遊んで学び、夜はぐっすり眠ります。反時計回りに自転しているため、太陽は東から昇り西へ沈みます！',
      '地球は4つの岩石惑星の中で一番大きいです！真ん中を突き抜けるトンネルを掘ると、長さは1万2,700km以上になります。',
      '地球の重さは約60垓（がい）トン（6の後に0が24個）！この重さのおかげで、海の水や大気が宇宙へ逃げずに保たれています。',
      '地球の平均気温は過ごしやすい約15℃（快適な部屋の温度）です！大気がふわふわの毛布のように私たちを温かく守ってくれています。',
      '地球には「月（ルナ）」という大切なお友達の衛星が1つあります！海の満ち引きを起こし、夜空を優しい銀色の光で照らします。',
      '地球は宇宙で唯一呼吸できる空気があります！人間や動物が吸う酸素が21%、植物を育てる窒素が78%、そしてオゾン層が有害な日焼け光線をブロックします。'
    ],
    mars: [
      '火星は地球よりも太陽から1.5倍離れています。太陽のたき火から遠いため、地球よりもずっと寒いです。',
      '火星の1年は地球の687日（約2年分）！春夏秋冬のそれぞれの季節が、地球の2倍も長く続きます。',
      '火星の1日は「Sol（ソル）」と呼ばれ、24時間37分です。地球とほとんど同じ！火星の探査ローバーロボットは夕日が沈むと眠りにつきます。',
      '火星の幅は地球の約半分です。でも火星には海がないため、陸地の広さは地球のすべての大陸を合わせた広さとほぼ同じです！',
      '火星の重さは地球の10分の1しかありません。重力が小さいため、体重は3分の1になり、2.6倍も高く飛び跳ねることができます！',
      '火星は凍りつく砂漠です！平均気温は−63℃で、家庭の冷凍庫の3倍以上冷たいです。昼は20℃まで上がりますが、夜は−140℃まで冷え込みます。',
      '火星にはフォボスとダイモスという2つのジャガイモ形の小さな月があります！フォボスは超高速で回り、西から昇って東に沈むのを1日に2回繰り返します。',
      '火星の空気は地球の1%未満のとても薄い二酸化炭素です。赤くて巨大な砂嵐が発生すると、星全体が何ヶ月も見えなくなることがあります！'
    ],
    jupiter: [
      '木星は地球の5倍も太陽から離れています！この遠い宇宙では日光が27分の1になり、極寒の世界です。',
      '木星が太陽を1周するには約12年もかかります！赤ちゃんが生まれてから小学校を卒業するまで、木星の誕生日は1回も来ません。',
      '木星は太陽系で一番速く回転する惑星で、1日は10時間未満です！ものすごい高速回転でお腹の周りが横にポコッと膨らんでいます。',
      '木星は地球の11倍も大きい「惑星の王様」です！地球が1,300個以上もすっぽり丸ごと飲み込まれてしまうほどの大きさです。',
      '木星は他の7つの惑星をすべて合わせた重さの2.5倍も重いです！その巨大な重力で宇宙の危険な彗星を吸い寄せ、地球を守っています。',
      '木星の雲のてっぺんは−110℃ですが、中心の芯は24,000℃もあり、沸騰したお湯の240倍以上も超高温です！',
      '木星には95個の月があります！特に大きな4つはガニメデ（水星より大！）、エウロパ（氷の下に温かい海！）、イオ（400の火山！）、カリストです。',
      '木星には足で立てる地面がなく、水素とヘリウムのガス球です！有名な「大赤斑」は地球よりも大きい350年以上続く巨大ハリケーンです。'
    ],
    saturn: [
      '土星は地球より約10倍も太陽から遠く、太陽の光が黄金の雲に届くまで80分もかかります。',
      '土星が太陽を1周するには約30年かかります。人間の全生涯でも土星の年は2〜3年分しか体験できません！',
      '土星は超巨大なのに、たった10時間半で1回転します！この猛烈なスピードで赤道が外側に大きく張り出しています。',
      '土星は地球の9倍の大きさです！美しい環を含めると幅は28万kmにもなり、地球から月までの距離とほぼ同じです！',
      '土星は地球の95倍も重いのに、水より軽いです！もし超特大のお風呂があったら、黄色いアヒルのおもちゃのようにぷかぷか浮かびます！',
      '土星の上空の雲は−140℃（冷凍庫の7倍冷たい）ですが、高圧で圧縮された中心部は11,500℃（沸騰水の115倍）に達します！',
      '土星は太陽系一の月持ちで146個もあります！環は雪玉から家サイズの巨大な氷山まで、何十億個ものキラキラ光る純粋な氷でできています。',
      '土星は軽いガスでできています。上空の風は時速1,800kmで吹き荒れ、超音速ジェット戦闘機よりも速いです！'
    ],
    uranus: [
      '天王星は地球の19倍も太陽から離れています。とても暗くて遠いため、1781年に望遠鏡で初めて発見された惑星です。',
      '天王星が太陽を1周するには84年もかかります！そのため、春・夏・秋・冬のひとつの季節が21年間も続きます。',
      '天王星は98度も横倒しになって、まるでボウリングの球のように転がりながら逆回転（時計回り）で公転しています！一方の極が42年間ずっと昼になり、もう一方は42年間暗黒の極寒の夜になります！',
      '天王星は地球の4倍の幅があります。赤道に地球が4個横に並び、内部には地球が63個も入ります。',
      '天王星は地球の約14.5倍重い「氷の巨人」です。内部は水、アンモニア、メタンがドロドロに凍ったシャーベットで満たされています。',
      '天王星は太陽系で一番寒い−224℃の記録を持っています！家庭の冷凍庫の11倍も冷たく、内部の熱もほとんどありません。',
      '天王星には28個の月があり、シェイクスピアの戯曲の妖精たち（チタニアやミランダなど）の名が付けられています。黒い環も13本あります。',
      '天王星の綺麗なシアンブルーはメタンガスによるものです。メタンが赤い太陽光を吸収し、美しい青緑色の光だけを跳ね返します！'
    ],
    neptune: [
      '海王星は一番外側の惑星で、太陽から地球の30倍も離れています！日光が届くまで4時間以上もかかります。',
      '海王星の1年は約165年です！1846年に発見されてから、まだ太陽の周りをたった1周しかしていません。',
      '海王星は16時間で1回転します。ガスと氷のシャーベットでできているため、赤道の方が極よりも速く回転します。',
      '海王星は地球の約4倍の幅で、内部に地球が57個入ります。天王星より少し小さいですが、密度が高くてずっしり重いです。',
      '海王星は地球の17倍の重さがあり、高温高圧の圧縮された水とメタンの深い海が岩石の芯を包んでいます。',
      '海王星の雲のてっぺんは−201℃で、冷凍庫の10倍冷たいです！あまりの寒さに窒素ガスも固まって氷の粒になります。',
      '海王星には16個の月があり、最大のトリトンは海王星の自転と逆向き（時計回り/逆行）に公転しています！カイパーベルトから捕獲された氷の準惑星で、本物の氷の噴水を宇宙へ噴き上げています！',
      '海王星には時速2,100km（マッハ1.7）という太陽系で最も荒れ狂う猛烈な風が吹き荒れ、深みのある濃い青色の雲が輝いています。'
    ]
  },
  zh: {
    sun: [
      '虽然人们叫太阳为“黄矮星”，但它一点也不矮小！“G2V”是一个恒星密码，意思是它是一颗处于生命黄金期的明亮黄色主序星。',
      '太阳表面温度高达5500℃，比洗热水澡的水热55倍以上！而在核心深处温度约1500万℃，比沸腾的开水热15万倍！',
      '太阳巨大无比！如果太阳是一个巨大的空心沙滩球，里面可以装下超过100万个地球，就像塞满一堆小玻璃珠。',
      '太阳占据了整个太阳系全部质量的99.86%！它比地球重33.3万倍，用巨大的引力大手拉着所有行星绕着它转。',
      '我们的太阳以每秒220公里的速度绕银河系飞驰！这比高铁还要快700多倍。',
      '太阳距离地球1.5亿公里。太阳光是宇宙中跑得最快的东西，但它从太阳出发仍需8分20秒才能到达地球上你的眼睛！',
      '太阳是一个旋转的超热气体和等离子体大火球。因为它不是坚硬的岩石，赤道旋转一圈需要25天，但南北极却需要34天！',
      '太阳主要由氢气（H₂）和氦气（He）组成，它们都比空气更轻！氢气就像核聚变大熔炉里的燃料，源源不断发出光和热，滋养着地球上的生命。'
    ],
    mercury: [
      '水星是离太阳最近的行星！如果你站在水星上，太阳在天空中看起来会比在地球上看大3倍。',
      '水星是太空里的飞毛腿！绕太阳飞奔一圈只需要88天，所以在水星上每3个月就可以过一次生日！',
      '水星自转非常缓慢。水星上的一个白天相当于地球上的176天，比它的一整年还要漫长！早饭和晚饭之间得等上整整半年。',
      '水星是太阳系里的迷你小宝贝，只比我们的月球稍微大一点点。表面布满了陨石撞击坑，看起来就像一个太空高尔夫球。',
      '水星虽然身材小，但分量超重，因为它的体内有一个巨大的纯铁金属核心，占据了整个行星的大半！',
      '水星没有空气保温层！白天比沸水热4倍，但到了晚上温度骤降到零下180℃，比家里的冰箱冷冻室还要冷9倍！',
      '水星拥有0颗卫星和0个光环！它离太阳太近了，巨大的太阳引力会把任何靠近的卫星直接吸走。',
      '水星上几乎没有可以呼吸的空气，只有太阳风从表面扬起的一层极薄的外逸层气体分子。'
    ],
    venus: [
      '金星是离地球最近的邻居行星。它反射了大量阳光，是夜空中除月亮之外最亮的天体！',
      '金星绕太阳公转一圈大约需要225个地球日。因为它离太阳更近，所以金星的一年比地球短大约4个月。',
      '金星是倒着自转的！大多数行星都是逆时针转动，而金星是顺时针自转。所以金星上的太阳是西升东落！而且它转得极慢，一天比一年还要长！',
      '金星的大小和地球几乎一模一样（相当于地球宽度的95%）。科学家叫它地球的双胞胎姐妹，但它是一个像大烤箱一样的恶毒双胞胎。',
      '金星的重量和地球差不多。如果你站在金星上，重力感觉和家里几乎一样（约地球的91%）。',
      '金星是全太阳系最热的行星，温度高达465℃，比开水热将近5倍！浓密的黄色酸云像巨大温室一样锁住热量，甚至能融化铅块。',
      '金星拥有0颗卫星和0个光环！和水星一样，任何卫星都会被太阳的强大引力撕扯或吞噬。',
      '金星的大气是沉重的二氧化碳，云层里下的竟是真正的蓄电池酸（硫酸）！气压是地球的92倍，能直接把潜水艇像易拉罐一样压扁。'
    ],
    earth: [
      '地球位于适居带——距离太阳刚刚好，液态水既不会沸腾蒸发也不会冻结成冰。这个距离就是1个天文单位（AU）！',
      '地球绕太阳公转一圈需要365天又6小时。这多出来的6小时每4年累积一次，就有了包含2月29日的闰年！',
      '地球每24小时自转一圈，带来白天玩耍学习和夜晚美梦。我们是逆时针自转，所以太阳每天东升西落！',
      '地球是四颗岩石行星中最大的！如果从中间挖一条穿透地球核心的隧道，长度将超过12700公里。',
      '地球重约60万亿亿吨（6后面有24个零）！这个质量带来了恰到好处的引力，牢牢抓住了海洋和大自然。',
      '地球平均温度是舒适的15℃（舒适室温）！我们的大气层就像一层温暖的被子，呵护着所有小动物和植物。',
      '地球有一颗忠实的月球伙伴！月球每天引发两次海洋潮起潮落，并在夜晚用温柔的银光照亮大地。',
      '地球拥有全宇宙唯一可呼吸的空气：21%氧气供我们呼吸，78%氮气滋养植物，还有臭氧层抵挡紫外线晒伤。'
    ],
    mars: [
      '火星距离太阳是地球的1.5倍。因为远离太阳火炉，火星要比地球寒冷得多。',
      '火星上的一年长达687个地球日，几乎相当于两个地球年！火星上的春夏秋冬每个季节都要长两倍。',
      '火星上的一天叫做“火星日（Sol）”，时长为24小时37分钟，和地球几乎一样！火星上的机器人火星车太阳下山就会进入休眠。',
      '火星的大小大约只有地球的一半。但因为火星没有海洋，它的陆地面积和地球上所有大洲陆地加起来差不多大！',
      '火星的质量只有地球的十分之一。引力变小意味着你的体重只有三分之一，轻轻一跳就能蹦2.6倍高！',
      '火星是一个冰冷荒漠，平均零下63℃，比家用冷冻室冰块冷3倍以上。中午赤道可达20℃，但夜晚会降到零下140℃。',
      '火星有两颗土豆形状的小卫星：火卫一和火卫二！火卫一跑得飞快，每天在西边升起东边落下两次。',
      '火星空气非常稀薄，气压不足地球的1%。巨大的红色沙尘暴一旦刮起，几个月都能遮天蔽日！'
    ],
    jupiter: [
      '木星离太阳是地球的5倍远！在深空深处，阳光暗了27倍，寒冷刺骨。',
      '木星绕太阳一圈需要将近12个地球年！小朋友从出生到小学毕业，木星的第一个生日还没过完。',
      '木星是自转最快的行星，不到10小时就转一整圈！高速飞转把它的肚子甩得鼓鼓的。',
      '木星是众行星之王，比地球宽11倍！里面能轻松塞下1300多个地球。',
      '木星比其他7颗行星质量总和还要重2.5倍！它强大的引力就像太空吸尘器，替地球挡住了危险的彗星。',
      '木星云顶温度零下110℃，但核心温度高达24000℃，比开水热240倍以上！它辐射出的热量比从太阳接收的还要多。',
      '木星有95颗卫星！四大著名卫星是木卫三（比水星还大！）、木卫二（冰层下有温暖海洋！）、木卫一（400座活火山！）和木卫四。',
      '木星没有坚硬的陆地，是一个巨型气体球！标志性的大红斑是一场刮了350多年、比地球还大的巨型风暴。'
    ],
    saturn: [
      '土星距离太阳几乎是地球的10倍！阳光要经过80分钟的长途跋涉才能到达土星的金黄云层。',
      '土星绕太阳一圈需要29.5个地球年。一辈子你大概只能经历两三次土星年！',
      '土星虽然是庞然大物，但只要10.5小时就能自转一圈，把赤道甩得向外凸起。',
      '土星比地球宽9倍！算上绚丽的光环宽达28.2万公里，几乎相当于从地球到月球的距离！',
      '土星比地球重95倍，但密度比水还小！如果有一个超级大浴缸，土星能像小黄鸭一样漂在水面上！',
      '土星高空云层零下140℃（比冷冻室冷7倍），但在被极大压力压迫的核心却达11500℃（沸水的115倍）！',
      '土星拥有146颗卫星，是卫星冠军！它的美丽光环由数十亿块纯净冰块组成，从雪花碎屑到房屋大小的冰山应有尽有。',
      '土星由轻气体组成。高空风速狂飙到每小时1800公里，比超音速喷气式战斗机还要快！'
    ],
    uranus: [
      '天王星离太阳比地球远19倍。它太遥远黯淡，是人类1781年通过望远镜发现的第一颗行星。',
      '天王星绕太阳公转一圈需要84年！因此那里的每个季节（春夏秋冬）都要持续21年。',
      '天王星以98度极限倾角横躺着，像保龄球一样滚着绕太阳转，并且是逆向自转（顺时针）！一极有42年连续白昼，另一极则是42年冰冷极夜！',
      '天王星比地球宽4倍。在它的赤道上能并排摆下4个地球，里面能装下63个地球。',
      '天王星是冰巨星，体内充满水、氨和甲烷冻结成的冰浆，比地球重约14.5倍。',
      '天王星保持着全太阳系最低温纪录：零下224℃！比冷冻室还要冷11倍，它自身几乎没有内部热量。',
      '天王星有28颗卫星，都以莎士比亚戏剧中的角色命名（如提坦妮娅和米兰达），还有13道暗黑光环。',
      '天王星美丽青翠的青色来自于甲烷气体。甲烷吸收了阳光中的红光，把鲜艳的蓝绿色反射回我们的眼中！'
    ],
    neptune: [
      '海王星是最遥远的官方大行星，距太阳是地球的30倍！阳光需要4个多小时才能飞到这里。',
      '海王星的一年长达近165个地球年！自从1846年被发现以来，它才刚刚完整绕太阳转了一整圈。',
      '海王星每16小时自转一周。由于由流动气体和冰浆构成，赤道转得比两极更快。',
      '海王星比地球宽近4倍，体积可以装下57个地球，密度比天王星更紧实重实。',
      '海王星比地球重17倍，拥有深厚的被高压压缩的沸腾热水与甲烷冰海洋，包裹着岩石铁核。',
      '海王星云顶零下201℃，比冷冻室冷10倍！极度严寒甚至能让氮气凝结成固体冰霜。',
      '海王星有16颗卫星，包括巨大的海卫一（Triton）。海卫一是逆向公转（顺时针逆行）的！证明它是海王星从柯伊伯带俘获的冰矮星，还会向太空喷射真正的氮冰火山！',
      '海王星上呼啸着全太阳系最凶猛的狂风，时速超过2100公里（超音速！），点缀着深邃迷人的蔚蓝云海。'
    ]
  }
};

// 3. UI Key Additions
export const uiAdditions = {
  en: {
    kids_guide_title: "Kids Science Guide",
    kids_guide_badge: "🚀 Explainer",
    tap_kids_explainer: "💡 Tap for Kids Explainer",
    close_popup: "Got it!"
  },
  de: {
    kids_guide_title: "Kinder-Wissenschaftsführer",
    kids_guide_badge: "🚀 Erklärung",
    tap_kids_explainer: "💡 Tippen für Kinder-Erklärung",
    close_popup: "Verstanden!"
  },
  fr: {
    kids_guide_title: "Guide Scientifique Enfants",
    kids_guide_badge: "🚀 Explication",
    tap_kids_explainer: "💡 Touchez pour l'explication enfants",
    close_popup: "Compris !"
  },
  es: {
    kids_guide_title: "Guía Científica para Niños",
    kids_guide_badge: "🚀 Explicación",
    tap_kids_explainer: "💡 Toca para explicación infantil",
    close_popup: "¡Entendido!"
  },
  it: {
    kids_guide_title: "Guida Scientifica per Bambini",
    kids_guide_badge: "🚀 Spiegazione",
    tap_kids_explainer: "💡 Tocca per la spiegazione bimbi",
    close_popup: "Capito!"
  },
  ja: {
    kids_guide_title: "キッズ科学ガイド",
    kids_guide_badge: "🚀 解説",
    tap_kids_explainer: "💡 タップしてキッズ解説を見る",
    close_popup: "わかった！"
  },
  zh: {
    kids_guide_title: "儿童科学指南",
    kids_guide_badge: "🚀 简明讲解",
    tap_kids_explainer: "💡 点击查看儿童版讲解",
    close_popup: "明白了！"
  }
};

// 4. Update i18n JSON files
const i18nDir = path.resolve(rootDir, 'src/i18n');
const langs = ['en', 'de', 'fr', 'es', 'it', 'ja', 'zh'];

for (const lang of langs) {
  const filePath = path.join(i18nDir, `${lang}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Update UI additions
  if (uiAdditions[lang]) {
    Object.assign(data.ui, uiAdditions[lang]);
  }

  // Update bodies
  const bodies = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
  for (const b of bodies) {
    if (!data.planets[b] || !data.planets[b].stats) continue;
    const kidsList = lang === 'en' ? enKids[b] : (translationsKids[lang] && translationsKids[lang][b] ? translationsKids[lang][b] : enKids[b]);

    data.planets[b].stats.forEach((st, idx) => {
      st.kids = kidsList[idx] || enKids[b][idx];
      // Normalize 9x / 9× to 9 times
      if (st.sub) {
        if (lang === 'en') {
          st.sub = st.sub.replace(/9× colder/g, '9 times colder')
                         .replace(/4× boiling/g, '4 times boiling')
                         .replace(/55× boiling/g, '55 times boiling')
                         .replace(/150,000× hotter/g, '150,000 times hotter')
                         .replace(/Nearly 5× hotter/g, 'Nearly 5 times hotter')
                         .replace(/over 3× colder/g, 'over 3 times colder')
                         .replace(/240× hotter/g, '240 times hotter')
                         .replace(/7× colder/g, '7 times colder')
                         .replace(/115× boiling/g, '115 times boiling')
                         .replace(/11× colder/g, '11 times colder')
                         .replace(/10× colder/g, '10 times colder');
        } else if (lang === 'de') {
          st.sub = st.sub.replace(/9×/g, '9-mal')
                         .replace(/4×/g, '4-mal')
                         .replace(/55×/g, '55-mal')
                         .replace(/150\.000×/g, '150.000-mal')
                         .replace(/5×/g, '5-mal')
                         .replace(/3×/g, '3-mal')
                         .replace(/240×/g, '240-mal')
                         .replace(/7×/g, '7-mal')
                         .replace(/115×/g, '115-mal')
                         .replace(/11×/g, '11-mal')
                         .replace(/10×/g, '10-mal');
        } else if (lang === 'fr') {
          st.sub = st.sub.replace(/9×/g, '9 fois')
                         .replace(/4×/g, '4 fois')
                         .replace(/55×/g, '55 fois')
                         .replace(/150 000×/g, '150 000 fois')
                         .replace(/5×/g, '5 fois')
                         .replace(/3×/g, '3 fois')
                         .replace(/240×/g, '240 fois')
                         .replace(/7×/g, '7 fois')
                         .replace(/115×/g, '115 fois')
                         .replace(/11×/g, '11 fois')
                         .replace(/10×/g, '10 fois');
        } else if (lang === 'es') {
          st.sub = st.sub.replace(/9×/g, '9 veces')
                         .replace(/4×/g, '4 veces')
                         .replace(/55×/g, '55 veces')
                         .replace(/150\.000×/g, '150.000 veces')
                         .replace(/5×/g, '5 veces')
                         .replace(/3×/g, '3 veces')
                         .replace(/240×/g, '240 veces')
                         .replace(/7×/g, '7 veces')
                         .replace(/115×/g, '115 veces')
                         .replace(/11×/g, '11 veces')
                         .replace(/10×/g, '10 veces');
        } else if (lang === 'it') {
          st.sub = st.sub.replace(/9×/g, '9 volte')
                         .replace(/4×/g, '4 volte')
                         .replace(/55×/g, '55 volte')
                         .replace(/150\.000×/g, '150.000 volte')
                         .replace(/5×/g, '5 volte')
                         .replace(/3×/g, '3 volte')
                         .replace(/240×/g, '240 volte')
                         .replace(/7×/g, '7 volte')
                         .replace(/115×/g, '115 volte')
                         .replace(/11×/g, '11 volte')
                         .replace(/10×/g, '10 volte');
        }
      }
    });
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  console.log(`Updated i18n JSON: ${lang}.json`);
}

// 5. Update src/js/data/planets.js
const planetsPath = path.resolve(rootDir, 'src/js/data/planets.js');
let planetsJs = fs.readFileSync(planetsPath, 'utf8');

// Replace 9x / 9× and other multipliers in planets.js
planetsJs = planetsJs.replace(/9× colder than a freezer/g, '9 times colder than a freezer')
                     .replace(/4× boiling water/g, '4 times boiling water')
                     .replace(/Surface is 55× boiling water/g, 'Surface is 55 times boiling water')
                     .replace(/core is 150,000× hotter/g, 'core is 150,000 times hotter')
                     .replace(/Nearly 5× hotter/g, 'Nearly 5 times hotter')
                     .replace(/over 3× colder/g, 'over 3 times colder')
                     .replace(/deep core is 240× hotter/g, 'deep core is 240 times hotter')
                     .replace(/\(7× colder than a freezer\)/g, '(7 times colder than a freezer)')
                     .replace(/interior is 115× boiling water/g, 'interior is 115 times boiling water')
                     .replace(/11× colder than a freezer/g, '11 times colder than a freezer')
                     .replace(/10× colder than a freezer/g, '10 times colder than a freezer');

// Dynamically inject kids into each body's stats block in planets.js
const enJson = JSON.parse(fs.readFileSync(path.join(i18nDir, 'en.json'), 'utf8'));

const bodies = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
for (const b of bodies) {
  const statsList = enJson.planets[b].stats;
  const kidsList = enKids[b];
  
  // Format stats block
  const formattedStats = statsList.map((st, i) => {
    const escapedLabel = st.label.replace(/'/g, "\\'");
    const escapedVal = st.value.replace(/'/g, "\\'");
    const escapedSub = st.sub.replace(/'/g, "\\'");
    const escapedKid = (kidsList[i] || st.kids || '').replace(/'/g, "\\'");
    return `    { label: '${escapedLabel}', value: '${escapedVal}', sub: '${escapedSub}', kids: '${escapedKid}' }`;
  }).join(',\n');

  const statsRegex = new RegExp(`(slug:\\s*['"]${b}['"][\\s\\S]*?stats:\\s*\\[)[\\s\\S]*?(\\])`, 'm');
  planetsJs = planetsJs.replace(statsRegex, `$1\n${formattedStats}\n  $2`);
}

fs.writeFileSync(planetsPath, planetsJs);
console.log('Successfully updated src/js/data/planets.js with kids fields and 9 times normalization.');

