import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;

  secret: string;

  frontend_url: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  secret: process.env.SECRET_KEY || '',
  frontend_url: process.env.FRONTEND_URL || '',
};

export default config;