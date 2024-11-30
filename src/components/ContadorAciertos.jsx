const ContadorAciertos = ({ aciertos, totalQuestions }) => {

    // Función para calcular el porcentaje de aciertos
    const calculatePercentage = (category) => {
      const aciertosCategory = aciertos[category];
      const totalQuestionsCategory = totalQuestions[category];
      return totalQuestionsCategory === 0 ? 0 : (aciertosCategory / totalQuestionsCategory) * 100;
    };
  
    return (
      <div className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 p-6 rounded-lg shadow-lg text-white max-w-md mx-auto m-6">
        <h3 className="text-2xl font-semibold text-center mb-4">Hits by Category</h3>
        <div className="grid grid-cols-[auto_auto_auto_auto] gap-4 text-center font-semibold">
            <div className="font-semibold text-lg">Category</div>
            <div className="font-semibold text-lg">Hits</div>
            <div className="font-semibold text-lg">Total</div>
            <div className="font-semibold text-lg">Percentage</div>
  
          {Object.keys(aciertos).map((cat) => {
            const aciertosCategory = aciertos[cat];
            const totalQuestionsCategory = totalQuestions[cat];
            const percentage = calculatePercentage(cat).toFixed(2);
  
            return (
              <>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg shadow-md">{cat}</div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg shadow-md">{aciertosCategory}</div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg shadow-md">{totalQuestionsCategory}</div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg shadow-md">{percentage} %</div>
              </>
            );
          })}
        </div>
      </div>
    );
  };
  
  export default ContadorAciertos;
  