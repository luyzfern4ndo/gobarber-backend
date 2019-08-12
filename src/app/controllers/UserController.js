// Yup não tem export default
import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  // Função store é assíncrona e tem o mesmo comportamento de um middleware
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(), // verifica se tem arroba, tudo certinho
      password: Yup.string()
        .required()
        .min(6), // Mínimo de 6 caracteres na senha
    });

    // Verificar se o body está recebendo esse schema

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // Ao passar o req.body no create, significa que poderemos utilizar todos os
    // dados informados no body. É melhor ao invés de definir campo por campo.
    const { id, name, email, provider } = await User.create(req.body);
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(), // verifica se tem arroba, tudo certinho
      oldPassword: Yup.string().min(6), // Mínimo de 6 caracteres na senha
      password: Yup.string()
        .min(6) // validação condicional
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    // Verificar se o body está recebendo esse schema

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Evitar que essa rota seja acessada por um usuário que não esteja logado
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId); // Pesquisa por chave primária

    if (email !== user.email) {
      const userExists = await User.findOne({
        where: { email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
