import { test, expect } from '@playwright/test';

test.describe('Fluxo Completo de Pedido SweetBox', () => {

  test('Realizar pedido com sucesso', async ({ page }) => {

    // LOGIN FAKE
    await page.addInitScript(() => {

      sessionStorage.setItem(
        'usuario',
        JSON.stringify({
          idUsuario: 1,
          nome: 'Larissa',
          email: 'lissa@gmail.com',
          idPerfil: 1
        })
      );

      sessionStorage.setItem(
        'token',
        'token-fake'
      );

      sessionStorage.setItem(
        'isAuthenticated',
        'true'
      );

    });

    // ABRIR PÁGINA
    await page.goto('http://localhost:5173/pedido');

    await page.waitForLoadState('domcontentloaded');

    // VALIDAR TELA
    await expect(
      page.getByText('Monte seu Pedido')
    ).toBeVisible();

    // Screenshot inicial
    await page.screenshot({
      path: 'evidencias/01-pagina-pedidos.png',
      fullPage: true
    });

    // ABRIR PRODUTO
    await page.locator('.card-hover').first().click();

    // Selecionar tamanho
    await page.selectOption('#tamanho', { index: 1 });

    // Selecionar massa
    await page.selectOption('#massa', { index: 1 });

    // Selecionar recheios
    await page.getByTestId('recheio1')
      .getByText(/^Ninho\s*$/)
      .click();

    await page.getByTestId('recheio2')
      .getByText(/^Morango\s*$/)
      .click();

    // Screenshot produto
    await page.screenshot({
      path: 'evidencias/02-produto-selecionado.png',
      fullPage: true
    });

    // ADICIONAR AO CARRINHO
    await page.getByText('Adicionar').click();

    // Abrir carrinho
    await page.getByText('🛒').click();

    // FINALIZAR PEDIDO
    await page.getByText('Finalizar Pedido').click();

    // Validar tela
    await expect(
      page.getByText('Finalizar Pedido')
    ).toBeVisible();

    // Selecionar data
    const hoje = new Date();

    hoje.setDate(hoje.getDate() + 5);

    const data = hoje.toISOString().split('T')[0];

    await page.fill('#dataEntrega', data);

    // Selecionar horário
    await page.getByText('07:00').click();

    // Screenshot finalização
    await page.screenshot({
      path: 'evidencias/03-finalizacao.png',
      fullPage: true
    });

    // IR PAGAMENTO
    await page.getByText('Ir para Pagamento').click();

    // Validar tela pagamento
    await expect(
      page.getByText('Forma de pagamento')
    ).toBeVisible();

    // Screenshot pagamento
    await page.screenshot({
      path: 'evidencias/04-pagamento.png',
      fullPage: true
    });

    // PAGAMENTO PIX
    await page.click('#btnPix');

    // Confirmar pagamento
    await page.click('#confirmarPagamento');

    // Esperar navegação
    await page.waitForURL(/pedidoConfirmado/);

    // VALIDAR CONFIRMAÇÃO
    await expect(
      page.locator('body')
    ).toContainText(/pedido/i);

    // Screenshot confirmação
    await page.screenshot({
      path: 'evidencias/05-pedido-confirmado.png',
      fullPage: true
    });

    // LOGS
    console.log('Pedido realizado com sucesso!');
    console.log('Data selecionada:', data);
    console.log('Pagamento via PIX confirmado.');

  });

});