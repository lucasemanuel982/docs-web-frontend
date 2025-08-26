import { useState } from "react";
import Modal from '../components/Modal';
import ResponsiveHeader from '../components/ResponsiveHeader';

const plans = [
  {
    name: "Basic",
    price: "R$ 12,99/mês",
    discount: "72% OFF",
    highlight: "MAIS POPULAR",
    features: [
      "Crie até 25 Documentos",
      "Tamanho máximo por Documento: 20 MB",
      "Número de pessoas por Documento: 5",
      "Até 10 Usuários"
    ],
    button: "Escolher plano",
    color: "bg-blue-100 border-blue-500"
  },
  {
    name: "Premium",
    price: "R$ 14,99/mês",
    discount: "77% OFF",
    highlight: "RECOMENDADO",
    features: [
      "Crie até 50 Documentos",
      "Tamanho máximo por Documento: 50 MB",
      "Número de pessoas por Documento: 10",
      "Até 20 Usuários"
    ],
    button: "Escolher plano",
    color: "bg-white border-blue-500"
},
{
    name: "Business",
    price: "R$ 39,99/mês",
    discount: "71% OFF",
    highlight: null,
    features: [
        "Documentos ilimitados",
        "Tamanho máximo por Documento: 1 GB",
        "Número de pessoas por Documento: ilimitado",
        "Usuários ilimitados"
    ],
    button: "Escolher plano",
    color: "bg-white border-blue-500"
  }
];

export default function Pricing() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleUnavailable = (msg: string) => {
    setModalMessage(msg);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div className="min-h-screen bg-dark-custom text-white font-inter">
      <ResponsiveHeader />
      <main className="flex flex-col items-center py-12 px-4">
        <h1 className="text-4xl font-bold mb-2 text-center">Planos</h1>
        <p className="mb-8 text-custom-muted text-lg text-center">Escolha o plano ideal para você</p>
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl justify-center">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex-1 border-2 border-blue-700 rounded-3xl shadow-xl p-8 relative bg-dark-custom transition hover:scale-105 duration-200`}
            >
              {plan.highlight && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-6 py-2 rounded-t-3xl shadow-lg">
                  {plan.highlight}
                </span>
              )}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded">{plan.discount}</span>
              </div>
              <div className="text-4xl font-extrabold text-blue-400 mb-2">{plan.price}</div>
              <div className="text-base text-blue-300 mb-4">+3 meses grátis</div>
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-white">
                    <span className="text-green-400 font-bold">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-2xl transition text-lg"
                onClick={() => handleUnavailable('Esta funcionalidade ainda não está disponível.')}
              >
                {plan.button}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center text-custom-muted text-base">
          O pagamento pode ser parcelado em até 12x
          <div className="flex justify-center gap-3 mt-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" className="h-6" />
          </div>
        </div>
        <button className="mt-8 px-8 py-3 bg-blue-100 text-blue-700 font-bold rounded-2xl hover:bg-blue-200 transition text-lg shadow">
          Comparar planos
        </button>
      </main>
      <Modal open={modalOpen} onClose={closeModal}>
        <h2 className="text-xl font-bold mb-2 text-blue-700">Funcionalidade Indisponível</h2>
        <p className="text-gray-700 mb-4">{modalMessage}</p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-2xl transition text-lg"
          onClick={closeModal}
        >
          OK
        </button>
      </Modal>
    </div>
  );
}
