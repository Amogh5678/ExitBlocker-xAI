export default function ResultCard({ result }) {
  if (!result) return null;

  return (
    <div className="p-4 bg-green-100 border rounded mt-4">
      <h3 className="text-lg font-bold">
        Prediction: {result.prediction}
      </h3>
      <p>Probability: {result.probability}</p>
    </div>
  );
}
