import { useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice } from '@fortawesome/free-solid-svg-icons';
import Pregunta from './Pregunta'; // Importamos el componente Pregunta

const categoryColors = {
  "General Knowledge": "#4CAF50",
  "Entertainment: Film": "#FF5722",
  "History": "#9E9E9E",
  "Art": "#F44336",
  "Science & Nature": "#009688",
  "Sports": "#FF5722",
  "Geography": "#00BCD4",
  "Entertainment: Television": "#3F51B5",
};

const categoryIcons = {
  "General Knowledge": "📖",
  "Entertainment: Film": "🎥",
  "History": "🏛️",
  "Art": "🎨",
  "Science & Nature": "🔬",
  "Sports": "⚽",
  "Geography": "🗺️",
  "Entertainment: Television": "📺",
};

const data = Object.keys(categoryIcons).map((category) => ({
  option: categoryIcons[category],
  style: {
    backgroundColor: categoryColors[category],
    textColor: 'white',
  },
}));

export default function Roulette() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [categoryName, setCategoryName] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const handleSpinStop = () => {
    setMustSpin(false);
    const selectedOption = data[prizeNumber].option; 
    const category = Object.keys(categoryIcons).find(
      (key) => categoryIcons[key] === selectedOption
    );
    setCategoryName(category); 
    setReloadKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        outerBorderColor={['white']}
        radiusLineColor={['white']}
        onStopSpinning={handleSpinStop}
      />
      <button 
        onClick={handleSpinClick}
        className="m-auto mt-4 py-2 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
      >
        <FontAwesomeIcon icon={faDice} className="mr-2" />
        SPIN
      </button>
       {/* Mostrar el mensaje animado si no hay categoría seleccionada */}
       {!categoryName && (
        <div className="text-3xl font-bold text-center animate-pulse m-8">
          What are you waiting for to throw?
        </div>
      )}
      {categoryName && (
        <div className="m-4 text-xl font-bold italic">
          {categoryName}
        </div>
      )}
      {/* Mostramos el componente Pregunta si hay una categoría seleccionada */}
      {categoryName && <Pregunta category={categoryName} reload={reloadKey} />}
    </div>
  );
}
