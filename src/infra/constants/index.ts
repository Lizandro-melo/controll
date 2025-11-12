import Assas from "../assas";

export const NAME_COOKIE_SESSION = "session_uuid_controll";

export const MARCA_MOTOS = [
  "Honda",
  "Yamaha",
  "Suzuki",
  "Kawasaki",
  "BMW Motorrad",
  "Ducati",
  "Harley-Davidson",
  "Triumph",
  "Royal Enfield",
  "KTM",
  "CFMoto",
  "Shineray",
  "Haojue",
  "Kasinski",
  "Dafra",
  "Benelli",
  "MV Agusta",
  "Aprilia",
  "Bajaj",
  "Vespa",
  "Piaggio",
  "Moto Guzzi",
  "GasGas",
  "Husqvarna",
  "TVS",
];

export const MARCA_CARROS = [
  // Marcas populares no Brasil
  "Volkswagen",
  "Chevrolet",
  "Fiat",
  "Ford",
  "Toyota",
  "Honda",
  "Hyundai",
  "Renault",
  "Nissan",
  "Peugeot",
  "Citroën",
  "Jeep",

  // Marcas premium e esportivas
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volvo",
  "Lexus",
  "Porsche",
  "Jaguar",
  "Land Rover",
  "Mini",
  "Tesla",

  // Marcas americanas
  "Dodge",
  "Chrysler",
  "Ram",
  "Cadillac",
  "Buick",
  "GMC",

  // Marcas japonesas
  "Subaru",
  "Mitsubishi",
  "Mazda",
  "Suzuki",

  // Outras conhecidas
  "Kia",
  "Chery",
  "BYD",
  "Great Wall Motors (GWM)",
  "JAC Motors",
  "Geely",
  "Troller",
];

export const TIPO_PECA = [
  "PNEU",

  "PASTILHA_FREIO",
  "DISCO_FREIO",
  "SAPATA_FREIO",

  "EMBREAGEM_PLATO",
  "EMBREAGEM_DISCO",
  "EMBREAGEM_ROLAMENTO",
  "MOLAS_EMBREAGEM",

  "CORRENTE_TRANSMISSAO",
  "COROA_TRANSMISSAO",
  "PINHAO_TRANSMISSAO",

  "CORREIA_DENTADA",
  "CORREIA_ALTERNADOR",
  "CORREIA_ACESSORIOS",

  "VELA_IGNICAO",

  "AMORTECEDOR",
  "AMORTECEDOR_DIANTEIRO",
  "AMORTECEDOR_TRASEIRO",
  "BUCHA_SUSPENSAO",
  "PIVO_SUSPENSAO",

  "TERMINAL_DIRECAO",
  "ROLAMENTO_DIRECAO",

  "COXIM_MOTOR",
  "COXIM_CAMBIO",

  "BATERIA",
  "ESCOVA_ALTERNADOR",
  "ESCOVA_MOTOR_PARTIDA",
  "LAMPADA",

  "ROLAMENTO_RODA",

  "CABO_EMBREAGEM",
  "CABO_ACELERADOR",
  "CABO_FREIO",

  "FILTRO_AR",
  "FILTRO_OLEO",
  "FILTRO_COMBUSTIVEL",
  "FILTRO_CABINE",

  "CONSUMIVEL_OLEO_MOTOR",
  "CONSUMIVEL_FLUIDO_FREIO",
  "CONSUMIVEL_FLUIDO_ARREFECIMENTO",

  "MANOPLA",
  "PEDALEIRA",
];

export const DAYS_EXPIRE_SESSION = 30;
export const DAYS_EXPIRE_SUB = -2;
export const SALT_ROUNDS = 10;
export const ASSAS = new Assas(process.env.PAY!, "Sandbox");
export const VALOR_SISTEMA = 50;
