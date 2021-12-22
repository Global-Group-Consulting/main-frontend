export interface WithdrawalCard {
  img: string;
  href: string;
  title: string;
  text: string;
  amount: number;
  id: string;
  active: boolean;
  stepper: number;
  maxPerType: number;
}

export interface WithdrawalCardStored {
  amount: number;
  id: string;
}

/**
 * Lista delle card disponbili a sistema.
 * Sicuramente queste card dovranno essere salvaten a DB con una normale CRUD in quanto
 * devono essere gestite dinamicamente permettendo all'utente di modificare i vari dati a piacimento.
 */
export const CardsList: WithdrawalCard[] = [
  {
    img: "epipoli.png",
    href: "https://www.epipoli.com/prodotti-consumatore/carte-prepagate/carta-prepagata-mastercard-usa-getta-non-nominale-fisica/",
    title: "Epipoli Prepagata Mastercard",
    text: "Monouso e non collegata ad un conto corrente, è la soluzione per i tuoi acquisti in sicurezza su tutto il circuito Mastercard",
    amount: 0,
    id: "prepagata",
    active: true,
    stepper: 50,
    maxPerType: 1
  },
  {
    img: "giftcard_carburante.png",
    href: "https://www.epipoli.com/prodotti-consumatore/carte-prepagate/carta-carburante-prepagata-ricaricabile-mygiftcard/",
    title: "MyGiftCard Carburante",
    text: "La carta carburante multimarca per fare rifornimento in tutte le stazioni ed emettere un’unica fattura elettronica a fine mese",
    amount: 0,
    id: "carburante",
    active: false,
    stepper: 50,
    maxPerType: 5
  },
  {
    img: "giftcard_square.png",
    href: "https://www.epipoli.com/soluzioni-aziende/gift-card-engagement-welfare/mygiftcard-square-gift-card-engagement/",
    title: "MyGiftCard Square",
    text: "La carta delle carte che può essere convertita nelle Gift Card dei migliori marchi: la libertà di scelta a portata di click",
    amount: 0,
    id: "square",
    active: false,
    stepper: 50,
    maxPerType: 5
  }
]
