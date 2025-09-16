import { loginSteps } from '../steps/login.steps';
import { config } from '../utils/config';

describe('GitHub Login Tests', () => {
  it('TST-1: успешный вход с валидными учетными данными', async () => {
    await loginSteps.performSuccessfulLogin(
      config.users.valid.username,
      config.users.valid.password
    );
  });

  it('TST-6: неуспешный вход с валидным логином и невалидным паролем', async () => {
    await loginSteps.performUnsuccessfulLogin(
      config.users.valid.username,
      config.users.invalid.password
    );
  });

  it('TST-5: успешный вход с верной почтой и валидным паролем', async () => {
    await loginSteps.performSuccessfulLogin(
      config.users.valid.email,
      config.users.valid.password
    );
  });

  it('TST-7: неуспешный вход с помощью верной почты и неверного пароля ', async () => {
    await loginSteps.performUnsuccessfulLogin(
      config.users.valid.email,
      config.users.invalid.password
    );
  });

  it('TST-14: проверка ссылки Forgot password?', async () => {
    await loginSteps.clickForgotPasswordLink();
    await loginSteps.verifyPasswordResetPageDisplayed();
  });

  it('TST-28: выход через меню пользователя', async () => {
    // 1. Сначала выполняем успешный вход
    await loginSteps.performSuccessfulLogin(
      config.users.valid.username,
      config.users.valid.password
    );

    // 2. Переходим к выходу через меню
    await loginSteps.navigateToLogoutViaMenu();

    // 3. Проверяем, что выход выполнен успешно
    await loginSteps.verifyLoggedOut();
  });

  it('TST-28: выход из аккаунта через прямую ссылку', async () => {
    // 1. Сначала выполняем успешный вход
    await loginSteps.performSuccessfulLogin(
      config.users.valid.username,
      config.users.valid.password
    );

    // 2. Прямой переход на страницу выхода
    await loginSteps.navigateToLogoutDirect();

    // 3. Выполняем выход
    await loginSteps.performLogout(config.users.valid.username);

    // 4. Проверяем, что выход выполнен успешно
    await loginSteps.verifyLoggedOut();
  });
});