// src/types/express/index.d.ts

export{};

declare global {
  namespace Express {
    export interface Request {
      user_id?: number
    }
  }
}
