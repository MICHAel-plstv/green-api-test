import { ApiError } from '@/store/api';

export const deriveApiUrl = (idInstance: string) =>
  `https://${idInstance.slice(0, 4)}.api.greenapi.com`;

export const getLoginError = (error: unknown) => {
  if (error instanceof ApiError && error.status === 401) {
    return 'Неверный Instance ID или Token Instance API';
  }
  if (error instanceof TypeError) {
    return 'Сервер не отвечает, проверьте Url API';
  }
  if (error instanceof DOMException && error.name === 'TimeoutError') {
    return 'Сервер не отвечает, попробуйте ещё раз';
  }

  return 'Не удалось проверить инстанс, попробуйте ещё раз';
};
