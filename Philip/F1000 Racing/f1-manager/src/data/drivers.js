// Driver pools for F1, F2, IndyCar (>=30 total)

export const f1Drivers = [
  { id: 'max-verstappen', name: 'Max Verstappen', age: 26, series: 'F1', price: 28, stats: { speed: 96, overtaking: 94, cornering: 95, experience: 92 } },
  { id: 'lewis-hamilton', name: 'Lewis Hamilton', age: 39, series: 'F1', price: 26, stats: { speed: 94, overtaking: 92, cornering: 92, experience: 97 } },
  { id: 'charles-leclerc', name: 'Charles Leclerc', age: 26, series: 'F1', price: 23, stats: { speed: 92, overtaking: 89, cornering: 91, experience: 86 } },
  { id: 'lando-norris', name: 'Lando Norris', age: 24, series: 'F1', price: 22, stats: { speed: 91, overtaking: 90, cornering: 90, experience: 84 } },
  { id: 'george-russell', name: 'George Russell', age: 26, series: 'F1', price: 21, stats: { speed: 90, overtaking: 87, cornering: 90, experience: 83 } },
  { id: 'carlos-sainz', name: 'Carlos Sainz', age: 29, series: 'F1', price: 21, stats: { speed: 90, overtaking: 87, cornering: 89, experience: 88 } },
  { id: 'oscar-piastri', name: 'Oscar Piastri', age: 23, series: 'F1', price: 18, stats: { speed: 88, overtaking: 85, cornering: 88, experience: 78 } },
  { id: 'sergio-perez', name: 'Sergio Pérez', age: 34, series: 'F1', price: 19, stats: { speed: 88, overtaking: 90, cornering: 86, experience: 90 } },
  { id: 'kevin-magnussen', name: 'Kevin Magnussen', age: 31, series: 'F1', price: 12, stats: { speed: 82, overtaking: 83, cornering: 80, experience: 86 } },
  { id: 'fernando-alonso', name: 'Fernando Alonso', age: 42, series: 'F1', price: 20, stats: { speed: 89, overtaking: 91, cornering: 89, experience: 98 } },
  { id: 'pierre-gasly', name: 'Pierre Gasly', age: 28, series: 'F1', price: 16, stats: { speed: 86, overtaking: 84, cornering: 86, experience: 86 } },
  { id: 'esteban-ocon', name: 'Esteban Ocon', age: 27, series: 'F1', price: 16, stats: { speed: 86, overtaking: 83, cornering: 85, experience: 85 } },
  { id: 'valtteri-bottas', name: 'Valtteri Bottas', age: 34, series: 'F1', price: 15, stats: { speed: 85, overtaking: 82, cornering: 84, experience: 91 } },
  { id: 'zhou-guanyu', name: 'Zhou Guanyu', age: 25, series: 'F1', price: 13, stats: { speed: 83, overtaking: 80, cornering: 82, experience: 78 } },
  { id: 'alex-albon', name: 'Alex Albon', age: 28, series: 'F1', price: 15, stats: { speed: 85, overtaking: 84, cornering: 84, experience: 84 } },
  { id: 'yuki-tsunoda', name: 'Yuki Tsunoda', age: 24, series: 'F1', price: 13, stats: { speed: 83, overtaking: 84, cornering: 82, experience: 76 } },
  { id: 'lance-stroll', name: 'Lance Stroll', age: 25, series: 'F1', price: 13, stats: { speed: 83, overtaking: 81, cornering: 82, experience: 84 } },
  { id: 'daniel-ricciardo', name: 'Daniel Ricciardo', age: 35, series: 'F1', price: 14, stats: { speed: 84, overtaking: 86, cornering: 83, experience: 90 } },
  { id: 'nico-hulkenberg', name: 'Nico Hülkenberg', age: 36, series: 'F1', price: 13, stats: { speed: 83, overtaking: 82, cornering: 83, experience: 90 } },
  { id: 'logan-sargeant', name: 'Logan Sargeant', age: 23, series: 'F1', price: 10, stats: { speed: 80, overtaking: 78, cornering: 79, experience: 65 } },
]

export const f2Drivers = [
  { id: 'frederik-vesti', name: 'Frederik Vesti', age: 23, series: 'F2', price: 12, stats: { speed: 82, overtaking: 80, cornering: 82, experience: 75 } },
  { id: 'theo-pourchaire', name: 'Théo Pourchaire', age: 20, series: 'F2', price: 14, stats: { speed: 85, overtaking: 83, cornering: 84, experience: 74 } },
  { id: 'oliver-bearman', name: 'Oliver Bearman', age: 19, series: 'F2', price: 13, stats: { speed: 84, overtaking: 80, cornering: 83, experience: 70 } },
  { id: 'ayumu-iwasa', name: 'Ayumu Iwasa', age: 22, series: 'F2', price: 12, stats: { speed: 83, overtaking: 81, cornering: 82, experience: 73 } },
  { id: 'enzo-fittipaldi', name: 'Enzo Fittipaldi', age: 22, series: 'F2', price: 11, stats: { speed: 81, overtaking: 80, cornering: 80, experience: 72 } },
  { id: 'jak-crawford', name: 'Jak Crawford', age: 19, series: 'F2', price: 11, stats: { speed: 80, overtaking: 79, cornering: 80, experience: 68 } },
  { id: 'liam-lawson', name: 'Liam Lawson', age: 22, series: 'F2', price: 15, stats: { speed: 86, overtaking: 85, cornering: 85, experience: 78 } },
  { id: 'dennis-hauger', name: 'Dennis Hauger', age: 21, series: 'F2', price: 11, stats: { speed: 80, overtaking: 79, cornering: 79, experience: 70 } },
  { id: 'isaac-hadjar', name: 'Isaac Hadjar', age: 19, series: 'F2', price: 12, stats: { speed: 82, overtaking: 80, cornering: 81, experience: 68 } },
  { id: 'victor-martins', name: 'Victor Martins', age: 22, series: 'F2', price: 13, stats: { speed: 84, overtaking: 82, cornering: 83, experience: 72 } },
]

export const indyDrivers = [
  { id: 'scott-dixon', name: 'Scott Dixon', age: 43, series: 'IndyCar', price: 18, stats: { speed: 89, overtaking: 88, cornering: 86, experience: 96 } },
  { id: 'alex-palou', name: 'Alex Palou', age: 27, series: 'IndyCar', price: 20, stats: { speed: 91, overtaking: 90, cornering: 89, experience: 90 } },
  { id: 'pato-oward', name: "Pato O'Ward", age: 25, series: 'IndyCar', price: 17, stats: { speed: 88, overtaking: 87, cornering: 86, experience: 82 } },
  { id: 'colton-herta', name: 'Colton Herta', age: 24, series: 'IndyCar', price: 16, stats: { speed: 87, overtaking: 85, cornering: 85, experience: 80 } },
  { id: 'josef-newgarden', name: 'Josef Newgarden', age: 33, series: 'IndyCar', price: 18, stats: { speed: 89, overtaking: 88, cornering: 87, experience: 91 } },
  { id: 'will-power', name: 'Will Power', age: 43, series: 'IndyCar', price: 17, stats: { speed: 87, overtaking: 86, cornering: 85, experience: 95 } },
  { id: 'felix-rosenqvist', name: 'Felix Rosenqvist', age: 32, series: 'IndyCar', price: 14, stats: { speed: 84, overtaking: 83, cornering: 83, experience: 86 } },
  { id: 'marcus-ericsson', name: 'Marcus Ericsson', age: 33, series: 'IndyCar', price: 15, stats: { speed: 85, overtaking: 84, cornering: 84, experience: 90 } },
  { id: 'rinus-veekay', name: 'Rinus VeeKay', age: 24, series: 'IndyCar', price: 14, stats: { speed: 84, overtaking: 84, cornering: 83, experience: 78 } },
  { id: 'graham-rahal', name: 'Graham Rahal', age: 35, series: 'IndyCar', price: 13, stats: { speed: 83, overtaking: 82, cornering: 82, experience: 90 } },
]

export const allDrivers = [...f1Drivers, ...f2Drivers, ...indyDrivers]

