import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    /*
     * user_id seja igual ao req.userId (id do token, do usuário logado)
     * agendamentos que não foram cancelados: canceled_at: null
     * * Forma de ordenar: order:
     */
    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20, // Se estiver na página 1, não pula registros
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'], // Necessário fornecer o caminho path
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails ' });
    }

    const { provider_id, date } = req.body;

    // Checar se o provider_id é válido
    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'You cant only create appointments with providers ' });
    }

    // hourStart pega apenas o inicio da hora
    // parseISO transforma para um
    const hourStart = startOfHour(parseISO(date));

    // Verifica se o hourStart é antes da data atual
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past date are not permitted' });
    }

    // Verifica se há agendamentos para o mesmo horário
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not avaliable' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
