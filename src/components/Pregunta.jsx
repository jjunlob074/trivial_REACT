import React, { useState, useEffect } from 'react';
import ContadorAciertos from './ContadorAciertos';
import confetti from 'canvas-confetti';

const Pregunta = ({ category, reload }) => {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Estado para manejar la respuesta seleccionada
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null); // Estado para saber si la respuesta es correcta
  const [shuffledAnswers, setShuffledAnswers] = useState([]); // Estado para manejar las respuestas barajeadas
  const [aciertos, setAciertos] = useState({
    "General Knowledge": 0,
    "Entertainment: Film": 0,
    "History": 0,
    "Art": 0,
    "Science & Nature": 0,
    "Sports": 0,
    "Geography": 0,
    "Entertainment: Television": 0,
  });
  const [totalQuestions, setTotalQuestions] = useState({
    "General Knowledge": 0,
    "Entertainment: Film": 0,
    "History": 0,
    "Art": 0,
    "Science & Nature": 0,
    "Sports": 0,
    "Geography": 0,
    "Entertainment: Television": 0,
  });

  // Category IDs mapping inside Pregunta component
  const categoryIDs = {
    "General Knowledge": 9,
    "Entertainment: Film": 11,
    "History": 23,
    "Art": 25,
    "Science & Nature": 17,
    "Sports": 21,
    "Geography": 22,
    "Entertainment: Television": 14,
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        setError('');
        setSelectedAnswer(null);
        
        const categoryId = categoryIDs[category]; // Get the category ID from the category name
        if (!categoryId) {
          setError('Invalid category');
          setLoading(false);
          return;
        }

        const response = await fetch(`https://opentdb.com/api.php?amount=1&category=${categoryId}&type=multiple`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const currentQuestion = data.results[0]; // Get the first question

          const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
          const shuffled = allAnswers.sort(() => Math.random() - 0.5); // Shuffle answers
          
          setQuestion(currentQuestion); // Set the question data
          setShuffledAnswers(shuffled); // Set the shuffled answers

          // Update total questions count for the category
          setTotalQuestions(prevTotalQuestions => ({
            ...prevTotalQuestions,
            [category]: prevTotalQuestions[category] + 1,
          }));
        } else {
          setError('No se encontraron preguntas para esta categoría.');
        }
        setLoading(false);
      } catch (error) {
        setError(`Error al cargar la pregunta: ${error.message}`);
        setLoading(false);
      }
    };

    if (category) {
      fetchQuestion();
    }
  }, [category, reload]);

  const handleAnswerClick = (answer) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    const isCorrect = answer === question.correct_answer;
    setIsAnswerCorrect(isCorrect);

    // Actualizar el contador de aciertos si la respuesta es correcta
    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setAciertos(prevAciertos => ({
        ...prevAciertos,
        [category]: prevAciertos[category] + 1,
      }));
    }
  };

  // Función para calcular el porcentaje de aciertos
  const calculatePercentage = (category) => {
    const aciertosCategory = aciertos[category];
    const totalQuestionsCategory = totalQuestions[category];
    return totalQuestionsCategory === 0 ? 0 : (aciertosCategory / totalQuestionsCategory) * 100;
  };

  if (loading) {
    return <div role="status" className="mt-6">
      <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
      <span className="sr-only">Loading...</span>
    </div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (question) {
    return (
      <>
      <div className="m-2 p-4 border border-gray-300 rounded-md shadow-lg bg-gradient-to-r from-indigo-600 via-blue-800 to-blue-800 text-white">
        <h2 className="text-xl italic font-semibold text-center" dangerouslySetInnerHTML={{ __html: question.question }} />
        <ul className="mt-4">
          {shuffledAnswers.map((answer, index) => (
            <li
              key={index}
              className={`options-question group py-4 px-6 mb-2 border-2 border-white rounded-xl hover:bg-yellow-600 transition-transform duration-300 cursor-pointer ${
                selectedAnswer === answer ? (isAnswerCorrect ? 'bg-green-500' : 'bg-red-500') : ''
              }`}
              onClick={() => handleAnswerClick(answer)}
            >
              <span
                className="font-bold transition-transform duration-300 group-hover:italic transform"
                dangerouslySetInnerHTML={{ __html: answer }}
              />
            </li>
          ))}
        </ul>
        {selectedAnswer && (
          <div className="mt-4 text-center">
            {isAnswerCorrect ? (
              <p className="text-green-500 font-semibold"><u>Correct answer! :)</u></p>
            ) : (
              <p className="text-red-500 font-semibold"><u>Incorrect :( The correct answer was: <span className="font-bold">{question.correct_answer}</span></u></p>
            )}
            <p className="mt-2 text-white font-medium">Category: {category}</p>
            <p className="mt-1 text-white font-medium">Correct answer percentage: {calculatePercentage(category).toFixed(2)}%</p>
          </div>
        )}

      </div>
      <ContadorAciertos aciertos={aciertos} totalQuestions={totalQuestions} />
      </>
    );
  }

  return null;
};

export default Pregunta;
