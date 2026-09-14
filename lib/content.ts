export const services = [
  {
    id: 'box-inspection',
    name: 'Box Inspection',
    short: 'If it fits, I sit.',
    description: 'A thorough structural assessment. From inside the structure.',
    baseFee: 3,
    image: 'box-inspection',
    icon: 'box',
  },
  {
    id: 'keyboard-warming',
    name: 'Keyboard Warming',
    short: 'Productivity, on paws.',
    description: 'I bring warmth to your workflow. And occasionally 46 extra letters.',
    baseFee: 5,
    image: 'laptop-scene',
    icon: 'keyboard',
  },
  {
    id: 'meeting-cameo',
    name: 'Meeting Cameo',
    short: 'A strong camera presence.',
    description: 'No agenda. No preparation. Somehow the most memorable attendee.',
    baseFee: 7,
    image: 'meeting-cameo',
    icon: 'camera',
  },
  {
    id: 'creative-supervision',
    name: 'Creative Supervision',
    short: 'A fresh pair of eyes.',
    description: 'I consider your work carefully. Then sit on the important part.',
    baseFee: 9,
    image: 'sofa-scene',
    icon: 'eye',
  },
] as const;
export type ServiceId = (typeof services)[number]['id'];
export const getService = (id: ServiceId) => services.find((s) => s.id === id)!;
export const isServiceId = (id: unknown): id is ServiceId => services.some((s) => s.id === id);

export const work = [
  {
    slug: 'laptop-warming',
    title: 'The Laptop Warming Initiative',
    shortTitle: 'The Laptop Warming\nInitiative',
    category: 'Keyboard Warming',
    service: 'keyboard-warming' as ServiceId,
    image: 'laptop-scene',
    details: ['laptop-detail', 'meeting-cameo'],
    alt: 'Miso stretched across a silver laptop on the sunny oak desk.',
    description: 'A warmer keyboard. A healthier work-life balance. Several unsent emails.',
    brief:
      'The human had been at the laptop for three hours. The brief was to support productivity. I identified a more urgent need: a break.',
    approach:
      'I surveyed the desk, located the heat source, and deployed my full body across the keyboard. A short sequence of unsolicited keystrokes confirmed successful integration. I maintained my position while the human made tea.',
    outcome:
      'The laptop was occupied. The human took a break. An email beginning “jjjjjjjj” remained safely in drafts. All agreed outcomes were achieved, once I had redefined them.',
    result: 'One overdue break, delivered.',
    note: 'Scope expanded to include the trackpad.',
  },
  {
    slug: 'box-04',
    title: 'Box 04: Quality Assurance',
    shortTitle: 'Box 04:\nQuality Assurance',
    category: 'Box Inspection',
    service: 'box-inspection' as ServiceId,
    image: 'box-inspection',
    details: ['box-detail', 'sleepy'],
    alt: 'Miso sitting upright inside an open cardboard box in his home studio.',
    description:
      'An independent packaging review. A very dependent relationship with the packaging.',
    brief:
      'A delivery arrived. Its contents were of no professional interest. The container, however, required immediate evaluation before the human did something rash with the recycling.',
    approach:
      'My protocol was rigorous: enter, rotate, assess each corner, nap. I applied sustained pressure to the base and conducted an extended acoustics test by scratching one flap.',
    outcome:
      'Box 04 passed with distinction. It was reclassified as a permanent studio annex. Recycling was postponed indefinitely. I remained on site to monitor quality.',
    result: 'Approved. And now occupied.',
    note: 'The packaging is the deliverable.',
  },
  {
    slug: 'sofa-occupancy',
    title: 'The Sofa Occupancy Project',
    shortTitle: 'The Sofa\nOccupancy Project',
    category: 'Creative Supervision',
    service: 'creative-supervision' as ServiceId,
    image: 'sofa-scene',
    details: ['window-portrait', 'resume-portrait'],
    alt: 'Miso reclining on the central cushion of a beige linen sofa.',
    description: 'A bold rethink of the seating plan. Mostly for everyone else.',
    brief:
      'The lounge lacked a clear focal point. The central cushion was being used inconsistently. I proposed a single, orange source of creative direction.',
    approach:
      'I occupied the center, extended one leg, and studied the room through nearly closed eyes. When a human approached, I adjusted my footprint to encourage alternative seating solutions.',
    outcome:
      'The human discovered a perfectly good chair. The sofa gained a resident creative director. The room now has a clear hierarchy, and I am at the top of it.',
    result: 'A new human seating arrangement.',
    note: 'Some stakeholders now sit on the floor.',
  },
] as const;

export const interview = [
  {
    question: 'What are your strongest skills?',
    answer:
      'Spatial awareness. I know exactly where you need to put your hand, and I am already there.',
  },
  {
    question: 'When are you available?',
    answer:
      'Between naps. It is a narrow but highly productive window. Please also account for looking out of the other window.',
  },
  {
    question: 'Do you work well with a team?',
    answer: 'I work beautifully alongside people who understand that I am supervising.',
  },
  {
    question: 'Where do you see yourself in five years?',
    answer: 'In the same sunbeam. With better compensation.',
  },
  {
    question: 'What motivates you?',
    answer:
      'A meaningful challenge, recognition for my work, and compensation that makes a small rattling noise.',
  },
] as const;

export const assetAlt: Record<string, string> = {
  hero: 'Miso, an amber-eyed ginger tabby with cream muzzle, white toes, and a striped tail, sitting confidently.',
  'laptop-scene': work[0].alt,
  'box-inspection': work[1].alt,
  'sofa-scene': work[2].alt,
  sleepy: 'Miso resting his chin on his folded front paws, eyes closed, on the oak desk.',
  awake: 'Miso in the same position on the desk, now with his amber eyes open.',
  'resume-portrait': 'A close portrait of Miso with amber eyes and a cream muzzle and chest.',
  'meeting-cameo':
    'Miso sitting by the laptop in his sunny home studio, ready to interrupt a meeting.',
  'window-portrait': 'Miso watching the world from the sunlit studio windowsill.',
  'box-detail': 'Miso inspecting the rim of his cardboard box, his white toes visible.',
  'laptop-detail': 'A close view of Miso resting on the laptop, paws near the keyboard.',
};
export const disclosure =
  'Fictional cat. Imaginary jobs. No money or treats change paws. Your offer stays in this browser.';
