// Transforma uma função de callback em async await
import { promisify } from 'util';
//
import jwt from 'jsonwebtoken';
// O segredo está na auth, então será necessário utilizar para descriptografar
// e verificar se é válido
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // Vai retornar um array com as duplas palavras
  // Baerer e token[1]
  const [, token] = authHeader.split(' ');

  try {
    // Método verify do jwt
    // retorna um objeto ou string
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // Agora que temos o id do usuário em decoded, vamos passar no req
    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
