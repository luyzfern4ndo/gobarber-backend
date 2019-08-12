import jwt from 'jsonwebtoken';

import * as Yup from 'yup';

import User from '../models/User';

import authConfig from '../../config/auth';

// yarn add jsonwebtoken
class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(), // verifica se tem arroba, tudo certinho
      password: Yup.string().required(),
    });

    // Verificar se o body está recebendo esse schema

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      // 401 Não autorizado
      return res.status(401).json({ error: 'User not found' });
    }

    // Método criado no Model de User
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // id e nome para retornar assim que realizar a sessão
    const { id, name } = user;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      // Payload são informações adicionais.
      // É um objeto
      // Segundo parâmetro precisa ser uma string segura
      // https://www.md5online.org/ - Utilizado para gerar a criptografia da string
      // 3º parâmetro (data de expiração)
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
